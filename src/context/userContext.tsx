"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import userService from "@/services/userService";
import { addressService } from "@/services";

export interface Address {
  id: string;
  entityId: string;
  entityType: "user" | "restaurant";
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
  apelido?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  createdAt: string;
  email: string;
  id: string;
  nome: string;
  tipo: string;
  telefone?: string;
}

interface UserContextType {
  user: User | null;
  addresses: Address[];
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  getInitials: () => string;
  refreshUserData: () => Promise<User | undefined>;
  refreshAddresses: () => Promise<Address[] | undefined>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

let userStore: User | null = null;
let userAddressesStore: Address[] = [];
let loadingComplete = false;

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(userStore);
  const [addresses, setAddresses] = useState<Address[]>(userAddressesStore);
  const [isLoading, setIsLoading] = useState(!loadingComplete);
  const router = useRouter();

  const getInitials = useCallback(() => {
    if (!user?.nome) return "UN";

    const nameParts = user.nome.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      const firstInitial = nameParts[0][0] || "";
      const lastInitial = nameParts[nameParts.length - 1][0] || "";
      return (firstInitial + lastInitial).toUpperCase();
    }
  }, [user?.nome]);

  const logout = useCallback(() => {
    Cookies.remove("token", { path: "/" });
    Cookies.remove("userData", { path: "/" });
    userStore = null;
    userAddressesStore = [];
    loadingComplete = false;

    setUser(null);
    setAddresses([]);
    toast.success("Logout realizado com sucesso");
    router.push("/login");
  }, [router]);

  const refreshUserData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const userData = await userService.getUserById(user.id);

      const updatedUser: User = {
        ...userData,
        createdAt: user.createdAt,
      };

      setUser(updatedUser);
      userStore = updatedUser;

      Cookies.set("userData", JSON.stringify(updatedUser), { path: "/" });

      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      toast.error("Falha ao atualizar dados do usuário");
    }
  }, [user?.id]);

  const refreshAddresses = useCallback(async () => {
    if (!user?.id) return;

    try {
      const userAddresses = await addressService.getAddressesByEntity(
        user.id,
        "user"
      );
      setAddresses(userAddresses);
      userAddressesStore = userAddresses;
      return userAddresses;
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      toast.error("Falha ao carregar endereços");
    }
  }, [user?.id]);

  useEffect(() => {
    if (loadingComplete && userStore !== null) {
      setUser(userStore);
      setAddresses(userAddressesStore);
      setIsLoading(false);
      return;
    }

    const getUserFromCookies = async () => {
      try {
        const token = Cookies.get("token");
        const userDataCookie = Cookies.get("userData");

        if (token && userDataCookie) {
          const userData: User = JSON.parse(userDataCookie);
          userStore = userData;
          setUser(userData);

          if (userData.id) {
            try {
              const userAddresses = await addressService.getAddressesByEntity(
                userData.id,
                "user"
              );
              userAddressesStore = userAddresses;
              setAddresses(userAddresses);
            } catch (addressError) {
              console.error("Erro ao carregar endereços:", addressError);
            }
          }
        } else {
          userStore = null;
          userAddressesStore = [];
          setUser(null);
          setAddresses([]);
        }
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
        userStore = null;
        userAddressesStore = [];
        setUser(null);
        setAddresses([]);
      } finally {
        loadingComplete = true;
        setIsLoading(false);
      }
    };

    getUserFromCookies();
  }, []);

  useEffect(() => {
    userStore = user;
  }, [user]);

  useEffect(() => {
    userAddressesStore = addresses;
  }, [addresses]);

  const value = {
    user,
    addresses,
    isLoading,
    isAuthenticated: !!user,
    logout,
    getInitials,
    refreshUserData,
    refreshAddresses,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
