"use client";

import { useState, useEffect } from "react";
import { FaStar, FaMotorcycle, FaClock, FaPlus, FaMinus } from "react-icons/fa";
import { restaurantService, menuItemService, orderService } from "@/services";
import { getFallbackImageUrl } from "@/utils/imageUtils";
import SafeImage from "@/components/SafeImage";
import type { Restaurant } from "@/services/restaurantService";
import type { MenuItem } from "@/services/menuItemService";
import type { CreateOrderDto, OrderItem } from "@/services/orderService";
import { useUser } from "@/context/userContext";

interface MenuItemUI extends MenuItem {
  categoria?: string;
}

export default function RestaurantDetail({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("cardapio");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemUI[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const restaurantData = await restaurantService.getRestaurantById(
          params.id
        );
        setRestaurant(restaurantData);

        const menuItemsData = await menuItemService.getMenuItemsByRestaurant(
          params.id
        );

        const enhancedMenuItems = menuItemsData.map((item, index) => ({
          ...item,
          categoria: index % 2 === 0 ? "Principais" : "Bebidas",
        }));

        setMenuItems(enhancedMenuItems);

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
  }, [params.id]);

  const categories =
    menuItems.length > 0
      ? [...new Set(menuItems.map((item) => item.categoria || "Sem categoria"))]
      : [];

  const addToCart = (item: MenuItemUI) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.itemId === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.itemId === item.id
            ? { ...cartItem, quantidade: cartItem.quantidade + 1 }
            : cartItem
        );
      } else {
        return [
          ...prev,
          {
            itemId: item.id,
            quantidade: 1,
            precoUnit: item.preco,
            itemName: item.nome,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.itemId === itemId);
      if (existingItem && existingItem.quantidade > 1) {
        return prev.map((item) =>
          item.itemId === itemId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        );
      } else {
        return prev.filter((item) => item.itemId !== itemId);
      }
    });
  };

  const getItemQuantity = (itemId: string) => {
    const item = cartItems.find((item) => item.itemId === itemId);
    return item ? item.quantidade : 0;
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.precoUnit * item.quantidade,
      0
    );
  };

  const handleCreateOrder = async () => {
    if (!restaurant || cartItems.length === 0) return;

    try {
      const orderData: CreateOrderDto = {
        userId: user?.id || "",
        userName: user?.nome || "",
        restaurantId: restaurant.id,
        status: "novo",
        items: cartItems,
      };

      await orderService.createOrder(orderData);
      setCartItems([]);
      alert("Pedido realizado com sucesso!");
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Erro ao criar pedido. Por favor, tente novamente.");
    }
  };

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
    <div className="pb-20">
      <div className="relative h-48 w-full mb-16">
        <SafeImage
          src={getFallbackImageUrl(restaurant.categories)}
          alt={restaurant.nome}
          fill
          className="object-cover"
        />
        <div className="absolute -bottom-12 left-4 bg-white p-2 rounded-lg shadow-md">
          <div className="w-24 h-24 relative">
            <SafeImage
              src={getFallbackImageUrl(restaurant.categories)}
              alt={restaurant.nome}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="pl-32">
        <h1 className="text-2xl font-bold">{restaurant.nome}</h1>
        <div className="flex items-center mt-1 text-gray-600">
          <span className="flex items-center text-yellow-500 mr-3">
            <FaStar className="mr-1" /> 4.7
          </span>
          <span className="flex items-center mr-3">
            <FaMotorcycle className="mr-1" /> 30-45 min
          </span>
          <span className="flex items-center">
            <FaClock className="mr-1" />{" "}
            {restaurant.isOpen ? "Aberto" : "Fechado"}
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

      {activeTab === "cardapio" && (
        <div className="mt-6">
          {menuItems.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">
                Este restaurante ainda não possui itens no cardápio.
              </p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-bold mb-4">{category}</h2>
                <div className="space-y-4">
                  {menuItems
                    .filter(
                      (item) => (item.categoria || "Sem categoria") === category
                    )
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
                          {!item.disponivel && (
                            <p className="text-red-600 text-sm mt-1">
                              Indisponível
                            </p>
                          )}
                        </div>
                        <div className="flex items-center">
                          {item.disponivel && (
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
                                onClick={() => addToCart(item)}
                                className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                              >
                                <FaPlus size={10} />
                              </button>
                            </div>
                          )}
                          <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                            <SafeImage
                              src={
                                item.imagemUrl ||
                                "https://via.placeholder.com/150"
                              }
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
            ))
          )}
        </div>
      )}

      {activeTab === "avaliacoes" && (
        <div className="mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center py-8">
            <p className="text-gray-500">Sem avaliações no momento</p>
          </div>
        </div>
      )}

      {activeTab === "info" && (
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
      )}

      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">
              Total: R$ {calculateTotal().toFixed(2)}
            </span>
            <span>
              {cartItems.reduce((acc, item) => acc + item.quantidade, 0)} itens
            </span>
          </div>
          <button
            onClick={handleCreateOrder}
            className="bg-red-500 text-white w-full py-3 rounded-lg font-medium flex items-center justify-center"
          >
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
}
