"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export default function CarrinhoPage() {
  // This is just a demo with mock data since we don't have actual cart state management
  const [cartItems, setCartItems] = useState([
    {
      id: "item1",
      nome: "Pizza Margherita",
      preco: 30.0,
      quantity: 1,
      restauranteId: "rest1",
      restauranteNome: "Pizzaria Bom Sabor",
      imageUrl:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2069&auto=format&fit=crop",
    },
    {
      id: "item2",
      nome: "Pizza Calabresa",
      preco: 35.0,
      quantity: 2,
      restauranteId: "rest1",
      restauranteNome: "Pizzaria Bom Sabor",
      imageUrl:
        "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1976&auto=format&fit=crop",
    },
  ]);

  const endereco = {
    rua: "Rua A, 123",
    bairro: "Centro",
    cidade: "Sorocaba",
    estado: "SP",
    cep: "18000-000",
  };

  const taxaEntrega = 5.99;
  const [loading, setLoading] = useState(false);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.preco * item.quantity,
    0
  );

  // Calculate total
  const total = subtotal + taxaEntrega;

  // Handle increment quantity
  const incrementQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Handle decrement quantity
  const decrementQuantity = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handle remove item
  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Handle checkout
  const handleCheckout = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert("Pedido realizado com sucesso!");
      setLoading(false);
      setCartItems([]);
    }, 1500);
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
            href="/restaurantes"
            className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block"
          >
            Ver Restaurantes
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">{cartItems[0].restauranteNome}</h2>
                <Link
                  href={`/restaurantes/${cartItems[0].restauranteId}`}
                  className="text-red-500 text-sm"
                >
                  Adicionar mais itens
                </Link>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-16 relative rounded overflow-hidden mr-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.nome}</h3>
                      <p className="text-red-500">R$ {item.preco.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="bg-gray-200 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center mr-2"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center ml-2"
                      >
                        <FaPlus size={10} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-gray-400 hover:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-bold mb-4">Endereço de Entrega</h2>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-700">
                  {endereco.rua}, {endereco.bairro}
                </p>
                <p className="text-gray-700">
                  {endereco.cidade}, {endereco.estado} - {endereco.cep}
                </p>
              </div>
              <button className="text-red-500 text-sm mt-2">
                Alterar endereço
              </button>
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
                  <span className="text-gray-600">Taxa de entrega</span>
                  <span>R$ {taxaEntrega.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 mb-6">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium ${
                  loading
                    ? "bg-gray-400 text-white"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {loading ? "Processando..." : "Finalizar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
