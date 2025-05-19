import { Restaurant } from "@/services/restaurantService";

export const InfoTabComponent = ({
  restaurant,
}: {
  restaurant: Restaurant;
}) => (
  <div className="mt-6">
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="font-bold mb-2">Status</h3>
        <p className="text-gray-700">
          {restaurant.isOpen ? "Aberto" : "Fechado"}
        </p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Endereço</h3>
        <p className="text-gray-700">
          {restaurant.endereco.rua}, {restaurant.endereco.cidade},{" "}
          {restaurant.endereco.estado} - {restaurant.endereco.cep}
        </p>
      </div>
      <div>
        <h3 className="font-bold mb-2">Taxa de Entrega</h3>
        <p className="text-gray-700">R$ 5.99</p>
      </div>
    </div>
  </div>
);
