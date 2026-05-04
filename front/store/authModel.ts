import { IAuthResponse } from "@/src/auth/types/auth.types";
import { Action, action } from "easy-peasy";

export interface AuthModel {
  user: IAuthResponse | null;
  isAuthenticated: boolean;
  setAuth: Action<AuthModel, IAuthResponse>;
  clearAuth: Action<AuthModel>;
}

const authModel: AuthModel = {
  user: null,
  isAuthenticated: false,

  setAuth: action((state, payload: IAuthResponse) => {
    state.user = payload;
    state.isAuthenticated = true;
    localStorage.setItem("token", payload.token);
  }),

  clearAuth: action((state) => {
    state.user = null;
    state.isAuthenticated = false;
    // Limpiamos el token de localStorage para que el apiClient deje de enviarlo
    localStorage.removeItem("token");
  }),
};

export default authModel;
