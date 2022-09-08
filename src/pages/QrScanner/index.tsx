import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import AbsenService from "../../services/absenService";
let scanTimer: ReturnType<typeof setTimeout>;

function QrScanner() {
  const qrRef = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.focus();
    }
  }, []);

  useEffect(() => {
    loginHandler();
  }, []);

  const loginHandler = async () => {
    try {
      const res = await AbsenService.loginScanner();
      const accessToken = res.data.data.access_token.token;
      localStorage.setItem("@accessToken", accessToken);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    clearTimeout(scanTimer);
    setToken(e.target.value);
    scanTimer = setTimeout(() => {
      storePresence(e.target.value)
        .then((res) => {
          setUser(res.user.full_name);
          setTimeout(() => setUser(""), 3000);
        })
        .catch((err) => {
          setErrorMessage(err.response.data.message);
          setIsError(true);
        })
        .finally(() => {
          setToken("");
        });
    }, 500);
  };

  const storePresence = async (input: string) => {
    try {
      const res = await AbsenService.storePresence({ token: input });
      return res.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5">ABSENSI KIREI</Typography>
        <input
          type="text"
          ref={qrRef}
          onChange={handleChange}
          value={token}
          style={{ opacity: 0.1 }}
        />
        <small style={{ color: "red" }}>{isError ? errorMessage : null}</small>
        {/* <Typography>{date.toString()}</Typography> */}
        <Typography>{user}</Typography>
      </Box>
    </Container>
  );
}

export default QrScanner;
