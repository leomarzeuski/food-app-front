import { useState, useEffect } from "react";

interface AddressFormProps {
  initialValues?: {
    cep?: string;
    rua?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    apelido?: string;
  };
  onAddressChange: (addressData: {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    apelido: string;
  }) => void;
  showNickname?: boolean;
}

export default function AddressForm({
  initialValues = {},
  onAddressChange,
  showNickname = false,
}: AddressFormProps) {
  const [cep, setCep] = useState(initialValues.cep || "");
  const [rua, setRua] = useState(initialValues.rua || "");
  const [numero, setNumero] = useState(initialValues.numero || "");
  const [complemento, setComplemento] = useState(
    initialValues.complemento || ""
  );
  const [bairro, setBairro] = useState(initialValues.bairro || "");
  const [cidade, setCidade] = useState(initialValues.cidade || "");
  const [estado, setEstado] = useState(initialValues.estado || "");
  const [apelido, setApelido] = useState(initialValues.apelido || "");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  // Update form data when initial values change
  useEffect(() => {
    if (initialValues) {
      setCep(initialValues.cep || "");
      setRua(initialValues.rua || "");
      setNumero(initialValues.numero || "");
      setComplemento(initialValues.complemento || "");
      setBairro(initialValues.bairro || "");
      setCidade(initialValues.cidade || "");
      setEstado(initialValues.estado || "");
      setApelido(initialValues.apelido || "");
    }
  }, [initialValues]);

  // Search address by CEP
  const searchAddressByCep = async () => {
    if (cep.length !== 8) {
      setCepError("CEP deve conter 8 dígitos");
      return;
    }

    setLoadingCep(true);
    setCepError("");

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado");
      } else {
        const updatedAddress = {
          cep,
          rua: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
          numero,
          complemento,
          apelido,
        };

        // Set form values
        setRua(updatedAddress.rua);
        setBairro(updatedAddress.bairro);
        setCidade(updatedAddress.cidade);
        setEstado(updatedAddress.estado);

        // Notify parent component
        onAddressChange(updatedAddress);
      }
    } catch (error) {
      setCepError("Erro ao buscar CEP");
      console.error("Error fetching CEP:", error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCep(value);
  };

  const handleCepBlur = () => {
    if (cep.length === 8) {
      searchAddressByCep();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Update local state
    switch (field) {
      case "rua":
        setRua(value);
        break;
      case "numero":
        setNumero(value);
        break;
      case "complemento":
        setComplemento(value);
        break;
      case "bairro":
        setBairro(value);
        break;
      case "cidade":
        setCidade(value);
        break;
      case "estado":
        setEstado(value);
        break;
      case "apelido":
        setApelido(value);
        break;
    }

    // Notify parent component of the change
    const updatedAddress = {
      cep,
      rua: field === "rua" ? value : rua,
      numero: field === "numero" ? value : numero,
      complemento: field === "complemento" ? value : complemento,
      bairro: field === "bairro" ? value : bairro,
      cidade: field === "cidade" ? value : cidade,
      estado: field === "estado" ? value : estado,
      apelido: field === "apelido" ? value : apelido,
    };

    onAddressChange(updatedAddress);
  };

  return (
    <div className="space-y-4">
      {showNickname && (
        <div>
          <label htmlFor="apelido" className="block mb-1 font-medium">
            Apelido do endereço
          </label>
          <input
            type="text"
            id="apelido"
            value={apelido}
            onChange={(e) => handleInputChange("apelido", e.target.value)}
            placeholder="Ex: Casa, Trabalho"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      )}

      <div>
        <label htmlFor="cep" className="block mb-1 font-medium">
          CEP
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="cep"
            value={cep}
            onChange={handleCepChange}
            onBlur={handleCepBlur}
            maxLength={8}
            placeholder="00000000"
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <button
            type="button"
            onClick={searchAddressByCep}
            disabled={loadingCep || cep.length !== 8}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loadingCep ? "..." : "Buscar"}
          </button>
        </div>
        {cepError && <p className="text-red-500 text-sm mt-1">{cepError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="rua" className="block mb-1 font-medium">
            Rua
          </label>
          <input
            type="text"
            id="rua"
            value={rua}
            onChange={(e) => handleInputChange("rua", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="numero" className="block mb-1 font-medium">
            Número
          </label>
          <input
            type="text"
            id="numero"
            value={numero}
            onChange={(e) => handleInputChange("numero", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="complemento" className="block mb-1 font-medium">
            Complemento
          </label>
          <input
            type="text"
            id="complemento"
            value={complemento}
            onChange={(e) => handleInputChange("complemento", e.target.value)}
            placeholder="Apto, Bloco, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label htmlFor="bairro" className="block mb-1 font-medium">
            Bairro
          </label>
          <input
            type="text"
            id="bairro"
            value={bairro}
            onChange={(e) => handleInputChange("bairro", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="cidade" className="block mb-1 font-medium">
            Cidade
          </label>
          <input
            type="text"
            id="cidade"
            value={cidade}
            onChange={(e) => handleInputChange("cidade", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

        <div>
          <label htmlFor="estado" className="block mb-1 font-medium">
            Estado
          </label>
          <input
            type="text"
            id="estado"
            value={estado}
            onChange={(e) => handleInputChange("estado", e.target.value)}
            maxLength={2}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
      </div>
    </div>
  );
}
