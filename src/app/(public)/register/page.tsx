"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import addressService from "@/services/addressService";
import { toast } from "sonner";
import AddressForm from "@/components/AddressForm";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tipo, setTipo] = useState<"cliente" | "restaurante">("cliente");
  const [addressData, setAddressData] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    apelido: "Principal",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNextStep = () => {
    if (!nome || !email || !senha || !confirmSenha || !telefone) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (senha !== confirmSenha) {
      toast.error("As senhas não correspondem");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleAddressChange = (data: typeof addressData) => {
    setAddressData(data);
  };

  const validateAddressData = () => {
    if (
      !addressData.cep ||
      !addressData.rua ||
      !addressData.numero ||
      !addressData.bairro ||
      !addressData.cidade ||
      !addressData.estado
    ) {
      toast.error(
        "Por favor, preencha todos os campos obrigatórios do endereço."
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep === 1) {
      handleNextStep();
      return;
    }

    if (!validateAddressData()) {
      return;
    }

    setLoading(true);

    try {
      const authResponse = await authService.register({
        nome,
        email,
        telefone,
        senha,
        tipo,
      });

      await addressService.createAddress({
        entityId: authResponse.user.id,
        entityType: "user" as "user" | "restaurant",
        apelido: addressData.apelido,
        rua: addressData.rua,
        numero: addressData.numero,
        complemento: addressData.complemento || undefined,
        bairro: addressData.bairro,
        cidade: addressData.cidade,
        estado: addressData.estado,
        cep: addressData.cep,
        principal: true,
      });

      toast.success("Cadastro realizado com sucesso!");
      router.push("/login");
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
          {currentStep === 1
            ? "Preencha seus dados pessoais"
            : "Informe seu endereço"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              1
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div
                className={`h-full ${
                  currentStep >= 2 ? "bg-red-500" : "bg-gray-200"
                }`}
                style={{ width: currentStep >= 2 ? "100%" : "0%" }}
              ></div>
            </div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Informações pessoais</span>
            <span>Endereço</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 ? (
            <>
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
                <label htmlFor="telefone" className="block mb-1 font-medium">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="(00) 00000-0000"
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
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmSenha"
                  className="block mb-1 font-medium"
                >
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
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
              >
                Continuar
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="font-medium text-lg mb-2">Endereço</h3>
                <AddressForm
                  onAddressChange={handleAddressChange}
                  showNickname={true}
                  initialValues={addressData}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 rounded-lg font-medium bg-gray-300 text-gray-800 hover:bg-gray-400"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    loading
                      ? "bg-gray-400 text-white"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {loading ? "Processando..." : "Criar conta"}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-red-500 font-medium">
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
