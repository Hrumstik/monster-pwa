import { Outlet } from "react-router";
import Sliderbar from "./Slidebar/Slidebar";
import Header from "./Header/Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../middlewares/authProvider";

const Layout = () => {
  const { isLogged } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  return isLogged ? (
    <div className="flex h-screen bg-[#161724]">
      <Sliderbar />
      <div className="flex flex-col w-full overflow-auto">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  ) : null;
};

export default Layout;
