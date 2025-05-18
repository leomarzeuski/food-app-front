"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { useUser, User as ContextUser } from "@/context/userContext";
import { ProfileForm } from "@/components/perfil/ProfileForm";
import { AddressList } from "@/components/perfil/AddressList";
import { OrdersList } from "@/components/perfil/OrdersList";
import userService from "@/services/userService";
import { toast } from "sonner";

export default function PerfilPage() {
  const { user: contextUser, isLoading: isContextLoading, logout } = useUser();
  const [user, setUser] = useState<ContextUser | null>(contextUser);
  const [isLoading, setIsLoading] = useState(isContextLoading);
  const [activeTab, setActiveTab] = useState("perfil");
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  useEffect(() => {
    if (contextUser) {
      setUser(contextUser);
    }
  }, [contextUser]);

  const fetchUserDetails = useCallback(async () => {
    if (!user || fetchingDetails) return;

    try {
      setFetchingDetails(true);
      const userData = await userService.getUserById(user.id);

      setUser({
        ...userData,
        createdAt: user.createdAt,
        tipo: userData.tipo || user.tipo,
      });

      setShouldRefresh(false);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      toast.error("Erro ao carregar detalhes do usuário");
    } finally {
      setFetchingDetails(false);
      setIsLoading(false);
    }
  }, [user, fetchingDetails]);

  useEffect(() => {
    if (shouldRefresh && !fetchingDetails && user) {
      fetchUserDetails();
    }
  }, [shouldRefresh, fetchUserDetails, fetchingDetails, user]);

  if (isLoading && isContextLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>Você precisa estar logado para acessar esta página.</p>
        <Link href="/login" className="text-red-700 font-medium underline">
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Meu Perfil</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center">
          <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mr-4">
            <FaUser size={24} className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.nome}</h2>
            <p className="text-gray-600">{user.email}</p>
            {user.telefone && <p className="text-gray-600">{user.telefone}</p>}
          </div>
        </div>
      </div>

      <div className="flex mb-6 overflow-x-auto">
        <button
          className={`px-4 py-2 mr-2 rounded-full ${
            activeTab === "perfil"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("perfil")}
        >
          Meus Dados
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded-full ${
            activeTab === "enderecos"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("enderecos")}
        >
          Endereços
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            activeTab === "pedidos"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("pedidos")}
        >
          Pedidos
        </button>
      </div>

      {activeTab === "perfil" && <ProfileForm user={user} logout={logout} />}
      {activeTab === "enderecos" && (
        <>
          {fetchingDetails ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <AddressList user={user} />
          )}
        </>
      )}
      {activeTab === "pedidos" && <OrdersList user={user} />}
    </div>
  );
}
