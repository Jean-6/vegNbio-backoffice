
import {Role} from './role';


export interface LoginRequest {
  username?: string;
  password?: string;
}



export interface LoginResponse {
  id?: number;
  username?: string;
  email?: string;
  roles?: Role[];
  token?: string;
  refreshToken?: string;
  isActive : boolean;
  isVerified:boolean;
  tokenType?: string;
}
