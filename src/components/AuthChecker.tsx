import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/AuthSlice";
import Layout from './Layout';
import type { FC } from "react";

interface RequireAuthProps {
  componentTitle?: string;
}

export const RequireAuth: FC<RequireAuthProps> = () => {
  const { isAuthenticated } = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Layout />;
}

export function PublicRoutes() {
  const { isAuthenticated } = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const query = location?.state?.from?.search || "";
  const pathname = location?.state?.from?.pathname || "/dashboard";
  const to = query ? pathname + query : pathname;

  return <Navigate to={to} state={{ from: location }} replace />;
}