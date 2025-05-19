import { Rating } from "@/services/ratingService";
import { Restaurant } from "@/services/restaurantService";
import Image from "next/image";
import { FaClock, FaMotorcycle, FaStar } from "react-icons/fa";

export const RestaurantHeader = ({
  restaurant,
  reviews,
}: {
  restaurant: Restaurant;
  reviews: Rating[];
}) => (
  <>
    <div className="relative h-48 w-full mb-16">
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.nome}
        fill
        className="object-cover"
      />
      <div className="absolute -bottom-12 left-4 bg-white p-2 rounded-lg shadow-md">
        <div className="w-24 h-24 relative">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.nome}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>

    <div className="pl-32">
      <h1 className="text-2xl font-bold">{restaurant.nome}</h1>
      <div className="flex items-center mt-1 text-gray-600">
        <span className="flex items-center text-yellow-500 mr-3">
          <FaStar className="mr-1" />
          {reviews.length > 0
            ? (
                reviews.reduce((acc, r) => acc + r.nota, 0) / reviews.length
              ).toFixed(1)
            : "0.0"}
        </span>
        <span className="flex items-center mr-3">
          <FaMotorcycle className="mr-1" /> 30-45 min
        </span>
        <span className="flex items-center">
          <FaClock className="mr-1" />{" "}
          {restaurant.isOpen ? "Aberto" : "Fechado"}
        </span>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {restaurant.endereco.rua}, {restaurant.endereco.cidade},{" "}
        {restaurant.endereco.estado} - {restaurant.endereco.cep}
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
  </>
);
