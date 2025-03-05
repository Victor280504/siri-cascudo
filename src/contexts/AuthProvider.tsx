import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { User } from "../types/User";
import { api } from "../services";
import { Login } from "../types/User";
import { requestConfig } from "../services/config";

type requestError = {
  response: any;
  statusCode: number;
  message: string;
};

type AuthContext = {
  token?: string | null;
  currentUser?: User | null;
  auth: boolean | null;
  loading: boolean;
  error: requestError | null;
  login: (data: Login) => Promise<boolean | undefined>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [auth, setAuth] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<requestError | null>(null);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const localToken = localStorage.getItem("token");

        if (localToken && localToken != "undefined") {
          setToken(localToken);
        } else {
          setToken(null);
          setCurrentUser(null);
        }
      } catch (error) {
        console.log(error);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/profile", requestConfig(false));
      setAuth(true);
      setCurrentUser(response.data);
    } catch (error) {
      setError(error as requestError);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  async function login(data: Login) {
    console.log(data);
    try {
      setLoading(true);
      const response = await api.post(
        "/auth/login",
        data,
        requestConfig(false)
      );
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setAuth(true);
      setError(null);
      return true;
    } catch (error) {
      setAuth(false);
      setError(error as requestError);
      setToken(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setLoading(true);
      const response = await api.get("/auth/logout", requestConfig(false));
      if (response.status === 204) {
        localStorage.removeItem("token");
        setToken(null);
        setAuth(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.log(error);
      setToken(null);
      setAuth(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        fetchCurrentUser,
        login,
        logout,
        auth,
        currentUser,
        token,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
