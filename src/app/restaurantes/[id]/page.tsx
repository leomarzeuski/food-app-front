"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMotorcycle, FaClock, FaPlus, FaMinus } from "react-icons/fa";

export default function RestaurantDetail({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("cardapio");
  const [cartItems, setCartItems] = useState<
    { id: string; quantity: number }[]
  >([]);

  // Hardcoded data based on the JSON files structure - in a real app, this would use the params.id
  const restaurant = {
    id: params.id,
    nome: "Pizzaria Bom Sabor",
    categories: ["pizza", "italiana"],
    rating: 4.7,
    deliveryTime: "30-45 min",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    endereco: {
      rua: "Rua A",
      cidade: "Sorocaba",
      estado: "SP",
      cep: "18000-000",
    },
    horario: "10:00 - 22:00",
    taxaEntrega: 5.99,
  };

  // Hardcoded menu items based on the JSON files structure
  const menuItems = [
    {
      id: "item1",
      nome: "Pizza Margherita",
      descricao: "Tomate, muçarela, manjericão",
      preco: 30.0,
      disponivel: true,
      imageUrl:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop",
      categoria: "Pizzas",
    },
    {
      id: "item2",
      nome: "Pizza Calabresa",
      descricao: "Calabresa, cebola, muçarela",
      preco: 35.0,
      disponivel: true,
      imageUrl:
        "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1976&auto=format&fit=crop",
      categoria: "Pizzas",
    },
    {
      id: "item3",
      nome: "Pizza Quatro Queijos",
      descricao: "Muçarela, provolone, parmesão, gorgonzola",
      preco: 38.0,
      disponivel: true,
      imageUrl:
        "https://images.unsplash.com/photo-1571066811602-716837d681de?q=80&w=1844&auto=format&fit=crop",
      categoria: "Pizzas",
    },
    {
      id: "item4",
      nome: "Refrigerante Cola 2L",
      descricao: "Bebida gelada",
      preco: 12.0,
      disponivel: true,
      imageUrl:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=2070&auto=format&fit=crop",
      categoria: "Bebidas",
    },
  ];

  const categories = [...new Set(menuItems.map((item) => item.categoria))];

  // Handle add to cart
  const addToCart = (itemId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { id: itemId, quantity: 1 }];
      }
    });
  };

  // Handle remove from cart
  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter((item) => item.id !== itemId);
      }
    });
  };

  // Get item quantity in cart
  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="pb-20">
      {/* Restaurant Header */}
      <div className="relative h-48 w-full mb-16">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.nome}
          fill
          className="object-cover"
        />
        <div className="absolute -bottom-12 left-4 bg-white p-2 rounded-lg shadow-md">
          <div className="w-24 h-24 relative">
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.nome}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="pl-32">
        <h1 className="text-2xl font-bold">{restaurant.nome}</h1>
        <div className="flex items-center mt-1 text-gray-600">
          <span className="flex items-center text-yellow-500 mr-3">
            <FaStar className="mr-1" /> {restaurant.rating}
          </span>
          <span className="flex items-center mr-3">
            <FaMotorcycle className="mr-1" /> {restaurant.deliveryTime}
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1" /> {restaurant.horario}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {restaurant.endereco.rua}, {restaurant.endereco.cidade},{" "}
          {restaurant.endereco.estado} - {restaurant.endereco.cep}
        </div>
        <div className="mt-2">
          {restaurant.categories.map((cat, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-6">
        <div className="flex space-x-6">
          <button
            className={`pb-2 px-1 ${
              activeTab === "cardapio"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("cardapio")}
          >
            Cardápio
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "avaliacoes"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("avaliacoes")}
          >
            Avaliações
          </button>
          <button
            className={`pb-2 px-1 ${
              activeTab === "info"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Informações
          </button>
        </div>
      </div>

      {/* Menu Content */}
      {activeTab === "cardapio" && (
        <div className="mt-6">
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-bold mb-4">{category}</h2>
              <div className="space-y-4">
                {menuItems
                  .filter((item) => item.categoria === category)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
                    >
                      <div className="flex-1 pr-4">
                        <h3 className="font-bold">{item.nome}</h3>
                        <p className="text-gray-600 text-sm">
                          {item.descricao}
                        </p>
                        <p className="text-red-500 font-bold mt-1">
                          R$ {item.preco.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          {getItemQuantity(item.id) > 0 && (
                            <>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="bg-gray-200 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center"
                              >
                                <FaMinus size={10} />
                              </button>
                              <span className="px-3">
                                {getItemQuantity(item.id)}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => addToCart(item.id)}
                            className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.nome}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Avaliações Content */}
      {activeTab === "avaliacoes" && (
        <div className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center py-8">
            <p className="text-gray-500">Sem avaliações no momento</p>
          </div>
        </div>
      )}

      {/* Info Content */}
      {activeTab === "info" && (
        <div className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="font-bold mb-2">Horário de Funcionamento</h3>
              <p className="text-gray-700">{restaurant.horario}</p>
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
              <p className="text-gray-700">
                R$ {restaurant.taxaEntrega.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Link
            href="/carrinho"
            className="bg-red-500 text-white w-full py-3 rounded-lg font-medium flex items-center justify-center"
          >
            Ver Carrinho (
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} itens)
          </Link>
        </div>
      )}
    </div>
  );
}
