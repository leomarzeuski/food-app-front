"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Address, User, useUser } from "@/context/userContext";
import { AddressDialog } from "./AddressDialog";
import { AxiosError } from "axios";
import addressService from "@/services/addressService";

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface AddressListProps {
  user: User;
}

export function AddressList({ user }: AddressListProps) {
  const { addresses, refreshAddresses } = useUser();
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.id) return;
      setLoading(true);
      await refreshAddresses();
      setLoading(false);
    };

    loadAddresses();
  }, [user?.id, refreshAddresses]);

  const handleRemoveAddress = async (addressId: string) => {
    if (!confirm("Tem certeza que deseja remover este endereço?")) return;

    try {
      await addressService.deleteAddress(addressId);
      toast.success("Endereço removido com sucesso!");
      refreshAddresses();
    } catch (error) {
      console.error("Erro ao remover endereço:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Falha ao remover endereço. Tente novamente.");
      }
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsEditDialogOpen(true);
  };

  const handleAddressSuccess = () => {
    refreshAddresses();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Meus Endereços</h2>
        <AddressDialog
          entityId={user.id}
          entityType="user"
          isCreate={true}
          onSuccess={handleAddressSuccess}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <FaMapMarkerAlt className="text-gray-400 text-4xl mx-auto mb-3" />
          <p className="text-gray-500 mb-3">
            Você ainda não possui endereços cadastrados
          </p>
          <AddressDialog
            entityId={user.id}
            entityType="user"
            isCreate={true}
            isIconButton={true}
            onSuccess={handleAddressSuccess}
          />
        </div>
      ) : (
        addresses.map((endereco) => (
          <div
            key={endereco.id}
            className="border border-gray-200 rounded-lg p-4 mb-4"
          >
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-red-500 mr-3 mt-1" />
              <div className="flex-1">
                <p className="font-medium">{endereco.apelido || "Endereço"}</p>
                <p className="text-gray-600">
                  {endereco.rua}, {endereco.numero}
                  {endereco.complemento && `, ${endereco.complemento}`}
                </p>
                <p className="text-gray-600">
                  {endereco.bairro}, {endereco.cidade} - {endereco.estado},{" "}
                  {endereco.cep}
                </p>
                <div className="mt-2 flex space-x-3">
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => handleEditAddress(endereco)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-gray-500 text-sm"
                    onClick={() => handleRemoveAddress(endereco.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
              {endereco.principal && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Principal
                </span>
              )}
            </div>
          </div>
        ))
      )}

      {editingAddress && (
        <AddressDialog
          entityId={user.id}
          entityType="user"
          isEdit={true}
          address={editingAddress}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={handleAddressSuccess}
        />
      )}
    </div>
  );
}
