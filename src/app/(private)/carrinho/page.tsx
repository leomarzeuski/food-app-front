"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaPlus,
  FaMinus,
  FaTrash,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useCart } from "@/context/cartContext";
import { MenuItemUI } from "@/components/restaurantes/MenuTab";
import { useUser } from "@/context/userContext";
import { orderService } from "@/services";
import { toast } from "sonner";
import { CreateOrderDto } from "@/services/orderService";

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, addToCart, clearCart, calculateTotal } =
    useCart();

  const { user, addresses } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const itemsByRestaurant = cartItems.reduce((acc, item) => {
    const restaurantId = item.restauranteId || "unknown";

    if (!acc[restaurantId]) {
      acc[restaurantId] = {
        items: [],
        name: item.restauranteName || "Restaurante",
        id: restaurantId,
      };
    }
    acc[restaurantId].items.push(item);
    return acc;
  }, {} as Record<string, { items: typeof cartItems; name: string; id: string }>);

  const DELIVERY_FEE_PER_RESTAURANT = 5.99;

  const totalDeliveryFee =
    Object.keys(itemsByRestaurant).length * DELIVERY_FEE_PER_RESTAURANT;

  const subtotal = calculateTotal();

  const total = subtotal + totalDeliveryFee;

  useEffect(() => {
    if (addresses.length > 0) {
      const primaryAddress = addresses.find((addr) => addr.principal);
      if (primaryAddress) {
        setSelectedAddressId(primaryAddress.id);
      } else if (addresses[0]) {
        setSelectedAddressId(addresses[0].id);
      }
    }
  }, [addresses]);

  const incrementQuantity = (itemId: string) => {
    const item = cartItems.find((i) => i.itemId === itemId);
    if (item) {
      const menuItem: MenuItemUI = {
        id: item.itemId,
        nome: item.itemName,
        preco: item.precoUnit,
        categoria: "",
        restauranteId: item.restauranteId || "",
        descricao: "",
        imagemUrl: item.imageUrl || "",
        disponivel: true,
      };
      addToCart(menuItem);
    }
  };

  const decrementQuantity = (itemId: string) => {
    removeFromCart(itemId);
  };

  const removeItem = (itemId: string) => {
    const item = cartItems.find((i) => i.itemId === itemId);
    if (item) {
      for (let i = 0; i < item.quantidade; i++) {
        removeFromCart(itemId);
      }
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para finalizar o pedido");
      return;
    }

    if (!selectedAddressId) {
      toast.error("Selecione um endereço de entrega");
      return;
    }

    setLoading(true);

    try {
      const orderPromises = Object.entries(itemsByRestaurant)
        .filter(([restaurantId]) => restaurantId !== "unknown") // Skip items without restaurantId
        .map(async ([restaurantId, restaurantData]) => {
          const orderData: CreateOrderDto = {
            userId: user.id,
            userName: user.nome,
            restaurantId,
            status: "novo",
            items: restaurantData.items,
            addressId: selectedAddressId,
          };

          return orderService.createOrder(orderData);
        });

      if (orderPromises.length === 0) {
        toast.error(
          "Não foi possível identificar restaurantes válidos no carrinho"
        );
        setLoading(false);
        return;
      }

      await Promise.all(orderPromises);

      toast.success("Pedido realizado com sucesso!");
      clearCart();
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Falha ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Carrinho</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
          <Link
            href="/"
            className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block"
          >
            Ver Restaurantes
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            {Object.entries(itemsByRestaurant).map(
              ([restaurantId, restaurantData]) => (
                <div
                  key={restaurantId}
                  className="bg-white rounded-lg shadow-md p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold">{restaurantData.name}</h2>
                    {restaurantId !== "unknown" && (
                      <Link
                        href={`/restaurantes/${restaurantId}`}
                        className="text-red-500 text-sm"
                      >
                        Adicionar mais itens
                      </Link>
                    )}
                  </div>

                  <div className="space-y-4">
                    {restaurantData.items.map((item) => (
                      <div
                        key={item.itemId}
                        className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="w-16 h-16 relative rounded overflow-hidden mr-4 bg-gray-200 flex items-center justify-center">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.itemName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-gray-400">Sem imagem</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.itemName}</h3>
                          <p className="text-red-500">
                            R$ {item.precoUnit.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => decrementQuantity(item.itemId)}
                            className="bg-gray-200 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center mr-2"
                          >
                            <FaMinus size={10} />
                          </button>
                          <span className="px-2">{item.quantidade}</span>
                          <button
                            onClick={() => incrementQuantity(item.itemId)}
                            className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center ml-2"
                          >
                            <FaPlus size={10} />
                          </button>
                          <button
                            onClick={() => removeItem(item.itemId)}
                            className="ml-4 text-gray-400 hover:text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-bold mb-4">Endereço de Entrega</h2>

              {addresses.length === 0 ? (
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-gray-700 mb-2">
                    Você não possui endereços cadastrados
                  </p>
                  <Link href="/perfil" className="text-red-500">
                    Cadastrar endereço
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border p-3 rounded flex items-start cursor-pointer 
                          ${
                            selectedAddressId === address.id
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200"
                          }`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="mr-3 mt-1">
                          <FaMapMarkerAlt
                            className={
                              selectedAddressId === address.id
                                ? "text-red-500"
                                : "text-gray-400"
                            }
                          />
                        </div>
                        <div>
                          {address.apelido && (
                            <p className="font-medium">{address.apelido}</p>
                          )}
                          <p className="text-gray-700">
                            {address.rua}, {address.numero}{" "}
                            {address.complemento
                              ? `, ${address.complemento}`
                              : ""}
                          </p>
                          <p className="text-gray-700">
                            {address.bairro}, {address.cidade} -{" "}
                            {address.estado}
                          </p>
                          <p className="text-gray-700">{address.cep}</p>
                          {address.principal && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mt-1 inline-block">
                              Principal
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/perfil"
                    className="text-red-500 text-sm mt-3 inline-block"
                  >
                    Gerenciar endereços
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="font-bold mb-4">Resumo do Pedido</h2>
              <div className="space-y-2 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Taxa de entrega ({Object.keys(itemsByRestaurant).length}{" "}
                    {Object.keys(itemsByRestaurant).length === 1
                      ? "restaurante"
                      : "restaurantes"}
                    )
                  </span>
                  <span>R$ {totalDeliveryFee.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 mb-6">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || addresses.length === 0}
                className={`w-full py-3 rounded-lg font-medium ${
                  loading || addresses.length === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {loading ? "Processando..." : "Finalizar Pedido"}
              </button>

              {addresses.length === 0 && (
                <p className="text-center text-sm text-red-500 mt-2">
                  Cadastre um endereço para continuar
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
