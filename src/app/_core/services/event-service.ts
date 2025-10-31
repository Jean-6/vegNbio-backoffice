import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AddEvent, Event, EventFilter} from '../dto/event';
import {ResponseWrapper} from '../dto/responseWrapper';
import {AuthService} from './auth-service';
import {environment} from '../../../environments/environment';
import {Approval} from '../dto/approval';


@Injectable({
  providedIn: 'root'
})
export class EventService {


  eventFilter: EventFilter = new EventFilter() ;

  private readonly baseUrl = `${environment.apiUrl}`;
  private readonly eventEndpoint =`${this.baseUrl}/api/event`;

  constructor(private http: HttpClient,
              private authService: AuthService) {}


  getEvents(filter?: EventFilter): Observable<ResponseWrapper<Event[]>> {


    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value ! == undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }


    if (this.authService.isAdmin()) {
      return this.http.get<ResponseWrapper<Event[]>>(`${this.eventEndpoint}/`, {params});
    }

    if (this.authService.isRestorer()) {
      return this.http.get<ResponseWrapper<Event[]>>(`${this.eventEndpoint}/`,  {params});

    }
    return throwError(() => new Error('Accès non autorisé'));
  }

  saveEventWithPictures(event: AddEvent, pictures: File[]): Observable<ResponseWrapper<any>> {
    const formData = new FormData();

    // Add JSON object as Blob
    const jsonBlob = new Blob([JSON.stringify(event)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    // Add files
    pictures.forEach(file => formData.append('pictures', file, file.name));

    // Envoyer le POST
    return this.http.post<ResponseWrapper<any>>(
      `${this.eventEndpoint}/`,
      formData
    );
  }

  delete(id: string): Observable <ResponseWrapper<any>> {
    return this.http.delete<ResponseWrapper<any>>(`${this.eventEndpoint}/delete/${id}`);
  }



  approveOrReject(id: string, request: Approval): Observable <ResponseWrapper<any>> {
    return this.http.put<ResponseWrapper<any>>(`${this.eventEndpoint}/approve/${id}`, request);
  }


}
