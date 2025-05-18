"use client";

import Link from "next/link";
import {
  FaHome,
  FaUtensils,
  FaShoppingCart,
  FaUser,
  FaStore,
} from "react-icons/fa";

export default function Navbar() {
  const isLoggedIn = true; // Changed to true for demo purposes
  const userType = "restaurant"; // Options: "customer", "restaurant", "admin"

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
            <Link
              href="/restaurantes"
              className="flex items-center gap-1 hover:text-red-200"
            >
              <FaUtensils /> Restaurantes
            </Link>
            <Link
              href="/carrinho"
              className="flex items-center gap-1 hover:text-red-200"
            >
              <FaShoppingCart /> Carrinho
            </Link>

            {isLoggedIn ? (
              <>
                {userType === "restaurant" && (
                  <Link
                    href="/meu-restaurante"
                    className="flex items-center gap-1 hover:text-red-200"
                  >
                    <FaStore /> Meu Restaurante
                  </Link>
                )}
                <Link
                  href="/perfil"
                  className="flex items-center gap-1 hover:text-red-200"
                >
                  <FaUser /> Perfil
                </Link>
              </>
            ) : (
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
