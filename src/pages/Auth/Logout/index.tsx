import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.setItem("@userInfo", "");
    localStorage.setItem("@accessToken", "");
    navigate("/", { replace: true });
  };
  useEffect(() => {
    logout();
  }, []);
  return <div>Logout ...</div>;
};

export default Logout;
