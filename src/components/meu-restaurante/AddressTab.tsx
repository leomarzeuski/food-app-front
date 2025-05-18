import { useState } from "react";
import restaurantService from "@/services/restaurantService";
import type { Restaurant } from "@/services/restaurantService";
import AddressForm from "@/components/AddressForm";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

interface AddressTabProps {
  restaurant: Restaurant;
  onRestaurantUpdate: (updatedRestaurant: Restaurant) => void;
}

interface ExtendedAddress {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default function AddressTab({
  restaurant,
  onRestaurantUpdate,
}: AddressTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [addressData, setAddressData] = useState<ExtendedAddress>({
    cep: restaurant.endereco.cep || "",
    rua: restaurant.endereco.rua || "",
    numero: restaurant.endereco.numero || "",
    complemento: "",
    bairro: "",
    cidade: restaurant.endereco.cidade || "",
    estado: restaurant.endereco.estado || "",
  });
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (data: ExtendedAddress) => {
    setAddressData(data);
  };

  const handleSaveAddress = async () => {
    if (
      !addressData.cep ||
      !addressData.rua ||
      !addressData.numero ||
      !addressData.cidade ||
      !addressData.estado
    ) {
      alert("Por favor, preencha todos os campos obrigatórios do endereço.");
      return;
    }

    setLoading(true);
    try {
      const updatedRestaurant = await restaurantService.updateRestaurant(
        restaurant.id,
        {
          endereco: {
            rua: addressData.rua,
            numero: addressData.numero,
            cidade: addressData.cidade,
            estado: addressData.estado,
            cep: addressData.cep,
          },
        }
      );

      onRestaurantUpdate(updatedRestaurant);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Não foi possível atualizar o endereço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Endereço do Restaurante</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
          >
            <FaEdit className="mr-1" /> Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-gray-50 p-6 rounded-lg">
          <AddressForm
            initialValues={{
              cep: restaurant.endereco.cep,
              rua: restaurant.endereco.rua,
              numero: restaurant.endereco.numero,
              cidade: restaurant.endereco.cidade,
              estado: restaurant.endereco.estado,
              complemento: "",
              bairro: "",
            }}
            onAddressChange={handleAddressChange}
          />
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleSaveAddress}
              disabled={loading}
              className={`px-4 py-2 rounded flex items-center ${
                loading
                  ? "bg-gray-400 text-white"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {loading ? (
                "Salvando..."
              ) : (
                <>
                  <FaCheck className="mr-1" /> Salvar Endereço
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 flex items-center"
            >
              <FaTimes className="mr-1" /> Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Endereço:</span>{" "}
              {restaurant.endereco.rua}, {restaurant.endereco.numero}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Cidade/Estado:</span>{" "}
              {restaurant.endereco.cidade}/{restaurant.endereco.estado}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">CEP:</span>{" "}
              {restaurant.endereco.cep}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
