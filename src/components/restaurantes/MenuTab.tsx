import { MenuItem } from "@/services/menuItemService";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa";

export interface MenuItemUI extends MenuItem {
  categoria?: string;
}

export const MenuTabComponent = ({
  menuItems,
  categories,
  isRestaurantUser,
  getItemQuantity,
  addToCart,
  removeFromCart,
}: {
  menuItems: MenuItemUI[];
  categories: string[];
  isRestaurantUser: boolean;
  getItemQuantity: (itemId: string) => number;
  addToCart: (item: MenuItemUI) => void;
  removeFromCart: (itemId: string) => void;
}) => (
  <div className="mt-6">
    {menuItems.length === 0 ? (
      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <p className="text-gray-600">
          Este restaurante ainda não possui itens no cardápio.
        </p>
      </div>
    ) : (
      categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{category}</h2>
          <div className="space-y-4">
            {menuItems
              .filter(
                (item) => (item.categoria || "Sem categoria") === category
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div className="flex-1 pr-4">
                    <h3 className="font-bold">{item.nome}</h3>
                    <p className="text-gray-600 text-sm">{item.descricao}</p>
                    <p className="text-red-500 font-bold mt-1">
                      R$ {item.preco.toFixed(2)}
                    </p>
                    {!item.disponivel && (
                      <p className="text-red-600 text-sm mt-1">Indisponível</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    {item.disponivel && !isRestaurantUser && (
                      <div className="flex items-center mr-4">
                        {getItemQuantity(item.id) > 0 && (
                          <>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="bg-gray-200 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center"
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="px-3">
                              {getItemQuantity(item.id)}
                            </span>
                          </>
                        )}
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    )}
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <Image
                        src={
                          item.imagemUrl || "https://via.placeholder.com/150"
                        }
                        alt={item.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))
    )}
  </div>
);
