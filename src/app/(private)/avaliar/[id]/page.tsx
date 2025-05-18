"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AvaliarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [restauranteRating, setRestauranteRating] = useState(0);
  const [entregadorRating, setEntregadorRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock order data
  const pedido = {
    id: params.id,
    restauranteId: "rest1",
    restauranteNome: "Pizzaria Bom Sabor",
    restauranteImagem:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    entregadorNome: "Leo",
    data: "28/04/2023",
    horario: "20:15",
    itens: [
      { nome: "Pizza Margherita", quantidade: 1 },
      { nome: "Pizza Calabresa", quantidade: 1 },
      { nome: "Refrigerante Cola 2L", quantidade: 1 },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      alert("Avaliação enviada com sucesso!");
      router.push("/perfil");
    }, 1500);
  };

  // Render stars for rating
  const renderStars = (rating: number, setRating: (value: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <FaStar
              className={`text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/perfil" className="mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Avaliar Pedido</h1>
      </div>

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
            <p className="text-gray-600">
              Entregue em {pedido.data} às {pedido.horario}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-600 mb-2">Itens:</div>
          <ul className="list-disc list-inside mb-4">
            {pedido.itens.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item.quantidade}x {item.nome}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Restaurant Rating */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">
            Como foi a sua experiência?
          </h2>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-medium">{pedido.restauranteNome}</p>
              <p className="text-sm text-gray-600">
                Qualidade da comida, sabor, embalagem
              </p>
            </div>
            {renderStars(restauranteRating, setRestauranteRating)}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Entregador: {pedido.entregadorNome}</p>
              <p className="text-sm text-gray-600">
                Rapidez, cuidado, cordialidade
              </p>
            </div>
            {renderStars(entregadorRating, setEntregadorRating)}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Comentários (opcional)</h2>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 h-24 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Conte-nos mais sobre sua experiência..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || (restauranteRating === 0 && entregadorRating === 0)
          }
          className={`w-full py-3 rounded-lg font-medium ${
            loading || (restauranteRating === 0 && entregadorRating === 0)
              ? "bg-gray-400 text-white"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {loading ? "Enviando..." : "Enviar Avaliação"}
        </button>
      </form>
    </div>
  );
}
