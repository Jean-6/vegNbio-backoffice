
import {Location} from './location';
import {DayOfWeek, OpeningHours} from '../models/canteen';


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
  openingHoursMap: Record<string, OpeningHours> ;
  location: Location;
  tags: string[];
  userId: string;
}
