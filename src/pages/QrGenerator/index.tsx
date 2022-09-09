import {
  Alert,
  Box,
  Button,
  Container,
  Skeleton,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hook";
import { LogoutAsync } from "../../redux/slice/AuthSlice";
import AbsenService from "../../services/absenService";

let QRGenerator: ReturnType<typeof setInterval>;

const QrGenerator = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeToken, setActiveToken] = useState<string>("");
  const [employee, setEmployee] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const logout = async () => {
    try {
      dispatch(LogoutAsync());
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const getQr = async () => {
    try {
      const res = await AbsenService.getQr();
      const data = res.data.data;
      setHasError(false);
      setActiveToken(data.token.active_token);
      setEmployee(data.token?.user?.full_name || "");
    } catch (error) {
      console.error(error);
      setHasError(true);
      const err = error as AxiosError;
      const data = err.response?.data as any;
      setErrorMessage(data?.message);
    }
  };

  useEffect(() => {
    QRGenerator = setInterval(getQr, 5000);

    return () => clearInterval(QRGenerator);
  }, []);

  const ErrorComponent = () => {
    switch (errorMessage) {
      case "Anda telah melakukan absensi":
        return <Alert>{errorMessage || "Terjadi Kesalahan"}</Alert>;
      default:
        return <Alert severity="error">{errorMessage}</Alert>;
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        height: "100vh",
      }}
    >
      {!hasError && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 1 }}>
            QR PRESENSI
          </Typography>
          <Typography sx={{ marginBottom: 3 }}>
            {moment().format(`DD MMMM YYYY`)}
          </Typography>
          {activeToken !== "" && <QRCode value={activeToken} />}
          {activeToken === "" && (
            <Skeleton variant="rectangular" width={256} height={256} />
          )}
          {employee !== "" ? (
            <Typography variant="body1" sx={{ marginTop: 5 }}>
              {employee.toUpperCase()}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{ fontSize: "1.2rem", marginTop: 5, width: "50%" }}
            />
          )}
          <Button color="error" sx={{ marginTop: 3 }} onClick={logout}>
            Logout
          </Button>
        </Box>
      )}
      {hasError && (
        <Box>
          <ErrorComponent />
        </Box>
      )}
    </Container>
  );
};

export default QrGenerator;
