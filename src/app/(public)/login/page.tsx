"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"cliente" | "restaurante">("cliente");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await authService.login({
          email,
          senha: password,
        });
        toast.success("Login realizado com sucesso!");
      } else {
        // Registro
        await authService.register({
          nome,
          email,
          senha: password,
          tipo,
        });
        toast.success("Cadastro realizado com sucesso!");
      }

      // Redirecionar para a página inicial
      router.push("/");
    } catch (error) {
      console.error("Erro de autenticação:", error);
      toast.error(
        isLogin
          ? "Falha ao realizar login. Verifique suas credenciais."
          : "Falha ao realizar cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isLogin ? "Entrar na sua conta" : "Criar uma conta"}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="nome" className="block mb-1 font-medium">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required={!isLogin}
              />
            </div>
          )}

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

          {!isLogin && (
            <div>
              <label htmlFor="tipo" className="block mb-1 font-medium">
                Tipo de Conta
              </label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value as "cliente" | "restaurante")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required={!isLogin}
              >
                <option value="cliente">Cliente</option>
                <option value="restaurante">Restaurante</option>
              </select>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
}
