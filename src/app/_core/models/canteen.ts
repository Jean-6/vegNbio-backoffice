/*export enum Status{
  PENDING = 0,
  APPROVED = 1,
  REJECTED = 2,
}*/

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}


export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday
}

export interface OpeningHours {
  open: string | null;
  close: string | null;
}
export interface Location {

  address: string;
  city: string;
  postalCode: string;
  country: string;
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
  openingHoursMap: Map<DayOfWeek, OpeningHours>;//Record<DayOfWeek,OpeningHours>;//Map<DayOfWeek, OpeningHours> ;
  location: Location;
  contact: Contact;
  tags: string[];
  menuIds: string[];
  pictures: string[];
  status: Status;
  rejectionReasons: string;
  createdAt: Date;
}
