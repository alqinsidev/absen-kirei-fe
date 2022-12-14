import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Container,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { LoginAsync } from "../../../redux/slice/AuthSlice";

interface LoginCredential {
  username: string;
  password: string;
}

type CustomError = {
  meta: any;
  message: any;
};

const Login: React.FC = () => {
  const AuthState = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
      await dispatch(LoginAsync(loginCredential));
    } catch (error) {
      console.error(error);
      const err = error as AxiosError;
      const ErrorMessage = err.response?.data as CustomError;
      if (err.code === "ERR_NETWORK") {
        setErrorMessage("Tidak dapat terhubung ke server");
      } else {
        setErrorMessage(ErrorMessage?.message || "Unkonw error");
      }
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

  const handleSuccessLogin = () => {
    setHasError(false);
    if (AuthState.user.role_id === 1) {
      navigate("generate", { replace: true });
    } else {
      navigate("scanner", { replace: true });
    }
  };

  // if (AuthState.isLogged && AuthState.user) {
  //   if (AuthState.user.role_id === 1) {
  //     navigate("generate", { replace: true });
  //   } else {
  //     navigate("scanner", { replace: true });
  //   }
  // }

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
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={AuthState.isLogged}
        autoHideDuration={2000}
        onClose={handleSuccessLogin}
      >
        {AuthState.user && (
          <Alert>Berhasil Login - {AuthState.user.full_name}</Alert>
        )}
      </Snackbar>
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
            disabled={AuthState.isLogged}
          >
            Sign In
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
