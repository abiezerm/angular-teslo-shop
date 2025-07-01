import { User } from "./user.type";

export type AuthResponse = {
  user: User;
  token: string;
}

