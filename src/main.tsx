// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@radix-ui/themes/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/ui/Layout";
import { Theme } from "@radix-ui/themes";
import LandPage from "./pages/LandPage";
import Login from "./pages/Login";
import AuthProvider from "./contexts/AuthProvider";
import { adminRoutes } from "./pages/Routes";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/",
          element: <LandPage />,
        },
        {
          path: "/home",
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    ...adminRoutes,
  ],
  {
    future: {
      v7_skipActionErrorRevalidation: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
    },
  }
);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Theme>
        <RouterProvider router={router} />
      </Theme>
    </AuthProvider>
  </QueryClientProvider>
);
