import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ Import React Query core
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ (Optional but recommended) React Query Devtools
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ✅ Create a single QueryClient instance for your entire app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // don't auto-refetch when switching tabs
      retry: 1, // retry failed requests once
      staleTime: 1000 * 60 * 5, // 5 minutes cache time
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* React Query Provider wraps the whole app */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* Optional devtools for debugging (only show in development) */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);