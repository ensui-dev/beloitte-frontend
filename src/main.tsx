import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./index.css";

// Side-effect import: registers all landing page modules into the registry.
// This MUST run before any component tries to render modules.
import "@/components/landing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure index.html contains a <div id='root'></div>."
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>
);
