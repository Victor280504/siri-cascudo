import ProtectedRoute from "../components/Auth";
import Navbar from "../components/navigation/Navbar";
import Dashboard from "./Admin/Dashboard";
import Profile from "./Profile";

export const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedRoute allowedRole={["ADMIN"]} />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
    ],
  },
];

export const userRoutes = [
  {
    path: "/user",
    element: <ProtectedRoute allowedRole={["USER"]} />,
    children: [
      {
        path: "profile",
        element: (
          <>
            <Navbar />
            <Profile />
          </>
        ),
      },
    ],
  },
];
