
import {Location} from '../dto/location';
import {Approval} from '../dto/approval';

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}



export interface OpeningHours {
  open: string ;
  close: string;
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}



export interface Contact{
  phone: string;
  email: string;
}

export interface Canteen {
  id: string;
  name: string;
  desc : string;
  equipments: string[];
  seats: number;
  meetingRooms: number;
  openingHoursMap: Record<string, OpeningHours> ;
  location: Location;
  contact: Contact ;
  tags: string[];
  menuIds: string[];
  pictures: string[];
  approval: Approval;
  createdAt: Date;
}
