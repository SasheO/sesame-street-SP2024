import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Make sure this matches
import "./index.css";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import Auth Provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Wraps entire app to provide auth context */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
