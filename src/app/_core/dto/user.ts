import {Role} from './role';
import {Approval} from './approval';


export interface User {
  id: string;
  username: string;
  email: string;
  roles : Role[];
  token: string;
  active: boolean;
  restorerInfo?: RestorerInfo;
  supplierInfo?: SupplierInfo;
  createdAt : Date;
}
export interface RestorerInfo{
  docsUrl?: string[];
  approval: Approval;
  submittedAt : Date;
}

export interface SupplierInfo{
  companyName: string;
  phoneNumber: string;
  docsUrl?: string[];
  approval: Approval;
  submittedAt : Date;
}


export class UserFilter {

  status?: string[] ;
  username?: string;
  email?: string ;
  roles?: string[] ;
}


export interface UserInfo{
  userId: string;
  login:string;
  username:string;
  email:string;
}
