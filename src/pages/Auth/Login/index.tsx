import { LoadingButton } from "@mui/lab";
import { Alert, Box, Container, TextField, Typography } from "@mui/material";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AbsenService from "../../../services/absenService";

interface LoginCredential {
  username: string;
  password: string;
}

type CustomError = {
  meta: any;
  message: any;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginCredential, setLoginCredential] = useState<LoginCredential>({
    username: "",
    password: "",
  });
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const ErrorToast = () => {
    return (
      <Alert severity="error" onClose={() => setHasError(false)}>
        {errorMessage !== "" ? errorMessage : "Pastikan data valid"}
      </Alert>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCredential({ ...loginCredential, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsFetch(true);
    try {
      const res = await AbsenService.login(loginCredential);
      const accessToken = res.data.data.access_token.token;
      await localStorage.setItem("@accessToken", accessToken);
      const user = res.data.data.user;
      const userInfo = JSON.stringify(user);
      await localStorage.setItem("@userInfo", userInfo);
      if (user.role_id !== 1) {
        navigate("/scanner");
      } else {
        navigate("/generate");
      }
    } catch (error) {
      const err = error as AxiosError;
      const ErrorMessage = err.response?.data as CustomError;
      setErrorMessage(ErrorMessage?.message || "Unkonw error");
      setHasError(true);
    } finally {
      setIsFetch(false);
    }
  };

  const handleKeyboard = async (e: React.KeyboardEvent<HTMLButtonElement>) => {
    try {
      if (e.key === "Enter") {
        await handleSubmit();
      }
    } catch (error) {
      console.error(error);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          KIREI PRESENCE SYSTEM
        </Typography>
        <Box maxWidth="xs">
          {hasError && <ErrorToast />}
          <TextField
            margin="normal"
            label="username"
            name="username"
            fullWidth
            onChange={handleChange}
            value={loginCredential.username}
            disabled={isFetch}
          />
          <TextField
            margin="normal"
            type="password"
            label="password"
            name="password"
            fullWidth
            onChange={handleChange}
            value={loginCredential.password}
            disabled={isFetch}
          />
          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ paddingY: 1.4, marginTop: 2 }}
            onClick={() => handleSubmit()}
            onKeyDown={handleKeyboard}
            loading={isFetch}
          >
            Sign In
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
