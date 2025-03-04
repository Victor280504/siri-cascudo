import ProtectedRoute from "../components/Auth";
import Navbar from "../components/navigation/Navbar";
import EditCategory from "./Admin/Category/EditCategory";
import RegisterCategory from "./Admin/Category/RegisterCategory";
import Dashboard from "./Admin/Dashboard";
import RegisterIngredient from "./Admin/Dashboard/components/Stock/RegisterIngredient";
import EditProduct from "./Admin/Products/EditProduct";
import RegisterProduct from "./Admin/Products/RegisterProduct";
import EditRecipe from "./Admin/Recipe/EditRecipe";
import RegisterRecipe from "./Admin/Recipe/RegisterRecipe";
import Profile from "./Profile";

export const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedRoute allowedRole={["ADMIN"]} />,
    children: [
      {
        path: "",
        element: (
          <>
            <Dashboard />,
          </>
        ),
      },
      {
        path: "products",
        element: <Dashboard />,
      },
      {
        path: "recipe",
        element: <Dashboard />,
      },
      {
        path: "stock",
        element: <Dashboard />,
      },
      {
        path: "report",
        element: <Dashboard />,
      },
      {
        path: "delivery",
        element: <Dashboard />,
      },
      {
        path: "products/new",
        element: (
          <>
            <Navbar />
            <RegisterProduct />,
          </>
        ),
      },
      {
        path: "products/:id",
        element: (
          <>
            <Navbar />
            <EditProduct />,
          </>
        ),
      },
      {
        path: "recipes/new/:id",
        element: (
          <>
            <Navbar />
            <RegisterRecipe />,
          </>
        ),
      },
      {
        path: "products/recipe/:id",
        element: (
          <>
            <Navbar />
            <EditRecipe />,
          </>
        ),
      },
      {
        path: "category/new",
        element: (
          <>
            <Navbar />
            <RegisterCategory />,
          </>
        ),
      },
      {
        path: "category/:id",
        element: (
          <>
            <Navbar />
            <EditCategory />,
          </>
        ),
      },
      {
        path: "stock/new",
        element: (
          <>
            <Navbar />
            <RegisterIngredient />,
          </>
        ),
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
