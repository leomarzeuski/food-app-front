import { useState } from "react";
import Image from "next/image";
import { FaEdit, FaCamera } from "react-icons/fa";
import { restaurantService } from "@/services";
import type { Restaurant } from "@/services/restaurantService";
import { getFallbackImageUrl } from "@/utils/imageUtils";

interface RestaurantHeaderProps {
  restaurant: Restaurant;
  onRestaurantUpdate: (updatedRestaurant: Restaurant) => void;
}

export default function RestaurantHeader({
  restaurant,
  onRestaurantUpdate,
}: RestaurantHeaderProps) {
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
  const [editName, setEditName] = useState(restaurant.nome);
  const [editCategories, setEditCategories] = useState(
    restaurant.categories.join(", ")
  );
  const [editIsOpen, setEditIsOpen] = useState(restaurant.isOpen);
  const [editImageUrl, setEditImageUrl] = useState(restaurant.imageUrl || "");
  const [imagePreview, setImagePreview] = useState(restaurant.imageUrl || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setEditImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setEditImageUrl(url);
    setImagePreview(url);
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedRestaurant = await restaurantService.updateRestaurant(
        restaurant.id,
        {
          nome: editName,
          categories: editCategories.split(",").map((cat) => cat.trim()),
          isOpen: editIsOpen,
          imageUrl: editImageUrl,
        }
      );

      onRestaurantUpdate(updatedRestaurant);
      setIsEditingRestaurant(false);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      alert("Não foi possível atualizar as informações do restaurante.");
    }
  };

  const displayImageUrl =
    restaurant.imageUrl || getFallbackImageUrl(restaurant.categories);

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {isEditingRestaurant ? (
        <div className="w-32">
          <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 mb-2">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt={editName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <FaCamera className="text-gray-400 text-3xl" />
              </div>
            )}
          </div>
          <div className="text-center">
            <label className="cursor-pointer block bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 mb-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              Enviar imagem
            </label>
            <p className="text-xs text-gray-500">ou</p>
            <input
              type="text"
              value={editImageUrl}
              onChange={handleImageUrlChange}
              placeholder="URL da imagem"
              className="mt-1 p-1 text-xs w-full border rounded"
            />
          </div>
        </div>
      ) : (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          <Image
            src={displayImageUrl}
            alt={restaurant.nome}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        {isEditingRestaurant ? (
          <form onSubmit={handleUpdateRestaurant} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome do Restaurante
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Categorias (separadas por vírgula)
              </label>
              <input
                type="text"
                value={editCategories}
                onChange={(e) => setEditCategories(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={editIsOpen ? "true" : "false"}
                onChange={(e) => setEditIsOpen(e.target.value === "true")}
                className="w-full p-2 border rounded"
              >
                <option value="true">Aberto</option>
                <option value="false">Fechado</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setIsEditingRestaurant(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{restaurant.nome}</h1>
                <div className="text-sm text-gray-600 mt-1">
                  {restaurant.endereco.cidade}, {restaurant.endereco.estado}
                </div>
                <div className="mt-2 mb-2">
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
              <button
                onClick={() => setIsEditingRestaurant(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
              >
                <FaEdit className="mr-1" /> Editar
              </button>
            </div>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  restaurant.isOpen
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {restaurant.isOpen ? "Aberto" : "Fechado"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
