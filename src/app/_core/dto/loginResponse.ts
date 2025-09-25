import {Role} from '../models/Role';


export interface LoginResponse {
  id?: number;
  username?: string;
  email?: string;
  roles?: Role[];
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
}
