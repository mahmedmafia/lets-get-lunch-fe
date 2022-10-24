// src/app/services/auth/user.ts

export interface User {
  username: string;
  password: string;
  dietPreferences?: Array<string>;
}
export interface signupResponse {
  dietPreferences: string[];
  _id: string;
  username: string;
  password: string;
  __v: number;
}
export interface loginResponse{
  token:string;
}
