"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaStar, FaMotorcycle, FaSearch } from "react-icons/fa";
import { restaurantService } from "@/services";
import type { Restaurant } from "@/services/restaurantService";
import Image from "next/image";

interface RestaurantUI extends Restaurant {
  rating?: number;
  deliveryTime?: string;
}

export default function RestaurantesPage() {
  const [restaurants, setRestaurants] = useState<RestaurantUI[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<
    RestaurantUI[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = [
    "Todos",
    "Pizza",
    "Hambúrguer",
    "Japonesa",
    "Brasileira",
    "Italiana",
    "Batata",
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAllRestaurants();

        const enhancedData = data.map((restaurant) => ({
          ...restaurant,
          deliveryTime: "30-45 min",
        }));

        setRestaurants(enhancedData);
        setFilteredRestaurants(enhancedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
        setError(
          "Não foi possível carregar os restaurantes. Por favor, tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    let result = restaurants;

    if (searchTerm) {
      result = result.filter(
        (restaurant) =>
          restaurant.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.categories.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (activeCategory !== "Todos") {
      result = result.filter((restaurant) =>
        restaurant.categories.some(
          (cat) => cat.toLowerCase() === activeCategory.toLowerCase()
        )
      );
    }

    setFilteredRestaurants(result);
  }, [searchTerm, activeCategory, restaurants]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

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
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <button className="bg-red-500 text-white px-4 py-2">
              <FaSearch />
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`${
                  activeCategory === category
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } px-3 py-1 rounded-full text-sm`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <h1 className="text-2xl font-bold">Restaurantes</h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <p className="text-gray-600">
              Nenhum restaurante encontrado. Tente mudar os filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
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
                      <FaStar className="mr-1" /> {restaurant.ratingAverage}
                    </span>
                    <span className="flex items-center">
                      <FaMotorcycle className="mr-1" />{" "}
                      {restaurant.deliveryTime || "30-45 min"}
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
        )}
      </div>
    </div>
  );
}
