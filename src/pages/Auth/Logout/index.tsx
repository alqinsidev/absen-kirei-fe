import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/hook";
import { LogoutAsync } from "../../../redux/slice/AuthSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const logout = async () => {
    try {
      await dispatch(LogoutAsync());
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    logout();
  }, []);
  return <div>Logout ...</div>;
};

export default Logout;
