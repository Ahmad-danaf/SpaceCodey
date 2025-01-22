import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ActivateAccount from "../pages/ActivateAccount/ActivateAccount";
import ResendVerification from "../pages/ActivateAccount/ResendVerification";
import MainLayout from "../layouts/MainLayout";
import TipsList from "../pages/Tips/TipsList";
import TipDetail from "../pages/Tips/TipDetail";
import ArticlesList from "../pages/Articles/ArticlesList";
import ArticleDetail from "../pages/Articles/ArticleDetail";
import DecisionPage from "../pages/DecisionPage/DecisionPage";
import Weather from "../pages/Weather/Weather";

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
          
          {/* Content Routes */}
          <Route path="/tips-and-articles" element={<DecisionPage />} />
          <Route path="/tips" element={<TipsList />} />
          <Route path="/tips/:id" element={<TipDetail />} />
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />

          {/* Weather Route */}
          <Route path="/weather" element={<Weather />} />
        </Route>

        

        
      </Routes>
  );
};

export default AppRoutes;
