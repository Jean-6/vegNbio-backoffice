import {EventType} from './eventTytpe';


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
