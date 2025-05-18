import { useState } from "react";
import Image from "next/image";
import { FaPlus, FaTrash } from "react-icons/fa";
import { menuItemService } from "@/services";
import type { MenuItem, CreateMenuItemDto } from "@/services/menuItemService";

interface MenuTabProps {
  restaurantId: string;
  menuItems: MenuItem[];
  onMenuItemsChange: (updatedMenuItems: MenuItem[]) => void;
}

export default function MenuTab({
  restaurantId,
  menuItems,
  onMenuItemsChange,
}: MenuTabProps) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState("");
  const [newItemAvailable, setNewItemAvailable] = useState(true);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewItemImage(url);

    if (url.startsWith("http") || url.startsWith("https")) {
      setPreviewImage(url);
    } else {
      setPreviewImage(null);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newMenuItem: CreateMenuItemDto = {
        restauranteId: restaurantId,
        nome: newItemName,
        descricao: newItemDescription,
        preco: parseFloat(newItemPrice) || 0,
        imagemUrl: newItemImage || undefined,
        disponivel: newItemAvailable,
      };

      const createdItem = await menuItemService.createMenuItem(newMenuItem);

      onMenuItemsChange([...menuItems, createdItem]);

      setNewItemName("");
      setNewItemDescription("");
      setNewItemPrice("");
      setNewItemImage("");
      setNewItemAvailable(true);
      setPreviewImage(null);
      setShowAddItemForm(false);
    } catch (error) {
      console.error("Error creating menu item:", error);
      alert("Não foi possível adicionar o item ao cardápio.");
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updatedItem = await menuItemService.updateMenuItemAvailability(
        item.id,
        !item.disponivel
      );

      onMenuItemsChange(
        menuItems.map((prevItem) =>
          prevItem.id === updatedItem.id ? updatedItem : prevItem
        )
      );
    } catch (error) {
      console.error("Error updating item availability:", error);
      alert("Não foi possível atualizar a disponibilidade do item.");
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;

    try {
      await menuItemService.deleteMenuItem(itemId);

      onMenuItemsChange(menuItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Não foi possível excluir o item.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Itens do Cardápio</h2>
        <button
          onClick={() => setShowAddItemForm(!showAddItemForm)}
          className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center"
        >
          {showAddItemForm ? (
            "Cancelar"
          ) : (
            <>
              <FaPlus className="mr-1" /> Adicionar Item
            </>
          )}
        </button>
      </div>

      {showAddItemForm && (
        <form
          onSubmit={handleAddMenuItem}
          className="bg-gray-50 p-4 rounded-lg mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={2}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                URL da Imagem
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="url"
                  value={newItemImage}
                  onChange={handleImageURLChange}
                  className="w-full p-2 border rounded"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                {previewImage && (
                  <div className="flex items-center mt-2">
                    <div className="relative w-24 h-24 rounded">
                      <Image
                        src={previewImage}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 text-sm text-gray-600">
                      <p>Preview da imagem</p>
                      <p className="text-xs mt-1">
                        Dica: Use sites como Unsplash, Pexels ou Pixabay para
                        encontrar imagens gratuitas.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Disponibilidade
              </label>
              <select
                value={newItemAvailable ? "true" : "false"}
                onChange={(e) => setNewItemAvailable(e.target.value === "true")}
                className="w-full p-2 border rounded"
              >
                <option value="true">Disponível</option>
                <option value="false">Indisponível</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adicionar ao Cardápio
            </button>
          </div>
        </form>
      )}

      {menuItems.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">
            Você ainda não possui itens no cardápio.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                  <Image
                    src={item.imagemUrl || "https://via.placeholder.com/150"}
                    alt={item.nome}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{item.nome}</h3>
                  <p className="text-gray-600 text-sm">{item.descricao}</p>
                  <p className="text-red-500 font-bold mt-1">
                    R$ {item.preco.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleAvailability(item)}
                  className={`px-3 py-1 rounded text-sm ${
                    item.disponivel
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.disponivel ? "Disponível" : "Indisponível"}
                </button>
                <button
                  onClick={() => handleDeleteMenuItem(item.id)}
                  className="bg-red-100 text-red-800 p-2 rounded hover:bg-red-200"
                  title="Excluir item"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
