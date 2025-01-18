import React from "react";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";
const App: React.FC = () => {
  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;
