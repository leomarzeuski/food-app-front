"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Order } from "@/services/orderService";
import orderService from "@/services/orderService";
import { User } from "@/context/userContext";

interface OrdersListProps {
  user: User;
}

export function OrdersList({ user }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const userOrders = await orderService.getOrdersByUser(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        toast.error("Não foi possível carregar seu histórico de pedidos");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [user.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Histórico de Pedidos</h2>

      {loadingOrders ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Você ainda não fez nenhum pedido
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">
                  Pedido #{order.id.substring(0, 8)}
                </h3>
                <span
                  className={`text-sm ${
                    order.status === "entregue"
                      ? "text-green-500"
                      : order.status === "cancelado"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Data: {formatDate(order.createdAt)}
              </p>
              <div className="border-t border-gray-100 my-2 pt-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm py-1"
                  >
                    <span>
                      {item.quantidade}x Item #{item.itemName}
                    </span>
                    <span>
                      R$ {(item.precoUnit * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-medium mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>
                  R${" "}
                  {order.items
                    .reduce(
                      (total, item) => total + item.precoUnit * item.quantidade,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="mt-3">
                <Link
                  href={`/pedidos/${order.id}`}
                  className="text-red-500 text-sm"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
