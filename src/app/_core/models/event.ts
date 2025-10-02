import {Location} from './canteen';

export enum EventType {
  Degustation = "Degustation",
  Atelier = "Atelier",
  Conference = "Conference",
}

export interface Event {
  id: string ;
  canteenId: string;
  title: string;
  desc: string;
  type: EventType;
  location: Location;
  startTime: Date;
  endTime: Date;
  date: Date;
  pictures: string[];
  participantsIds: string[];
  createdAt: Date;
}
