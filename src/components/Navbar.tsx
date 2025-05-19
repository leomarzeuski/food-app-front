"use client";

import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { FaHome, FaShoppingCart, FaUser, FaStore } from "react-icons/fa";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const isRestaurant = user?.tipo === "restaurante";

  return (
    <nav className="bg-red-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            FoodFácil
          </Link>

          <div className="flex space-x-4 items-center">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-red-200"
            >
              <FaHome /> Início
            </Link>

            {isAuthenticated && (
              <>
                {isRestaurant ? (
                  <Link
                    href="/meu-restaurante"
                    className="flex items-center gap-1 hover:text-red-200"
                  >
                    <FaStore /> Meu Restaurante
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/carrinho"
                      className="flex items-center gap-1 hover:text-red-200 relative"
                    >
                      <FaShoppingCart />
                      <span>Carrinho</span>
                      {itemCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {itemCount > 99 ? "99+" : itemCount}
                        </div>
                      )}
                    </Link>
                    <Link
                      href="/perfil"
                      className="flex items-center gap-1 hover:text-red-200"
                    >
                      <FaUser /> Perfil
                    </Link>
                  </>
                )}
                <Button onClick={logout}>Sair</Button>
              </>
            )}

            {!isAuthenticated && (
              <Link
                href="/login"
                className="bg-white text-red-500 px-3 py-1 rounded font-medium hover:bg-red-100"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
