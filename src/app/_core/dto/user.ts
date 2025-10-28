import {Role} from './Role';


export interface User {
  id: string;
  username: string;
  email: string;
  roles : Role[];
  token: string;
  active: boolean;
  isVerified: boolean;
  docs : string[]

}
export class UserFilter {

  status?: string[] ;
  username?: string;
  email?: string ;
  roles?: string[] ;
}



export interface UserInfo{
  login:string;
  username:string;
  email:string;
}
