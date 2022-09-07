import Login from "../pages/Auth/Login";
import { Route, Routes } from "react-router-dom";
import React from "react";
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
