import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';
import {ReservationType} from '../../_features/shared/booking/booking-list-component/booking-list-component';
import { BookingView} from '../dto/booking';
import {AuthService} from './auth-service';
import {environment} from '../../../environments/environment';
import {BookingFilter} from '../dto/reservation';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  filter: BookingFilter = new BookingFilter() ;
  private readonly baseUrl = `${environment.apiUrl}`;
  private readonly bookingEndpoint =`${this.baseUrl}/api/booking`;

  constructor(private http: HttpClient,
              private authService: AuthService) {}


  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }


  loadReservations(filter?: BookingFilter ): Observable<ResponseWrapper<BookingView[]>> {

    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {

          if (key === 'startDate' && value instanceof Date) {
            params = params.set(key, this.formatDate(value));
          } else if (key === 'endDate' && value instanceof Date) {
            params = params.set(key, this.formatDate(value));
          }
          else if (Array.isArray(value)) {
            value.forEach(v => {
              params = params.append(key, v);
            });
          }
          else {
            params = params.set(key, value.toString());
          }
        }
      });
    }


    if (this.authService.isAdmin()) {
      return this.http.get<ResponseWrapper<BookingView[]>>(`${this.bookingEndpoint}/`, {params});
    }

    if (this.authService.isRestorer()) {
      return this.http.get<ResponseWrapper<BookingView[]>>(`${this.bookingEndpoint}/restorer`,  {params});

    }
    return throwError(() => new Error('Accès non autorisé'));
  }


  getReservationType(): Observable<ReservationType[]> {
    return this.http.get<ReservationType[]>('assets/data/reservation-types.json');
  }


  clearFilter(field: keyof BookingFilter){
    if(Array.isArray(this.filter[field])) {
      (this.filter[field] as any[]) = [];
    } else{
      this.filter[field] = undefined;
    }
  }

}
