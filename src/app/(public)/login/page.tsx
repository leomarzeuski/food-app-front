"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login({
        email,
        senha: password,
      });
      toast.success("Login realizado com sucesso!");

      router.push("/");
    } catch (error) {
      console.error("Erro de autenticação:", error);
      toast.error("Falha ao realizar login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
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

            <div className="text-right">
              <Link href="/recuperar-senha" className="text-red-500 text-sm">
                Esqueceu sua senha?
              </Link>
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
              {loading ? "Processando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-red-500 font-medium hover:text-red-600"
              >
                Cadastre-se
              </Link>
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
          </div>
        </div>
      </div>
    </div>
  );
}
