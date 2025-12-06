import {Component, OnInit} from '@angular/core';
import {BookingService} from '../../../../_core/services/booking-service';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {NavbarTop} from '../../../../_core/layout/navbar-top/navbar-top';
import {Tag} from 'primeng/tag';
import {CommonModule, DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Loader} from '../../../../_core/layout/loader/loader';
import {AlertService} from '../../../../_core/services/alert-service';
import { BookingView} from '../../../../_core/dto/booking';
import {ResponseWrapper} from '../../../../_core/dto/responseWrapper';
import {AsideMenuComponent} from '../../../../_core/layout/aside-menu-component/aside-menu-component';
import {Chip} from 'primeng/chip';
import {BookingFilter} from '../../../../_core/dto/reservation';



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
    TableModule,
    Loader,
    AsideMenuComponent,
    Tag,
    Chip
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

  activeFilters: { key: keyof BookingFilter; label: string; value: string }[] = [];

  constructor(protected bookingService: BookingService,
              protected alertService: AlertService) {}

  ngOnInit(): void {

    this.resetFilters();
    this.loadBookingType()
    this.loadReservation()
  }

  showDetails(res: any) {

  }


  loadReservation() {
    this.isLoading = true;
    this.filteredReservations = []
    this.bookingService.loadReservations(this.bookingService.filter)
      .subscribe({
        next: (res: ResponseWrapper<BookingView[]>) => {
          this.filteredReservations = res.data;
          this.isLoading = false;
          this.updateActiveFilters()
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



  updateActiveFilters() {
    const f = this.bookingService.filter;
    this.activeFilters = [];

    if (f.name && f.name.trim() !== '') {
      this.activeFilters.push({ key: 'name', label: 'Utilisateur', value: f.name });
    }

    if (f.type && f.type.trim() !== '') {
      const typeLabel = this.typeParams.find(t => t.value === f.type)?.label || f.type;
      this.activeFilters.push({ key: 'type', label: 'Type', value: typeLabel });
    }

    if (f.startDate) {
      this.activeFilters.push({
        key: 'startDate',
        label: 'Date début',
        value: new Date(f.startDate).toLocaleDateString('fr-FR')
      });
    }

    if (f.endDate) {
      this.activeFilters.push({
        key: 'endDate',
        label: 'Date fin',
        value: new Date(f.endDate).toLocaleDateString('fr-FR')
      });
    }
  }
  /*updateActiveFilters() {
    const f = this.bookingService.filter
    this.activeFilters = [];

    if (f.id) {
      this.activeFilters.push({ key: 'id', label: 'Id Réservation', value: f.id });
    }

    if (f.name) {
      this.activeFilters.push({ key: 'name', label: 'Utilisateur', value: f.name });
    }

    if (f.type) {
      const typeLabel = this.typeParams.find(t => t.value === f.type)?.label || f.type;
      this.activeFilters.push({ key: 'type', label: 'Type', value: typeLabel });
    }

    if (f.startDate) {
      this.activeFilters.push({
        key: 'startDate',
        label: 'Date début',
        value: new Date(f.startDate).toLocaleDateString('fr-FR')
      });
    }

    if (f.endDate) {
      this.activeFilters.push({
        key: 'endDate',
        label: 'Date fin',
        value: new Date(f.endDate).toLocaleDateString('fr-FR')
      });
    }

  }*/

  resetFilters(): void {
    this.bookingService.filter = {
      name: '',
      type: '',
      startDate: undefined,
      endDate: undefined
    };
    this.activeFilters = [];
  }

  removeFilter(filterKey: keyof BookingFilter){
    this.bookingService.clearFilter(filterKey);
    this.loadReservation()
  }


  searchBookings(): void {
    const filter = this.bookingService.filter;
    if (filter.startDate && filter.endDate) {
      if (filter.startDate > filter.endDate) {
        this.alertService.warn("La date de début ne peut pas être supérieure à la date de fin.");
        return;
      }
    }

    this.loadReservation();
  }
}
