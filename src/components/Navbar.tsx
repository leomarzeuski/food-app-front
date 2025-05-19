"use client";

import { useAuth } from "@/context/authContext";
import { useCart } from "@/context/cartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaShoppingCart,
  FaUser,
  FaStore,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const isRestaurant = user?.tipo === "restaurante";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    router.push("/");
  };

  return (
    <nav className="bg-red-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            FoodFácil
          </Link>

          {isMobile && (
            <button
              onClick={toggleMenu}
              className="text-white text-xl focus:outline-none md:hidden"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}

          {!isMobile && (
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
                  <Button onClick={handleLogout}>Sair</Button>
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
          )}
        </div>

        {isMobile && isMenuOpen && (
          <div className="mt-4 flex flex-col space-y-3 md:hidden transition-all duration-200 ease-in-out">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-red-200 py-2"
              onClick={closeMenu}
            >
              <FaHome /> Início
            </Link>

            {isAuthenticated && (
              <>
                {isRestaurant ? (
                  <Link
                    href="/meu-restaurante"
                    className="flex items-center gap-1 hover:text-red-200 py-2"
                    onClick={closeMenu}
                  >
                    <FaStore /> Meu Restaurante
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/carrinho"
                      className="flex items-center gap-1 hover:text-red-200 relative py-2"
                      onClick={closeMenu}
                    >
                      <FaShoppingCart />
                      <span>Carrinho</span>
                      {itemCount > 0 && (
                        <div className="absolute top-0 ml-16 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {itemCount > 99 ? "99+" : itemCount}
                        </div>
                      )}
                    </Link>
                    <Link
                      href="/perfil"
                      className="flex items-center gap-1 hover:text-red-200 py-2"
                      onClick={closeMenu}
                    >
                      <FaUser /> Perfil
                    </Link>
                  </>
                )}
                <Button onClick={handleLogout} className="w-full">
                  Sair
                </Button>
              </>
            )}

            {!isAuthenticated && (
              <Link
                href="/login"
                className="bg-white text-red-500 px-3 py-2 rounded font-medium hover:bg-red-100 flex justify-center"
                onClick={closeMenu}
              >
                Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
