import { orderService } from "@/services";
import type { Order } from "@/services/orderService";
import type { MenuItem } from "@/services/menuItemService";

interface OrdersTabProps {
  orders: Order[];
  menuItems: MenuItem[];
  onOrdersChange: (updatedOrders: Order[]) => void;
}

export default function OrdersTab({
  orders,
  menuItems,
  onOrdersChange,
}: OrdersTabProps) {
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(
        orderId,
        newStatus
      );

      onOrdersChange(
        orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Não foi possível atualizar o status do pedido.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Pedidos Recebidos</h2>

      {orders.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">Você ainda não possui pedidos.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-gray-500 text-sm">
                    Pedido #{order.id.substring(0, 8)}
                  </span>
                  <h3 className="font-bold">Cliente: {order.userName}</h3>
                  <p className="font-bold">Cliente ID: {order.userId}</p>
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
  );
}
