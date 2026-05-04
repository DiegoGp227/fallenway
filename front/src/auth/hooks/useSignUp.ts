import { useState, useCallback } from "react";
import { ICreateUserRequest, LoginState } from "../types/auth.types";
import { SignUpService } from "../services/auth.services";
import { useAppStoreActions } from "@/store/hooks";
import { AxiosError } from "axios";

export function useSignUp() {
  const [state, setState] = useState<LoginState>({
    user: null,
    loading: false,
    error: null,
  });

  // Mismo patrón que useLogin: persistimos en el store global para
  // que la sesión sobreviva navegación y recarga de página
  const setAuth = useAppStoreActions((actions) => actions.auth.setAuth);

  const signup = useCallback(async (payload: ICreateUserRequest) => {
    setState({ user: null, loading: true, error: null });
    try {
      const response = await SignUpService(payload);

      setAuth(response);

      setState({ user: response.userInfo, loading: false, error: null });
    } catch (err) {
      const axiosError = err as AxiosError<{ code: string }>;
      setState({
        user: null,
        loading: false,
        error: axiosError.response?.data?.code ?? "UNKNOWN_ERROR",
      });
    }
  }, [setAuth]);

  return { ...state, signup };
}
