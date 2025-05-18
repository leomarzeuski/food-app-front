"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { toast } from "sonner";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tipo, setTipo] = useState<"cliente" | "restaurante">("cliente");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmSenha) {
      toast.error("As senhas não correspondem");
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        nome,
        email,
        senha,
        tipo,
      });

      toast.success("Cadastro realizado com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Criar sua conta</h1>
        <p className="text-gray-600 mt-1">
          Preencha os dados abaixo para se cadastrar
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block mb-1 font-medium">
              Nome completo
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
            <label htmlFor="senha" className="block mb-1 font-medium">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              minLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
          </div>

          <div>
            <label htmlFor="confirmSenha" className="block mb-1 font-medium">
              Confirme sua senha
            </label>
            <input
              type="password"
              id="confirmSenha"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label htmlFor="tipo" className="block mb-1 font-medium">
              Tipo de conta
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value as "cliente" | "restaurante")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="cliente">Cliente</option>
              <option value="restaurante">Restaurante</option>
            </select>
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
            {loading ? "Processando..." : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?
            <Link href="/login" className="text-red-500 ml-1 font-medium">
              Entrar
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
  );
}
