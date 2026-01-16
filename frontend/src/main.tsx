import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from './lib/utils'
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);