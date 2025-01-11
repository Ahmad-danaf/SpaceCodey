import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ActivateAccount from "../pages/ActivateAccount/ActivateAccount";
import ResendVerification from "../pages/ActivateAccount/ResendVerification";
import MainLayout from "../layouts/MainLayout";

const AppRoutes: React.FC = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate/:uidb64/:token" element={<ActivateAccount />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          
          
        </Route>

        

        
      </Routes>
  );
};

export default AppRoutes;
