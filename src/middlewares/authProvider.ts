import { useEffect, useState } from "react";

import { createTokenProvider } from "./tokenProvider";
import { useNavigate } from "react-router-dom";

export const createAuthProvider = () => {
  const tokenProvider = createTokenProvider();

  const login = (access_token: string) => {
    tokenProvider.setToken(access_token);
  };

  const logout = () => {
    tokenProvider.setToken(null);
  };

  const useAuth = () => {
    const [isLogged, setIsLogged] = useState(
      !!localStorage.getItem("REACT_TOKEN_AUTH")
    );
    const navigate = useNavigate();

    useEffect(() => {
      const handleStorageChange = () => {
        const token = localStorage.getItem("REACT_TOKEN_AUTH");
        setIsLogged(!!token);
      };
      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

    useEffect(() => {
      if (!isLogged) {
        navigate("/login");
      }
    }, [isLogged]);

    return { isLogged };
  };

  return {
    useAuth,
    login,
    logout,
  };
};

export const { useAuth, login, logout } = createAuthProvider();
