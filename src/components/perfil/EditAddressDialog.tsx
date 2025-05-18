"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Address } from "@/context/userContext";

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface EditAddressDialogProps {
  address: Address;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressUpdated: (updatedData: Partial<Address>) => void;
}

export function EditAddressDialog({
  address,
  open,
  onOpenChange,
  onAddressUpdated,
}: EditAddressDialogProps) {
  const [addressFormData, setAddressFormData] = useState<Partial<Address>>({
    apelido: address.apelido || "",
    rua: address.rua || "",
    numero: address.numero || "",
    complemento: address.complemento || "",
    bairro: address.bairro || "",
    cidade: address.cidade || "",
    estado: address.estado || "",
    cep: address.cep || "",
    principal: address.principal || false,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    setAddressFormData({
      apelido: address.apelido || "",
      rua: address.rua || "",
      numero: address.numero || "",
      complemento: address.complemento || "",
      bairro: address.bairro || "",
      cidade: address.cidade || "",
      estado: address.estado || "",
      cep: address.cep || "",
      principal: address.principal || false,
    });
  }, [address]);

  const handleUpdateAddress = async (e: React.FormEvent) => {
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
      await onAddressUpdated(addressFormData);
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Falha ao atualizar endereço. Tente novamente.");
      }
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Endereço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateAddress} className="space-y-4 py-4">
          <div className="space-y-4">{/* Campos do formulário... */}</div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={savingAddress}
              className="bg-red-500 text-white"
            >
              {savingAddress ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
