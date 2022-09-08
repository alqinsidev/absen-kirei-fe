import { Alert, Box, Container, Typography } from "@mui/material";
import { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import AbsenService from "../../services/absenService";

let QRGenerator: ReturnType<typeof setInterval>;

const QrGenerator = () => {
  const [activeToken, setActiveToken] = useState<string>("");
  const [employee, setEmployee] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const getQr = async () => {
    try {
      const res = await AbsenService.getQr();
      const data = res.data.data;
      setHasError(false);
      setActiveToken(data.token.active_token);
      setEmployee(data.token.user.full_name);
    } catch (error) {
      console.error(error);
      setHasError(true);
      const err = error as AxiosError;
      const data = err.response?.data as any;
      setErrorMessage(data.message);
    }
  };

  useEffect(() => {
    getQr();
    QRGenerator = setInterval(getQr, 3000);

    return () => clearInterval(QRGenerator);
  }, []);

  const ErrorComponent = () => {
    switch (errorMessage) {
      case "Anda telah melakukan absensi":
        return <Alert>{errorMessage}</Alert>;
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
        height: "80vh",
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
          <Typography variant="h4" sx={{ marginBottom: 5 }}>
            QR Absensi
          </Typography>
          {activeToken !== "" && <QRCode value={activeToken} />}
          <Typography variant="body1" sx={{ marginTop: 5 }}>
            {employee}
          </Typography>
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
