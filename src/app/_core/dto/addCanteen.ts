
import {Location} from './location';



export interface OpeningHours {
  openingTime: string;
  closeTime: string;
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

export interface Contact{
  email: string;
  phone: string;
}


export interface AddCanteen{
  name: string;
  contact: Contact;
  desc: string;
  equipments: string[];
  meetingRooms: number;
  openingHoursMap: Map<DayOfWeek, OpeningHours> ;
  location: Location;
  tags: string[];
  userId: string;
}
