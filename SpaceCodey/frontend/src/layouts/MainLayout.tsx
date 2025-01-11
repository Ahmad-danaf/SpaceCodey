import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../components/NavigationBar/NavigationBar";
import Footer from "../components/Footer/Footer";

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
