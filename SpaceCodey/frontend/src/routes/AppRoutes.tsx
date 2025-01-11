import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import TipsList from "../pages/Tips/TipsList";
import TipDetail from "../pages/Tips/TipDetail";
import ArticlesList from "../pages/Articles/ArticlesList";
import ArticleDetail from "../pages/Articles/ArticleDetail";
import SessionsList from "../pages/Sessions/SessionsList";
import AddSession from "../pages/Sessions/AddSession";
import EditSession from "../pages/Sessions/EditSession";
import Weather from "../pages/Weather/Weather";
import EventsList from "../pages/Events/EventsList";
import EventDetail from "../pages/Events/EventDetail";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Content Routes */}
          <Route path="/tips" element={<TipsList />} />
          <Route path="/tips/:id" element={<TipDetail />} />
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />

          {/* Weather Route */}
          <Route path="/weather" element={<Weather />} />

          {/* NASA Routes */}
          <Route path="/nasa-apod" element={<EventsList />} />
          <Route path="/ISS-tracker" element={<EventDetail />} />

          {/* Events */}
          <Route path="/events" element={<EventsList />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Route>

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/sessions" element={<SessionsList />} />
          <Route path="/sessions/add" element={<AddSession />} />
          <Route path="/sessions/edit/:id" element={<EditSession />} />
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
