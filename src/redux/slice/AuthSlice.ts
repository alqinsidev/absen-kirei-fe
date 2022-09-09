import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AbsenService from "../../services/absenService";
import { AppDispatch, RootState } from "../store";

export interface AuthState {
  isLogged: boolean;
  access_token: string;
  user: any | null;
}

export interface LoginCredential {
  username: string;
  password: string;
}

const initialState: AuthState = {
  isLogged: false,
  access_token: "",
  user: null,
};

export const authSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isLogged = true;
      state.access_token = action.payload.access_token.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isLogged = false;
      state.access_token = "";
      state.user = null;
    },
  },
});

export const LoginAsync =
  (payload: LoginCredential) => async (dispatch: AppDispatch) => {
    try {
      const res = await AbsenService.login(payload);
      const data = res.data.data;

      dispatch(login(data));
    } catch (error) {
      throw error;
    }
  };

export const LogoutAsync = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(logout());
  } catch (error) {
    throw error;
  }
};

export const { login, logout } = authSlice.actions;
export const getAuthUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
