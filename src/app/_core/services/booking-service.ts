import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';
import {ReservationType} from '../../_features/shared/booking/booking-list-component/booking-list-component';
import { BookingView} from '../dto/booking';
import {AuthService} from './auth-service';
import {environment} from '../../../environments/environment';
import {ReservationFilter} from '../dto/reservation';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  reservationFilter: ReservationFilter = new ReservationFilter() ;
  private readonly baseUrl = `${environment.apiUrl}`;
  private readonly bookingEndpoint =`${this.baseUrl}/api/booking`;

  constructor(private http: HttpClient,
              private authService: AuthService) {}


  loadReservations(filter?: ReservationFilter ): Observable<ResponseWrapper<BookingView[]>> {

    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value ! == undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
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


}
