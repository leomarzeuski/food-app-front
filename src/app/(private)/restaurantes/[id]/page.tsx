"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { restaurantService, menuItemService, orderService } from "@/services";
import ratingService, {
  Rating,
  CreateRatingDto,
} from "@/services/ratingService";
import type { Restaurant } from "@/services/restaurantService";
import type { CreateOrderDto } from "@/services/orderService";
import { useUser } from "@/context/userContext";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { RestaurantHeader } from "@/components/restaurantes/RestaurantHeader";
import { RatingsTabComponent } from "@/components/restaurantes/Ratings";
import {
  MenuItemUI,
  MenuTabComponent,
} from "@/components/restaurantes/MenuTab";
import { InfoTabComponent } from "@/components/restaurantes/InfoTab";
import { CartFooter } from "@/components/restaurantes/CartFooter";

export default function RestaurantDetail() {
  const params = useParams<{ id: string }>();
  const restaurantId = params.id;
  const {
    cartItems,
    addToCart,
    removeFromCart,
    getItemQuantity,
    calculateTotal,
  } = useCart();

  const [activeTab, setActiveTab] = useState("cardapio");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItemUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userOrders, setUserOrders] = useState<string[]>([]);
  const { user } = useUser();

  const isRestaurantUser = user?.tipo === "restaurante";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [restaurantData, menuItemsData] = await Promise.all([
          restaurantService.getRestaurantById(restaurantId),
          menuItemService.getMenuItemsByRestaurant(restaurantId),
        ]);

        setRestaurant(restaurantData);

        const enhancedMenuItems = menuItemsData.map((item, index) => ({
          ...item,
          categoria: index % 2 === 0 ? "Principais" : "Bebidas",
        }));

        setMenuItems(enhancedMenuItems);

        const [ratingsData, allOrders] = await Promise.all([
          ratingService.getAllRatings(),
          orderService.getOrdersByRestaurant(restaurantId),
        ]);

        const restaurantOrderIds = allOrders.map((order) => order.id);
        const restaurantRatings = ratingsData.filter((rating) =>
          restaurantOrderIds.includes(rating.orderId)
        );

        setReviews(restaurantRatings);

        if (user?.id && !isRestaurantUser) {
          const userOrdersResponse = await orderService.getOrdersByUser(
            user.id
          );
          const restaurantOrders = userOrdersResponse
            .filter((order) => order.restaurantId === restaurantId)
            .map((order) => order.id);

          setUserOrders(restaurantOrders);
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
  }, [restaurantId, user?.id, isRestaurantUser]);

  const categories =
    menuItems.length > 0
      ? [...new Set(menuItems.map((item) => item.categoria || "Sem categoria"))]
      : [];

  const handleAddToCart = (item: MenuItemUI) => {
    if (isRestaurantUser) {
      toast.error("Restaurantes não podem fazer pedidos");
      return;
    }

    addToCart(item);
    toast.success(`${item.nome} adicionado ao carrinho!`);
  };

  const handleCreateOrder = async () => {
    if (!restaurant || cartItems.length === 0 || isRestaurantUser) return;

    try {
      const orderData: CreateOrderDto = {
        userId: user?.id || "",
        userName: user?.nome || "",
        restaurantId: restaurant.id,
        status: "novo",
        items: cartItems,
      };

      await orderService.createOrder(orderData);
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

    if (isRestaurantUser) {
      toast.error("Restaurantes não podem deixar avaliações");
      return;
    }

    if (userOrders.length === 0) {
      toast.error(
        "Você precisa ter feito um pedido neste restaurante para avaliá-lo."
      );
      return;
    }

    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!user || userOrders.length === 0 || isRestaurantUser || !restaurant) return;

    try {
      setSubmitLoading(true);

      const ratingData: CreateRatingDto = {
        orderId: userOrders[0],
        userId: user.id,
        nota: rating,
        comentario: comment.trim() || undefined,
        restaurantId: restaurant.id
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
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
      <RestaurantHeader restaurant={restaurant} reviews={reviews} />

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
            Avaliações ({reviews.length})
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
        <MenuTabComponent
          menuItems={menuItems}
          categories={categories}
          isRestaurantUser={isRestaurantUser}
          getItemQuantity={getItemQuantity}
          addToCart={handleAddToCart}
          removeFromCart={removeFromCart}
        />
      )}

      {activeTab === "avaliacoes" && (
        <RatingsTabComponent
          reviews={reviews}
          user={user}
          userOrders={userOrders}
          restaurant={restaurant}
          handleOpenRatingModal={handleOpenRatingModal}
          isRatingModalOpen={isRatingModalOpen}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          submitLoading={submitLoading}
          setIsRatingModalOpen={setIsRatingModalOpen}
          handleSubmitRating={handleSubmitRating}
          formatDate={formatDate}
          renderStars={renderStars}
        />
      )}

      {activeTab === "info" && <InfoTabComponent restaurant={restaurant} />}

      {cartItems.length > 0 && !isRestaurantUser && (
        <CartFooter
          cartItems={cartItems}
          calculateTotal={calculateTotal}
          handleCreateOrder={handleCreateOrder}
        />
      )}
    </div>
  );
}
