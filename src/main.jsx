import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import App from "./App";
import "./styles.css";
import { StudentAuthProvider } from "./contexts/StudentAuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <StudentAuthProvider>
        <App />
      </StudentAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
