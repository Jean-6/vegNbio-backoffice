import {UserInfo} from './user';
import {Status} from './canteen';
import {ERole} from './eRole';



export interface RoleChangeRequest {
  uId?: string;
  desc?: string;
  userInfo?: UserInfo;
  requestedRole?: ERole;
  status?: Status;
  adminComment?: string;
  urlDocs?: string[];
  requestedAt?: string;
}
