import ProtectedRoute from "../components/Auth";
import Dashboard from "./Admin/Dashboard";

export const adminRoutes = [
  {
    path: "/user",
    element: <ProtectedRoute allowedRole={["admin", "user"]} />,
    children: [
      {
        path: "profile",
        element: <div>Perfil</div>,
      },
      {
        path: "profile/:id",
        element: <div>Editar</div>,
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRole={["admin"]} />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
    ],
  },
];
