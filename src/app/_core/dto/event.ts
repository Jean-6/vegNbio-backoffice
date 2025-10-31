import {EventStatus} from './eventStatus';
import {Location} from './location';
import {Approval} from './approval';


export interface Event {
  id: string;
  canteenId: string;
  title: string;
  desc: string;
  type: EventType;
  location: Location;
  startTime: Date;
  endTime: Date;
  date: Date;
  status: EventStatus;
  pictures: string [];
  participantsIds: string[];

  approval: Approval;
  createdAt: Date;
}



export class EventFilter {

  name?: string ;
  canteenName?: string ;
  organizer?: string[] ;
  startDate?: Date ;
  endDate?: Date ;
  seats?: number ;
  type?: string ; //Prive public communautaire
  status?: string ; // A venir , en cours , annulé
}



export enum EventType {
  Degustation = "Degustation",
  Atelier = "Atelier",
  Conference = "Conference",
}


export interface AddEvent{
  canteenId: string;
  title: string;
  desc: string;
  type: EventType;
  startTime: string;
  endTime: string;
  date: string;
  userId: string;
}

