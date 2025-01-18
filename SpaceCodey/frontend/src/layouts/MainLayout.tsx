import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import Footer from "../components/Footer/Footer";
import "../styles/global.css";

const MainLayout: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
