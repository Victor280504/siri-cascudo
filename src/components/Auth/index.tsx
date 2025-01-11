import { PropsWithChildren } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren & {
  allowedRole?: string[];
};

const ProtectedRoute = ({ allowedRole }: ProtectedRouteProps) => {
  const { currentUser, loading } = useAuth();

  if (loading || currentUser === undefined) {
    return <div>Loading...</div>;
  }
  console.log(currentUser?.roles, allowedRole);
  if (
    !currentUser ||
    (allowedRole &&
      !allowedRole.some((role) => currentUser.roles.includes(role)))
  ) {
    return <Navigate to={"/home"} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
