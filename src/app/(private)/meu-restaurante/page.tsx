"use client";

import { useState, useEffect } from "react";
import { FaUtensils, FaList, FaStar } from "react-icons/fa";
import {
  RestaurantHeader,
  MenuTab,
  OrdersTab,
  RatingsTab,
} from "@/components/meu-restaurante";
import { restaurantService, menuItemService, orderService } from "@/services";
import type { Restaurant } from "@/services/restaurantService";
import type { MenuItem } from "@/services/menuItemService";
import type { Order } from "@/services/orderService";

export default function MeuRestaurantePage() {
  const [activeTab, setActiveTab] = useState("cardapio");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const restaurantId = "9NypA4Ve8W9DwrcEfmvQ";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const restaurantData = await restaurantService.getRestaurantById(
          restaurantId
        );
        setRestaurant(restaurantData);

        const menuItemsData = await menuItemService.getMenuItemsByRestaurant(
          restaurantId
        );
        setMenuItems(menuItemsData);

        const ordersData = await orderService.getOrdersByRestaurant(
          restaurantId
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
  }, [restaurantId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
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
        <div className="flex space-x-6">
          <button
            className={`pb-2 px-1 ${
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
            className={`pb-2 px-1 ${
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
            className={`pb-2 px-1 ${
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

      {activeTab === "avaliacoes" && <RatingsTab />}
    </div>
  );
}
