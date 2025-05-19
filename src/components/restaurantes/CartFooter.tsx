import { OrderItem } from "@/services/orderService";
import Link from "next/link";

export const CartFooter = ({
  cartItems,
  calculateTotal,
}: // handleCreateOrder,
{
  cartItems: OrderItem[];
  calculateTotal: () => number;
  handleCreateOrder: () => void;
}) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium">
        Total: R$ {calculateTotal().toFixed(2)}
      </span>
      <span>
        {cartItems.reduce((acc, item) => acc + item.quantidade, 0)} itens
      </span>
    </div>
    <Link
      href="/carrinho"
      className="bg-red-500 text-white w-full py-3 rounded-lg font-medium flex items-center justify-center"
    >
      Finalizar Pedido
    </Link>
  </div>
);
