"use client";

import { useState, useEffect } from "react";
import {
  FaUtensils,
  FaEdit,
  FaPlus,
  FaTrash,
  FaList,
  FaStar,
} from "react-icons/fa";
import { restaurantService, menuItemService, orderService } from "@/services";
import { getFallbackImageUrl } from "@/utils/imageUtils";
import SafeImage from "@/components/SafeImage";
import type { Restaurant } from "@/services/restaurantService";
import type { MenuItem, CreateMenuItemDto } from "@/services/menuItemService";
import type { Order } from "@/services/orderService";

export default function MeuRestaurantePage() {
  const [activeTab, setActiveTab] = useState("cardapio");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("");
  const [newItemAvailable, setNewItemAvailable] = useState(true);
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategories, setEditCategories] = useState("");
  const [editIsOpen, setEditIsOpen] = useState(true);

  const restaurantId = "9NypA4Ve8W9DwrcEfmvQ";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch restaurant details
        const restaurantData = await restaurantService.getRestaurantById(
          restaurantId
        );
        setRestaurant(restaurantData);

        // Set form values for editing
        setEditName(restaurantData.nome);
        setEditCategories(restaurantData.categories.join(", "));
        setEditIsOpen(restaurantData.isOpen);

        // Fetch menu items for this restaurant
        const menuItemsData = await menuItemService.getMenuItemsByRestaurant(
          restaurantId
        );
        setMenuItems(menuItemsData);

        // Fetch orders for this restaurant
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

  // Handle creating a new menu item
  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!restaurant) return;

    try {
      const newMenuItem: CreateMenuItemDto = {
        restauranteId: restaurant.id,
        nome: newItemName,
        descricao: newItemDescription,
        preco: parseFloat(newItemPrice) || 0,
        imagemUrl: newItemImage || undefined,
        disponivel: newItemAvailable,
      };

      const createdItem = await menuItemService.createMenuItem(newMenuItem);

      // Update the menu items list with the new item
      setMenuItems([...menuItems, createdItem]);

      // Clear the form
      setNewItemName("");
      setNewItemDescription("");
      setNewItemPrice("");
      setNewItemImage("");
      setNewItemAvailable(true);
      setShowAddItemForm(false);
    } catch (error) {
      console.error("Error creating menu item:", error);
      alert("Não foi possível adicionar o item ao cardápio.");
    }
  };

  // Handle update menu item availability
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updatedItem = await menuItemService.updateMenuItemAvailability(
        item.id,
        !item.disponivel
      );

      // Update the menu items list
      setMenuItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === updatedItem.id ? updatedItem : prevItem
        )
      );
    } catch (error) {
      console.error("Error updating item availability:", error);
      alert("Não foi possível atualizar a disponibilidade do item.");
    }
  };

  // Handle delete menu item
  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      await menuItemService.deleteMenuItem(itemId);

      // Remove the item from the list
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Não foi possível excluir o item.");
    }
  };

  // Handle update restaurant
  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!restaurant) return;

    try {
      const updatedRestaurant = await restaurantService.updateRestaurant(
        restaurant.id,
        {
          nome: editName,
          categories: editCategories.split(",").map((cat) => cat.trim()),
          isOpen: editIsOpen,
        }
      );

      setRestaurant(updatedRestaurant);
      setIsEditingRestaurant(false);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Não foi possível atualizar as informações do restaurante.");
    }
  };

  // Handle order status update
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(
        orderId,
        newStatus
      );

      // Update orders list
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Não foi possível atualizar o status do pedido.");
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          <SafeImage
            src={getFallbackImageUrl(restaurant.categories)}
            alt={restaurant.nome}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          {isEditingRestaurant ? (
            <form onSubmit={handleUpdateRestaurant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do Restaurante
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Categorias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={editCategories}
                  onChange={(e) => setEditCategories(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={editIsOpen ? "true" : "false"}
                  onChange={(e) => setEditIsOpen(e.target.value === "true")}
                  className="w-full p-2 border rounded"
                >
                  <option value="true">Aberto</option>
                  <option value="false">Fechado</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingRestaurant(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{restaurant.nome}</h1>
                  <div className="text-sm text-gray-600 mt-1">
                    {restaurant.endereco.cidade}, {restaurant.endereco.estado}
                  </div>
                  <div className="mt-2 mb-2">
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
                <button
                  onClick={() => setIsEditingRestaurant(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
                >
                  <FaEdit className="mr-1" /> Editar
                </button>
              </div>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    restaurant.isOpen
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {restaurant.isOpen ? "Aberto" : "Fechado"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
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

      {/* Cardápio Content */}
      {activeTab === "cardapio" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Itens do Cardápio</h2>
            <button
              onClick={() => setShowAddItemForm(!showAddItemForm)}
              className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center"
            >
              {showAddItemForm ? (
                "Cancelar"
              ) : (
                <>
                  <FaPlus className="mr-1" /> Adicionar Item
                </>
              )}
            </button>
          </div>

          {/* Add New Item Form */}
          {showAddItemForm && (
            <form
              onSubmit={handleAddMenuItem}
              className="bg-gray-50 p-4 rounded-lg mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL da Imagem
                  </label>
                  <input
                    type="text"
                    value={newItemImage}
                    onChange={(e) => setNewItemImage(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Disponibilidade
                  </label>
                  <select
                    value={newItemAvailable ? "true" : "false"}
                    onChange={(e) =>
                      setNewItemAvailable(e.target.value === "true")
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="true">Disponível</option>
                    <option value="false">Indisponível</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Adicionar ao Cardápio
                </button>
              </div>
            </form>
          )}

          {/* Menu Items List */}
          {menuItems.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">
                Você ainda não possui itens no cardápio.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <SafeImage
                        src={
                          item.imagemUrl || "https://via.placeholder.com/150"
                        }
                        alt={item.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{item.nome}</h3>
                      <p className="text-gray-600 text-sm">{item.descricao}</p>
                      <p className="text-red-500 font-bold mt-1">
                        R$ {item.preco.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`px-3 py-1 rounded text-sm ${
                        item.disponivel
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.disponivel ? "Disponível" : "Indisponível"}
                    </button>
                    <button
                      onClick={() => handleDeleteMenuItem(item.id)}
                      className="bg-red-100 text-red-800 p-2 rounded hover:bg-red-200"
                      title="Excluir item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pedidos Content */}
      {activeTab === "pedidos" && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Pedidos Recebidos</h2>

          {orders.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">Você ainda não possui pedidos.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-gray-500 text-sm">
                        Pedido #{order.id.substring(0, 8)}
                      </span>
                      <h3 className="font-bold">Cliente: {order.userId}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(
                            order.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className={`p-2 rounded border ${
                          order.status === "entregue"
                            ? "bg-green-100 border-green-300"
                            : order.status === "cancelado"
                            ? "bg-red-100 border-red-300"
                            : "bg-yellow-100 border-yellow-300"
                        }`}
                      >
                        <option value="novo">Novo</option>
                        <option value="preparando">Preparando</option>
                        <option value="pronto">Pronto</option>
                        <option value="entregando">Entregando</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Itens do Pedido:</h4>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => {
                        const menuItem = menuItems.find(
                          (mi) => mi.id === item.itemId
                        );
                        return (
                          <li key={index} className="flex justify-between">
                            <span>
                              {item.quantidade}x{" "}
                              {menuItem?.nome ||
                                `Item #${item.itemId.substring(0, 6)}`}
                            </span>
                            <span className="font-medium">
                              R$ {(item.precoUnit * item.quantidade).toFixed(2)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="border-t border-gray-200 mt-4 pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        R${" "}
                        {order.items
                          .reduce(
                            (total, item) =>
                              total + item.precoUnit * item.quantidade,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Avaliações Content */}
      {activeTab === "avaliacoes" && (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Avaliações do Restaurante
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-md text-center py-8">
            <p className="text-gray-500">Sem avaliações no momento</p>
          </div>
        </div>
      )}
    </div>
  );
}
