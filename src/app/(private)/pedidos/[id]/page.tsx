"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaMotorcycle,
  FaCheckCircle,
  FaUtensils,
  FaBox,
} from "react-icons/fa";

export default function PedidoPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState("preparando");
  const [currentStep, setCurrentStep] = useState(2);
  const [tempoRestante, setTempoRestante] = useState(25);

  // Mock order data
  const pedido = {
    id: params.id,
    restauranteId: "rest1",
    restauranteNome: "Pizzaria Bom Sabor",
    restauranteImagem:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    horaPedido: "19:30",
    previsaoEntrega: "20:05 - 20:20",
    endereco: {
      rua: "Rua A, 123",
      bairro: "Centro",
      cidade: "Sorocaba",
      estado: "SP",
      cep: "18000-000",
    },
    entregador: {
      nome: "Leo",
      avaliacao: 4.8,
    },
    status: "preparando", // confirmado, preparando, a caminho, entregue
    itens: [
      {
        nome: "Pizza Margherita",
        quantidade: 1,
        preco: 30.0,
      },
      {
        nome: "Pizza Calabresa",
        quantidade: 1,
        preco: 35.0,
      },
      {
        nome: "Refrigerante Cola 2L",
        quantidade: 1,
        preco: 12.0,
      },
    ],
    subtotal: 77.0,
    taxaEntrega: 5.99,
    total: 82.99,
    pagamento: {
      metodo: "Cartão de Crédito",
      info: "Final 1234",
    },
  };

  useEffect(() => {
    // Simulate order status progression in demo
    const timer = setTimeout(() => {
      if (status === "preparando") {
        setStatus("a caminho");
        setCurrentStep(3);
      } else if (status === "a caminho" && tempoRestante > 0) {
        setTempoRestante((prev) => Math.max(0, prev - 1));
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [status, tempoRestante]);

  // Update countdown timer
  useEffect(() => {
    if (tempoRestante <= 0) return;

    const interval = setInterval(() => {
      setTempoRestante((prev) => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [tempoRestante]);

  const steps = [
    { id: 1, name: "Confirmado", icon: <FaCheckCircle />, complete: true },
    {
      id: 2,
      name: "Preparando",
      icon: <FaUtensils />,
      complete: currentStep > 2,
    },
    {
      id: 3,
      name: "A caminho",
      icon: <FaMotorcycle />,
      complete: currentStep > 3,
    },
    { id: 4, name: "Entregue", icon: <FaBox />, complete: currentStep > 4 },
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/perfil" className="mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Acompanhar Pedido</h1>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 relative rounded-lg overflow-hidden">
            <Image
              src={pedido.restauranteImagem}
              alt={pedido.restauranteNome}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg">{pedido.restauranteNome}</h2>
            <p className="text-gray-600">Pedido #{pedido.id}</p>
            <p className="text-gray-600">Feito às {pedido.horaPedido}</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="relative mb-12">
          {/* Progress Line */}
          <div className="absolute left-0 top-4 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-red-500"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>

          {/* Steps */}
          <div className="flex justify-between relative">
            {steps.map((step) => (
              <div key={step.id} className="text-center">
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                    step.id <= currentStep
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="mt-2 text-sm">{step.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="text-center mb-6">
          <h3 className="font-bold text-lg mb-1">
            {status === "a caminho"
              ? "Seu pedido está a caminho!"
              : "Seu pedido está sendo preparado!"}
          </h3>
          <p className="text-gray-600">
            {status === "a caminho" && tempoRestante > 0
              ? `Tempo estimado de entrega: ${tempoRestante} min`
              : `Previsão de entrega: ${pedido.previsaoEntrega}`}
          </p>
        </div>

        {/* Delivery Person (visible only when delivery is on the way) */}
        {status === "a caminho" && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <FaMotorcycle className="text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{pedido.entregador.nome}</p>
                  <div className="flex items-center text-yellow-500">
                    <FaCheckCircle className="mr-1" />
                    <span>{pedido.entregador.avaliacao}</span>
                  </div>
                </div>
              </div>
              <button className="bg-green-500 text-white px-3 py-2 rounded-full">
                Contatar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Detalhes do Pedido</h2>
        <div className="space-y-2 mb-4">
          {pedido.itens.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.quantidade}x {item.nome}
              </span>
              <span>R$ {item.preco.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>R$ {pedido.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxa de entrega</span>
            <span>R$ {pedido.taxaEntrega.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-2">
            <span>Total</span>
            <span>R$ {pedido.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Endereço de Entrega</h2>
        <p>
          {pedido.endereco.rua}, {pedido.endereco.bairro}
        </p>
        <p>
          {pedido.endereco.cidade}, {pedido.endereco.estado} -{" "}
          {pedido.endereco.cep}
        </p>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="font-bold text-lg mb-4">Pagamento</h2>
        <p>{pedido.pagamento.metodo}</p>
        <p className="text-gray-600">{pedido.pagamento.info}</p>
      </div>
    </div>
  );
}
