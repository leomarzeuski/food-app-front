"use client";

import { useState, useEffect } from "react";
import {
  FaUtensils,
  FaList,
  FaStar,
  FaMapMarkerAlt,
  FaPlus,
} from "react-icons/fa";
import {
  RestaurantHeader,
  MenuTab,
  OrdersTab,
  RatingsTab,
  AddressTab,
} from "@/components/meu-restaurante";
import { restaurantService, menuItemService, orderService } from "@/services";
import type { Restaurant } from "@/services/restaurantService";
import type { MenuItem } from "@/services/menuItemService";
import type { Order } from "@/services/orderService";
import { useUser } from "@/context/userContext";
import Link from "next/link";

export default function MeuRestaurantePage() {
  const [activeTab, setActiveTab] = useState("cardapio");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateRestaurantPrompt, setShowCreateRestaurantPrompt] =
    useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const userRestaurants = await restaurantService.getRestaurantsByUserId(
          user.id
        );

        if (userRestaurants.length === 0) {
          setShowCreateRestaurantPrompt(true);
          setLoading(false);
          return;
        }

        const restaurantData = userRestaurants[0];
        setRestaurant(restaurantData);

        const menuItemsData = await menuItemService.getMenuItemsByRestaurant(
          restaurantData.id
        );
        setMenuItems(menuItemsData);

        const ordersData = await orderService.getOrdersByRestaurant(
          restaurantData.id
        );
        setOrders(ordersData);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch restaurant data:", error);
        setError(
          "Não foi possível carregar os dados do restaurante. Por favor, tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (showCreateRestaurantPrompt) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <FaUtensils className="text-red-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Você ainda não possui um restaurante
          </h2>
          <p className="text-gray-600 mb-6">
            Para começar a vender no nosso aplicativo, você precisa cadastrar
            seu restaurante.
          </p>
          <Link
            href="/cadastrar-restaurante"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaPlus className="mr-2" /> Cadastrar meu restaurante
          </Link>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        {error || "Restaurante não encontrado"}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RestaurantHeader
        restaurant={restaurant}
        onRestaurantUpdate={setRestaurant}
      />

      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-6 overflow-x-auto pb-1">
          <button
            className={`pb-2 px-1 whitespace-nowrap ${
              activeTab === "cardapio"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("cardapio")}
          >
            <span className="flex items-center">
              <FaUtensils className="mr-2" /> Cardápio
            </span>
          </button>
          <button
            className={`pb-2 px-1 whitespace-nowrap ${
              activeTab === "pedidos"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("pedidos")}
          >
            <span className="flex items-center">
              <FaList className="mr-2" /> Pedidos
            </span>
          </button>
          <button
            className={`pb-2 px-1 whitespace-nowrap ${
              activeTab === "endereco"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("endereco")}
          >
            <span className="flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Endereço
            </span>
          </button>
          <button
            className={`pb-2 px-1 whitespace-nowrap ${
              activeTab === "avaliacoes"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("avaliacoes")}
          >
            <span className="flex items-center">
              <FaStar className="mr-2" /> Avaliações
            </span>
          </button>
        </div>
      </div>

      {activeTab === "cardapio" && (
        <MenuTab
          restaurantId={restaurant.id}
          menuItems={menuItems}
          onMenuItemsChange={setMenuItems}
        />
      )}

      {activeTab === "pedidos" && (
        <OrdersTab
          orders={orders}
          menuItems={menuItems}
          onOrdersChange={setOrders}
        />
      )}

      {activeTab === "endereco" && (
        <AddressTab
          restaurant={restaurant}
          onRestaurantUpdate={setRestaurant}
        />
      )}

      {activeTab === "avaliacoes" && <RatingsTab />}
    </div>
  );
}
