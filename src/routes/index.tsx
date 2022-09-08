import Login from "../pages/Auth/Login";
import { Route, Routes, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import QrGenerator from "../pages/QrGenerator";
import QrScanner from "../pages/QrScanner";

interface PageRoute {
  path: string;
  element: any;
}
const routes: PageRoute[] = [
  { path: "/", element: <Login /> },
  { path: "/generate", element: <QrGenerator /> },
  { path: "/scanner", element: <QrScanner /> },
];

const MainRoutes: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const userString = localStorage.getItem("@userInfo") || "";
    const user = userString !== "" ? JSON.parse(userString) : null;
    if (user && user.role_id === 1) {
      navigate("/generate", { replace: true });
    } else if (user && user.role_id === 0) {
      navigate("/scanner", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, []);
  return (
    <Routes>
      {routes.map((route: PageRoute) => (
        <Route
          key={`k-${route.path}`}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
};
export default MainRoutes;
