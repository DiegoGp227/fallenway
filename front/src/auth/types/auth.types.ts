export interface ICredentials {
  email: string;
  password: string;
}

export interface ICreateUserRequest {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface IUserInfo {
  id: number;
  name: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthResponse {
  message: string;
  token: string;
  userInfo: IUserInfo;
}

export interface LoginState {
  user: IUserInfo | null;
  loading: boolean;
  error: string | null;
}
