const useAuth = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    localStorage.setItem("isAuthenticated", "false");
  };

  return { isAuthenticated, login, logout };
};

export default useAuth;
