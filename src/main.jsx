import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";   // Bootstrap base
import "./styles/global.css";                    // your overrides (optional)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
         <AuthProvider>
       <App />
     </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);