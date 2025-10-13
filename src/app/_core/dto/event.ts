import {Approval} from './approval';
import {EventStatus} from '../models/eventStatus';
import {EventType} from './eventTytpe';
import {Location} from './location';


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
