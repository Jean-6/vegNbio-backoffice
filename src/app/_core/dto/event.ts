import {EventType} from '../models/event';
import {Location, Status} from '../models/canteen';
import {Approval} from './approval';
import {EventStatus} from '../models/eventStatus';


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
