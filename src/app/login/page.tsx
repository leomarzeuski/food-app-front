"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulating API call
    setTimeout(() => {
      if (isLogin) {
        // Simulated login
        console.log("Login", { email, password });
        alert("Login realizado com sucesso!");
      } else {
        // Simulated registration
        console.log("Cadastro", { email, password });
        alert("Cadastro realizado com sucesso!");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-block mb-4">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">
          {isLogin ? "Entrar na sua conta" : "Criar uma conta"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <Link href="/recuperar-senha" className="text-red-500 text-sm">
                Esqueceu sua senha?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium ${
              loading
                ? "bg-gray-400 text-white"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {loading ? "Processando..." : isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-500 ml-1 font-medium"
            >
              {isLogin ? "Cadastre-se" : "Entrar"}
            </button>
          </p>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou continue com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              type="button"
              className="py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center font-medium"
            >
              Google
            </button>
            <button
              type="button"
              className="py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center font-medium"
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
