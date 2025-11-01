import {Component, OnInit} from '@angular/core';
import {BookingService} from '../../../../_core/services/booking-service';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {Button} from 'primeng/button';
import {Tag} from 'primeng/tag';
import {CommonModule, DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Loader} from '../../../../_core/layout/loader/loader';
import {AlertService} from '../../../../_core/services/alert-service';
import { BookingView} from '../../../../_core/dto/booking';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {Tooltip} from 'primeng/tooltip';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';



export interface ReservationType {
  label: string;
  value: string;
}


@Component({
  selector: 'app-booking-list-component',
  imports: [
    CommonModule,
    DatePicker,
    FormsModule,
    InputText,
    MultiSelect,
    NavbarTop,
    ReactiveFormsModule,
    Button,
    Tag,
    DatePipe,
    TableModule,
    Loader,
    Tooltip,
    AsideMenuComponent
  ],
  templateUrl: './booking-list-component.html',
  standalone: true,
  styleUrl: './booking-list-component.css'
})
export class BookingListComponent implements OnInit{

  statuses: any[] | undefined;
  isLoading : boolean = false;
  filteredReservations: BookingView[] =[] ;
  typeParams: ReservationType[] =[] ;

  constructor(protected bookingService: BookingService,
              protected alertService: AlertService) {}

  ngOnInit(): void {

    this.loadBookingType()
    this.loadReservation()
  }

  showDetails(res: any) {

  }


  loadReservation() {
    this.isLoading = true;
    this.bookingService.loadReservations()
      .subscribe({
        next: (res: ResponseWrapper<BookingView[]>) => {
          this.filteredReservations = res.data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.log(`Error http when fetching bookings : ${err}`);
          this.isLoading = false;
        }
      });
  }

  loadBookingType(){
    this.isLoading = true;
    this.bookingService.getReservationType()
      .subscribe({
        next: options => {
          this.typeParams = options;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading booking type param:', err);
          this.alertService.error(`Error loading booking type param: ${err}`);
        }
      })
  }

  delete(res: any) {

  }
}
