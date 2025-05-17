import Image from "next/image";
import Link from "next/link";
import { FaStar, FaMotorcycle } from "react-icons/fa";

export default function Home() {
  // Hardcoded data based on the JSON files structure
  const featuredRestaurants = [
    {
      id: "rest1",
      nome: "Pizzaria Bom Sabor",
      categories: ["pizza", "italiana"],
      rating: 4.7,
      deliveryTime: "30-45 min",
      imageUrl:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const categories = [
    { id: "1", name: "Pizza", icon: "🍕" },
    { id: "2", name: "Hambúrguer", icon: "🍔" },
    { id: "3", name: "Brasileira", icon: "🍖" },
    { id: "4", name: "Japonesa", icon: "🍣" },
    { id: "5", name: "Italiana", icon: "🍝" },
    { id: "6", name: "Sobremesas", icon: "🍰" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg p-6 shadow-lg">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Peça sua comida favorita</h1>
          <p className="text-xl mb-6">
            Os melhores restaurantes com entrega rápida até você
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="Digite seu endereço"
              className="px-4 py-2 rounded-l text-gray-800 flex-grow"
            />
            <button className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded-r font-medium">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Categorias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.name.toLowerCase()}`}
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="font-medium">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Restaurantes em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRestaurants.map((restaurant) => (
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
                <div className="flex items-center mt-1 text-gray-600">
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
      </section>
    </div>
  );
}
