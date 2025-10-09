import {UserInfo} from './userInfo';
import {CanteenInfo} from './canteenInfo';


export interface Booking {

  type:string; // Room , Table or Event
  people: number;
  startTime:Date;
  endTime: Date;
  date: Date;
  userInfo:UserInfo;
  canteenInfo: CanteenInfo;
  createdAt:Date;

}
