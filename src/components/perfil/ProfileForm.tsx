"use client";

import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { User } from "@/context/userContext";
import userService from "@/services/userService";

interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

interface ProfileFormProps {
  user: User;
  logout: () => void;
}

export function ProfileForm({ user, logout }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    nome: user.nome || "",
    email: user.email || "",
    telefone: user.telefone || "",
  });
  const [updating, setUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    setUpdating(true);

    try {
      const updatedData = {
        nome: formData.nome !== user.nome ? formData.nome : undefined,
        email: formData.email !== user.email ? formData.email : undefined,
        telefone:
          formData.telefone !== user.telefone ? formData.telefone : undefined,
      };

      const dataToUpdate = Object.fromEntries(
        Object.entries(updatedData).filter(([, v]) => v !== undefined)
      );

      if (Object.keys(dataToUpdate).length === 0) {
        toast.info("Nenhuma alteração para salvar");
        setUpdating(false);
        return;
      }

      await userService.updateUser(user.id, dataToUpdate);

      toast.success("Perfil atualizado com sucesso!");

      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);

      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Falha ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Informações Pessoais</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block mb-1 font-medium">
            Nome
          </label>
          <Input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="telefone" className="block mb-1 font-medium">
            Telefone
          </label>
          <Input
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={(e) =>
              setFormData({ ...formData, telefone: e.target.value })
            }
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className={`bg-red-500 text-white px-4 py-2 rounded ${
            updating ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {updating ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button onClick={logout} className="flex items-center text-red-500">
          <FaSignOutAlt className="mr-2" />
          Sair da conta
        </button>
      </div>
    </div>
  );
}
