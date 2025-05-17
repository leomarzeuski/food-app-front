import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMotorcycle, FaSearch } from "react-icons/fa";

export default function RestaurantesPage() {
  // Hardcoded data based on the JSON files structure
  const restaurantes = [
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
      nome: "Hamburgueria Top",
      categories: ["hambúrguer", "sanduíches"],
      rating: 4.5,
      deliveryTime: "40-55 min",
      imageUrl:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2065&auto=format&fit=crop",
      endereco: {
        cidade: "Sorocaba",
        estado: "SP",
      },
    },
    {
      id: "rest3",
      nome: "Sushi Express",
      categories: ["japonesa", "sushi"],
      rating: 4.8,
      deliveryTime: "45-60 min",
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop",
      endereco: {
        cidade: "Sorocaba",
        estado: "SP",
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Buscar restaurantes, culinárias..."
                className="w-full px-4 py-2 focus:outline-none"
              />
            </div>
            <button className="bg-red-500 text-white px-4 py-2">
              <FaSearch />
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              Todos
            </button>
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              Pizza
            </button>
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              Hambúrguer
            </button>
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              Japonesa
            </button>
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              Brasileira
            </button>
            <button className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
              Italiana
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold">Restaurantes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantes.map((restaurant) => (
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
                      className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
