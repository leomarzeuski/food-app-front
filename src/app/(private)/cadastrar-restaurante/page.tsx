"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import { toast } from "sonner";
import AddressForm from "@/components/AddressForm";
import { restaurantService } from "@/services";

export default function CadastrarRestaurantePage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [addressData, setAddressData] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    apelido: "",
  });

  const handleAddressChange = (data: typeof addressData) => {
    setAddressData(data);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Você precisa estar logado para cadastrar um restaurante");
      return;
    }

    if (!nome) {
      toast.error("Preencha o nome do restaurante");
      return;
    }

    if (categories.length === 0) {
      toast.error("Adicione pelo menos uma categoria ao seu restaurante");
      return;
    }

    if (
      !addressData.cep ||
      !addressData.rua ||
      !addressData.numero ||
      !addressData.cidade ||
      !addressData.estado
    ) {
      toast.error("Preencha todos os campos obrigatórios do endereço");
      return;
    }

    setLoading(true);

    try {
      const defaultLocation = {
        latitude: -23.5505,
        longitude: -46.6333,
      };

      await restaurantService.createRestaurant({
        nome,
        categories,
        endereco: {
          rua: addressData.rua,
          numero: addressData.numero,
          cidade: addressData.cidade,
          estado: addressData.estado,
          cep: addressData.cep,
        },
        isOpen: true,
        location: defaultLocation,
        userId: user.id,
      });

      toast.success("Restaurante cadastrado com sucesso!");
      router.push("/meu-restaurante");
    } catch (error) {
      console.error("Erro ao cadastrar restaurante:", error);
      toast.error("Erro ao cadastrar seu restaurante. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Cadastrar Novo Restaurante</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block mb-1 font-medium">
              Nome do Restaurante
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Categorias</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ex: Italiana, Pizza, Vegana..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Adicionar
              </button>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="px-3 py-1 bg-gray-100 rounded-full flex items-center"
                  >
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">
              Endereço do Restaurante
            </h3>
            <AddressForm
              onAddressChange={handleAddressChange}
              initialValues={addressData}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium ${
              loading
                ? "bg-gray-400 text-white"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {loading ? "Processando..." : "Cadastrar Restaurante"}
          </button>
        </form>
      </div>
    </div>
  );
}
