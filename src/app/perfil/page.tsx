"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaArrowLeft,
  FaUser,
  FaCreditCard,
  FaMapMarkerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export default function PerfilPage() {
  // Mock user data
  const [userData, setUserData] = useState({
    nome: "Camila",
    email: "camila@mail.com",
    telefone: "(15) 99999-9999",
  });

  // Mock order history
  const orderHistory = [
    {
      id: "pedido1",
      restauranteNome: "Pizzaria Bom Sabor",
      data: "28/04/2023",
      status: "Entregue",
      total: 65.99,
      items: [
        { nome: "Pizza Margherita", quantidade: 1, preco: 30.0 },
        { nome: "Pizza Calabresa", quantidade: 1, preco: 30.0 },
        { nome: "Refrigerante Cola", quantidade: 1, preco: 5.99 },
      ],
    },
    {
      id: "pedido2",
      restauranteNome: "Hamburgueria Top",
      data: "15/04/2023",
      status: "Entregue",
      total: 45.5,
      items: [
        { nome: "Hambúrguer Clássico", quantidade: 1, preco: 28.0 },
        { nome: "Batata Frita", quantidade: 1, preco: 12.5 },
        { nome: "Refrigerante", quantidade: 1, preco: 5.0 },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState("perfil");

  const handleLogout = () => {
    // Simulate logout
    alert("Logout realizado com sucesso!");
    window.location.href = "/";
  };

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
            <h2 className="text-xl font-bold">{userData.nome}</h2>
            <p className="text-gray-600">{userData.email}</p>
            <p className="text-gray-600">{userData.telefone}</p>
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
          className={`px-4 py-2 mr-2 rounded-full ${
            activeTab === "pagamentos"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("pagamentos")}
        >
          Pagamentos
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

      {/* Meus Dados */}
      {activeTab === "perfil" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Informações Pessoais</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="nome" className="block mb-1 font-medium">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={userData.nome}
                onChange={(e) =>
                  setUserData({ ...userData, nome: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block mb-1 font-medium">
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                value={userData.telefone}
                onChange={(e) =>
                  setUserData({ ...userData, telefone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Salvar Alterações
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center text-red-500"
            >
              <FaSignOutAlt className="mr-2" />
              Sair da conta
            </button>
          </div>
        </div>
      )}

      {/* Endereços */}
      {activeTab === "enderecos" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Meus Endereços</h2>
            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
              Adicionar Endereço
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-red-500 mr-3 mt-1" />
              <div>
                <p className="font-medium">Casa</p>
                <p className="text-gray-600">Rua A, 123, Centro</p>
                <p className="text-gray-600">Sorocaba, SP - 18000-000</p>
                <div className="mt-2 flex space-x-3">
                  <button className="text-red-500 text-sm">Editar</button>
                  <button className="text-gray-500 text-sm">Remover</button>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-red-500 mr-3 mt-1" />
              <div>
                <p className="font-medium">Trabalho</p>
                <p className="text-gray-600">Av. Principal, 500, Centro</p>
                <p className="text-gray-600">Sorocaba, SP - 18010-000</p>
                <div className="mt-2 flex space-x-3">
                  <button className="text-red-500 text-sm">Editar</button>
                  <button className="text-gray-500 text-sm">Remover</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagamentos */}
      {activeTab === "pagamentos" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Formas de Pagamento</h2>
            <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
              Adicionar Cartão
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <FaCreditCard className="text-red-500 mr-3 mt-1" />
              <div>
                <p className="font-medium">Cartão Final 1234</p>
                <p className="text-gray-600">Mastercard</p>
                <p className="text-gray-600">Válido até 12/25</p>
                <div className="mt-2 flex space-x-3">
                  <button className="text-red-500 text-sm">Editar</button>
                  <button className="text-gray-500 text-sm">Remover</button>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <FaCreditCard className="text-red-500 mr-3 mt-1" />
              <div>
                <p className="font-medium">Cartão Final 5678</p>
                <p className="text-gray-600">Visa</p>
                <p className="text-gray-600">Válido até 08/24</p>
                <div className="mt-2 flex space-x-3">
                  <button className="text-red-500 text-sm">Editar</button>
                  <button className="text-gray-500 text-sm">Remover</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pedidos */}
      {activeTab === "pedidos" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Histórico de Pedidos</h2>

          {orderHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Você ainda não fez nenhum pedido
            </p>
          ) : (
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">{order.restauranteNome}</h3>
                    <span className="text-green-500 text-sm">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Data: {order.data}
                  </p>
                  <div className="border-t border-gray-100 my-2 pt-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm py-1"
                      >
                        <span>
                          {item.quantidade}x {item.nome}
                        </span>
                        <span>R$ {item.preco.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-3">
                    <button className="text-red-500 text-sm">
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
