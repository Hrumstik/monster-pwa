import { Outlet } from "react-router";
import Sliderbar from "./Slidebar/Slidebar";
import Header from "./Header/Header";
import { useEffect } from "react";
import useAuth from "../shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? (
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
