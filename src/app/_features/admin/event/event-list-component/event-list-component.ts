import {Component, OnInit} from '@angular/core';
import {AdminAsideMenu} from '../../../../_core/layout/admin-aside-menu/admin-aside-menu';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {MultiSelect} from 'primeng/multiselect';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {EventService} from '../../../../_core/services/event-service';
import {CanteenService} from '../../../../_core/services/canteen-service';
import {AlertService} from '../../../../_core/services/alert-service';
import {Loader} from '../../../../_core/layout/loader/loader';
import {CommonModule} from '@angular/common';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {Event} from '../../../../_core/dto/event';
import {Canteen, Status} from '../../../../_core/models/canteen';
import {map} from 'rxjs';
import {AutoComplete} from 'primeng/autocomplete';
import {EventStatus} from '../../../../_core/models/eventStatus';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {Image} from 'primeng/image';
import {PrimeTemplate} from 'primeng/api';
import {AutoFocus} from 'primeng/autofocus';
import {ParamService} from '../../../../_core/services/param-service';
import {SelectItem} from '../../../../_core/dto/selectItem';


export interface CanteenOption {
  id: string;
  name: string;
}


@Component({
  selector: 'app-event-list-component',
  imports: [
    CommonModule,
    AdminAsideMenu,
    DatePicker,
    FormsModule,
    InputNumber,
    MultiSelect,
    NavbarTop,
    ReactiveFormsModule,
    Loader,
    AutoComplete,
    Button,
    Dialog,
    Image,
    PrimeTemplate,
    AutoFocus,
  ],
  templateUrl: './event-list-component.html',
  standalone: true,
  styleUrl: './event-list-component.css'
})
export class EventListComponent implements OnInit {


  options: string[] = ['list', 'grid'];
  canteenParams: CanteenOption[] = [];
  eventTypeParams: SelectItem[] = [];
  filteredEventType: SelectItem[] = [];
  statusParams: SelectItem[] = [];
  filteredStatus: SelectItem[] = [];
  events: Event[] = [];
  items: string[] = [];
  selectedEvent: Event | null = null;
  visible: boolean = false;
  isLoading = false;

  constructor(protected eventService: EventService,
              protected canteenService: CanteenService,
              private alertService: AlertService,
              private paramService: ParamService) {
  }

  ngOnInit(): void {
    this.loadEventTypes();
    this.loadApprovalStatuses();
    this.loadCanteenOptions();
    //this.loadEventStatus();
    this.loadEvents()
  }

  loadEvents() {
    this.isLoading = true;
    this.eventService.getEvents()
      .subscribe({
        next: (res: ResponseWrapper<Event[]>) => {
          this.events = res.data;
        },
        error: (err: any) => {
          console.log(`Error http when fetching events : ${err}`);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  loadApprovalStatuses(): void {
    this.paramService.getApprovalStatuses().subscribe({
      next: (options: SelectItem[]) => {
        this.statusParams = options;
        this.filteredStatus = [...options]
      },
      error: (err) => {
        console.error('Error loading event param:', err);
        this.alertService.error(`Error loading event param: ${err}`);
      }
    })
  }


  private loadEventTypes(): void {
    this.paramService.getEventTypes().subscribe({
      next: (options: SelectItem[]) => {
        this.eventTypeParams = options;
        this.filteredEventType = [...options]
      },
      error: (err) => {
        console.error('Error loading event param:', err);
        this.alertService.error(`Error loading event param: ${err}`);
      }
    })

  }

  loadCanteenOptions() {
    this.canteenService.getCanteenSelected().pipe(
      map((res: ResponseWrapper<Canteen[]>) => {
        const seenNames = new Set<string>();
        return res.data
          .map(c => ({id: c.id, name: c.name} as CanteenOption))
          .filter(c => {
            if (seenNames.has(c.name)) return false;
            seenNames.add(c.name);
            return true;
          });
      })
    ).subscribe({
      next: (canteenSelectList: CanteenOption[]) => {
        this.canteenParams = canteenSelectList;
        console.log('Canteen options:', canteenSelectList);
      },
      error: err => {
        console.error('Error loading canteen param:', err);
      }
    });
  }

  /*loadEventOptions() {
    this.eventService.getEventOptions()
      .subscribe({
        next: options => {
          this.eventParams = options;
        },
        error: err => {
          console.error('Error loading event param:', err);
          this.alertService.error(`Error loading event param: ${err}`);
        }
      })
  }*/

  /*loadEventStatus() {
    this.eventService.getEventStatus()
      .subscribe({
        next: options => {
          this.statusParams = options;
        },
        error: err => {
          console.error('Error loading status param:', err);
          this.alertService.error(`Error loading status param: ${err}`);
        }
      })
  }*/

  getStatusFlagClass(event: Event): string {

    switch (event.status) {
      case EventStatus.ONGOING:
        return 'bg-success';
      case EventStatus.UPCOMING:
        return 'bg-primary';
      case EventStatus.FINISHED:
        return 'bg-secondary';
      case EventStatus.CANCELLED:
        return 'bg-danger';
      default:
        return 'bg-light text-dark'
    }
  }


  getApprovalFlagClass(event: Event) {

    if (!event.approval?.status) return 'bg-light text-dark';

    switch (event.approval.status) {
      case Status.PENDING:
        return 'bg-warning text-dark';
      case Status.REJECTED:
        return 'bg-danger';
      case Status.APPROVED:
        return 'bg-success';
      default:
        return 'bg-light text-dark';
    }

  }


  search($event: any) {

  }

  formatEventDate(event: Event): Date {
    return new Date(`${event.date}`)
  }

  showDialog(event: Event) {
    this.selectedEvent = event;
    this.visible = true;
  }

  protected readonly EventStatus = EventStatus;

  rejectEvent(selectedEvent: Event | null) {

  }

  approveEvent(selectedEvent: Event | null) {

  }

  updateApproval(selectedEvent: Event | null, rejected: string) {

  }
}
