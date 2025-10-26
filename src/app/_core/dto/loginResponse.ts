import {Role} from './Role';


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
