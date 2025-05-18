import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMotorcycle, FaArrowLeft } from "react-icons/fa";

export default function CategoriaPage({
  params,
}: {
  params: { categoria: string };
}) {
  // Capitalize first letter for display
  const categoriaFormatada =
    params.categoria.charAt(0).toUpperCase() + params.categoria.slice(1);

  // Hardcoded data based on the JSON files structure
  // In a real app, we would filter restaurants by category from an API
  const restaurantesFiltrados = [
    {
      id: "rest1",
      nome: "Pizzaria Bom Sabor",
      categories: ["pizza", "italiana"],
      rating: 4.7,
      deliveryTime: "30-45 min",
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
      endereco: {
        cidade: "Sorocaba",
        estado: "SP",
      },
    },
    {
      id: "rest2",
      nome: "Italiano Autêntico",
      categories: ["pizza", "italiana", "massas"],
      rating: 4.5,
      deliveryTime: "40-55 min",
      imageUrl:
        "https://images.unsplash.com/photo-1579684947550-22e945225d9a?q=80&w=2074&auto=format&fit=crop",
      endereco: {
        cidade: "Sorocaba",
        estado: "SP",
      },
    },
  ].filter((restaurant) =>
    restaurant.categories.includes(params.categoria.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">Categoria: {categoriaFormatada}</h1>
      </div>

      {restaurantesFiltrados.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">
            Não encontramos restaurantes nesta categoria
          </p>
          <Link
            href="/restaurantes"
            className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block"
          >
            Ver Todos os Restaurantes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantesFiltrados.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurantes/${restaurant.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={restaurant.imageUrl}
                  alt={restaurant.nome}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{restaurant.nome}</h3>
                <div className="text-sm text-gray-600 mb-1">
                  {restaurant.endereco.cidade}, {restaurant.endereco.estado}
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="flex items-center text-yellow-500 mr-2">
                    <FaStar className="mr-1" /> {restaurant.rating}
                  </span>
                  <span className="flex items-center">
                    <FaMotorcycle className="mr-1" /> {restaurant.deliveryTime}
                  </span>
                </div>
                <div className="mt-2">
                  {restaurant.categories.map((cat, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded mr-1 ${
                        cat === params.categoria.toLowerCase()
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
