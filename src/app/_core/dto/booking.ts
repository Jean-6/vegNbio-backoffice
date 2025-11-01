
import {UserInfo} from './user';
import {CanteenInfo} from './canteen';


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


export interface BookingView {
  id: string;
  type: 'TABLE' | 'ROOM' | 'EVENT';

  canteenInfo: CanteenInfo;
  userInfo: UserInfo;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  people: number;
  createdAt: string;
}
