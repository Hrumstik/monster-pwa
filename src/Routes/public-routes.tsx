import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../middlewares/authProvider";

const PublicRoutes = () => {
  const { isLogged } = useAuth();
  return !isLogged ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoutes;
