"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import addressService, { CreateAddressDto } from "@/services/addressService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Address } from "@/context/userContext";

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface AddressDialogProps {
  entityId: string;
  entityType: "user" | "restaurant";
  onSuccess?: () => void;

  isCreate?: boolean;
  isIconButton?: boolean;

  isEdit?: boolean;
  address?: Address;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddressDialog({
  entityId,
  entityType = "user",
  onSuccess,

  isIconButton = false,

  isEdit = false,
  address,
  open,
  onOpenChange,
}: AddressDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isDialogOpen = isEdit ? open : internalOpen;
  const setIsDialogOpen = isEdit ? onOpenChange : setInternalOpen;

  const [addressFormData, setAddressFormData] = useState<Partial<Address>>({
    entityId,
    entityType,
    apelido: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    principal: false,
  });

  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (isEdit && address) {
      setAddressFormData({
        ...address,
        entityId: address.entityId || entityId,
        entityType: address.entityType || entityType,
      });
    } else {
      setAddressFormData({
        entityId,
        entityType,
        apelido: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        principal: false,
      });
    }
  }, [isEdit, address, entityId, entityType, isDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !addressFormData.rua ||
      !addressFormData.numero ||
      !addressFormData.bairro ||
      !addressFormData.cidade ||
      !addressFormData.estado ||
      !addressFormData.cep
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSavingAddress(true);

    try {
      if (isEdit && address) {
        await addressService.updateAddress(address.id, addressFormData);

        if (addressFormData.principal) {
          await addressService.setAddressAsPrimary(
            address.id,
            entityId,
            entityType
          );
        }

        toast.success("Endereço atualizado com sucesso!");
      } else {
        const newAddress = await addressService.createAddress(
          addressFormData as CreateAddressDto
        );

        if (addressFormData.principal) {
          await addressService.setAddressAsPrimary(
            newAddress.id,
            entityId,
            entityType
          );
        }

        toast.success("Endereço adicionado com sucesso!");
      }

      if (setIsDialogOpen) {
        setIsDialogOpen(false);
      }

      if (!isEdit) {
        setAddressFormData({
          entityId,
          entityType,
          apelido: "",
          rua: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          principal: false,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao processar endereço:", error);

      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error(
          `Falha ao ${
            isEdit ? "atualizar" : "adicionar"
          } endereço. Tente novamente.`
        );
      }
    } finally {
      setSavingAddress(false);
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Editar Endereço" : "Adicionar Endereço"}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Nome do Endereço
            </label>
            <Input
              type="text"
              value={addressFormData.apelido || ""}
              onChange={(e) =>
                setAddressFormData({
                  ...addressFormData,
                  apelido: e.target.value,
                })
              }
              placeholder="Ex: Casa, Trabalho"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Rua</label>
            <Input
              type="text"
              value={addressFormData.rua || ""}
              onChange={(e) =>
                setAddressFormData({
                  ...addressFormData,
                  rua: e.target.value,
                })
              }
              placeholder="Rua, Avenida, etc."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium">Número</label>
              <Input
                type="text"
                value={addressFormData.numero || ""}
                onChange={(e) =>
                  setAddressFormData({
                    ...addressFormData,
                    numero: e.target.value,
                  })
                }
                placeholder="Número"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Complemento
              </label>
              <Input
                type="text"
                value={addressFormData.complemento || ""}
                onChange={(e) =>
                  setAddressFormData({
                    ...addressFormData,
                    complemento: e.target.value,
                  })
                }
                placeholder="Apto, Bloco, etc."
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Bairro</label>
            <Input
              type="text"
              value={addressFormData.bairro || ""}
              onChange={(e) =>
                setAddressFormData({
                  ...addressFormData,
                  bairro: e.target.value,
                })
              }
              placeholder="Bairro"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium">Cidade</label>
              <Input
                type="text"
                value={addressFormData.cidade || ""}
                onChange={(e) =>
                  setAddressFormData({
                    ...addressFormData,
                    cidade: e.target.value,
                  })
                }
                placeholder="Cidade"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Estado</label>
              <Input
                type="text"
                value={addressFormData.estado || ""}
                onChange={(e) =>
                  setAddressFormData({
                    ...addressFormData,
                    estado: e.target.value,
                  })
                }
                placeholder="Estado"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">CEP</label>
            <Input
              type="text"
              value={addressFormData.cep || ""}
              onChange={(e) =>
                setAddressFormData({
                  ...addressFormData,
                  cep: e.target.value,
                })
              }
              placeholder="00000-000"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enderecoPrincipal"
              checked={addressFormData.principal || false}
              onChange={(e) =>
                setAddressFormData({
                  ...addressFormData,
                  principal: e.target.checked,
                })
              }
              className="mr-2"
            />
            <label htmlFor="enderecoPrincipal" className="text-sm">
              Definir como endereço principal
            </label>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen && setIsDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={savingAddress}
            className="bg-red-500 text-white"
          >
            {savingAddress
              ? "Salvando..."
              : isEdit
              ? "Salvar Alterações"
              : "Adicionar Endereço"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );

  if (isEdit) {
    return dialogContent;
  }

  return (
    <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
      <DialogTrigger asChild>
        {isIconButton ? (
          <Button className="flex items-center justify-center mx-auto bg-red-500 text-white px-4 py-2 rounded">
            <FaPlus className="mr-2" />
            Adicionar Endereço
          </Button>
        ) : (
          <Button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
            Adicionar Endereço
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
