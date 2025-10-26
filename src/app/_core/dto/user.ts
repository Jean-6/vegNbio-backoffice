import {Role} from './Role';


export interface User {
  id: number;
  username: string;
  email: string;
  roles : Role[];
  token: string;
  isActive: boolean;
}
export class UserFilter {

  status?: string[] ;
  username?: string ;
  email?: string ;
  role?: string ;
  city?: string[] ;
  //from?: Date ;
  //to?: Date ;
}



export interface UserInfo{
  login:string;
  username:string;
  email:string;
}
