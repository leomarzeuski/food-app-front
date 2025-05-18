"use client";

import { useState, useEffect } from "react";
import { FaStar, FaMotorcycle, FaClock, FaPlus, FaMinus } from "react-icons/fa";
import { restaurantService, menuItemService, orderService } from "@/services";
import ratingService, { Rating, CreateRatingDto } from "@/services/ratingService";
import type { Restaurant } from "@/services/restaurantService";
import type { MenuItem } from "@/services/menuItemService";
import type { CreateOrderDto, OrderItem } from "@/services/orderService";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import { toast } from "sonner";

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
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<string[]>([]);
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

        try {
          const ratingsData = await ratingService.getAllRatings();
          const allOrders = await orderService.getOrdersByRestaurant(params.id);
          const restaurantOrderIds = allOrders.map(order => order.id);
          
          const restaurantRatings = ratingsData.filter(rating => 
            restaurantOrderIds.includes(rating.orderId)
          );
          
          setReviews(restaurantRatings);
        } catch (error) {
          console.error("Failed to fetch ratings:", error);
        }

        if (user?.id) {
          try {
            const userOrdersResponse = await orderService.getOrdersByUser(user.id);
            const restaurantOrders = userOrdersResponse
              .filter(order => order.restaurantId === params.id)
              .map(order => order.id);
            
            setUserOrders(restaurantOrders);
          } catch (error) {
            console.error("Failed to fetch user orders:", error);
          }
        }

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
  }, [params.id, user?.id]);

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
      toast.success("Pedido realizado com sucesso!");
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Erro ao criar pedido. Por favor, tente novamente.");
    }
  };

  const handleOpenRatingModal = () => {
    if (!user) {
      toast.error("Você precisa estar logado para deixar uma avaliação.");
      return;
    }

    if (userOrders.length === 0) {
      toast.error("Você precisa ter feito um pedido neste restaurante para avaliá-lo.");
      return;
    }

    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!user || userOrders.length === 0) return;

    try {
      setSubmitLoading(true);

      const ratingData: CreateRatingDto = {
        orderId: userOrders[0],
        userId: user.id,
        nota: rating,
        comentario: comment.trim() || undefined
      };

      const createdRating = await ratingService.createRating(ratingData);
      
      setReviews((prev) => [...prev, createdRating]);
      setIsRatingModalOpen(false);
      setComment("");
      setRating(5);
      
      toast.success("Avaliação enviada com sucesso!");
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast.error("Erro ao enviar avaliação. Por favor, tente novamente.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar 
        key={index} 
        className={index < rating ? "text-yellow-500" : "text-gray-300"} 
      />
    ));
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

      <div className="pl-32">
        <h1 className="text-2xl font-bold">{restaurant.nome}</h1>
        <div className="flex items-center mt-1 text-gray-600">
          <span className="flex items-center text-yellow-500 mr-3">
            <FaStar className="mr-1" /> 
            {reviews.length > 0 
              ? (reviews.reduce((acc, r) => acc + r.nota, 0) / reviews.length).toFixed(1) 
              : "0.0"}
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
            className={`pb-2 px-1 ${activeTab === "cardapio"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
              }`}
            onClick={() => setActiveTab("cardapio")}
          >
            Cardápio
          </button>
          <button
            className={`pb-2 px-1 ${activeTab === "avaliacoes"
                ? "border-b-2 border-red-500 text-red-500 font-medium"
                : "text-gray-500"
              }`}
            onClick={() => setActiveTab("avaliacoes")}
          >
            Avaliações ({reviews.length})
          </button>
          <button
            className={`pb-2 px-1 ${activeTab === "info"
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
                            <Image
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Avaliações</h2>
            {user && userOrders.length > 0 && (
              <button 
                onClick={handleOpenRatingModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Adicionar Avaliação
              </button>
            )}
          </div>
          
          {reviews.length === 0 ? (
            <div className="bg-white p-4 rounded-lg shadow-md text-center py-8">
              <p className="text-gray-500 mb-4">Seja o primeiro a fazer uma avaliação!</p>
              {user ? (
                userOrders.length > 0 ? (
                  <button 
                    onClick={handleOpenRatingModal}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Avaliar Restaurante
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Faça um pedido neste restaurante para poder avaliá-lo
                  </p>
                )
              ) : (
                <p className="text-gray-500 text-sm">
                  Faça login para avaliar este restaurante
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {user && user.id === review.userId ? user.nome : "Cliente"}
                    </h3>
                    <span className="text-gray-500 text-xs">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex mt-1 mb-2">
                    {renderStars(review.nota)}
                  </div>
                  
                  {review.comentario && (
                    <p className="text-gray-700 text-sm mt-2">
                      {review.comentario}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {isRatingModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Avaliar {restaurant.nome}</h2>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Usuário</label>
                  <p className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
                    {user?.nome || "Usuário"}
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Nota</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className="text-2xl focus:outline-none"
                      >
                        <FaStar 
                          className={value <= rating ? "text-yellow-500" : "text-gray-300"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Comentário (opcional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={4}
                    placeholder="Conte sua experiência com este restaurante..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsRatingModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitRating}
                    disabled={submitLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-red-300"
                  >
                    {submitLoading ? "Enviando..." : "Enviar Avaliação"}
                  </button>
                </div>
              </div>
            </div>
          )}
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