import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import RouteLoading from "../RouteLoading/RouteLoading";

export default function ProtectedRoute({ children }) {
  const authChecked = useSelector((state) => state.user.authChecked);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const location = useLocation();

  if (!authChecked) {
    return <RouteLoading message="인증 상태를 확인하는 중입니다..." />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
