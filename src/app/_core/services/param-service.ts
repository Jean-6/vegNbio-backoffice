import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {SelectItem} from '../dto/selectItem';


@Injectable({
  providedIn: 'root'
})


export class ParamService {

  private serviceTypes$?: Observable<SelectItem[]>;
  private eventTypes$?: Observable<SelectItem[]>;
  private productAllergens$?: Observable<SelectItem[]>;
  private productTypes$?: Observable<SelectItem[]>;
  private productCategories$?: Observable<SelectItem[]>;
  private reservationTypes$?: Observable<SelectItem[]>;
  private approvalStatuses$?: Observable<SelectItem[]>;

  constructor(private http: HttpClient) {}

  getServiceTypes(): Observable<SelectItem[]>   {
    if(!this.serviceTypes$){
      this.serviceTypes$ = this.http.get<SelectItem[]>('assets/data/service-types.json').pipe(
        shareReplay(1)
      );
    }
    return this.serviceTypes$;
  }

  getEventTypes(): Observable<SelectItem[]>{
    if(!this.eventTypes$){
      this.eventTypes$ = this.http.get<SelectItem[]>('assets/data/event-types.json').pipe(
        shareReplay(1)
      );
    }
    return this.eventTypes$

  }

  getAllergens(): Observable<SelectItem[]>{
    if(!this.productAllergens$){
      this.productAllergens$ = this.http.get<SelectItem[]>('assets/data/product-allergens.json').pipe(
        shareReplay(1)
      );
    }
    return this.productAllergens$;

  }

  getProductTypes(): Observable<SelectItem[]>{
    if(!this.productTypes$){
      this.productTypes$ = this.http.get<SelectItem[]>('assets/data/product-types.json').pipe(
        shareReplay(1)
      );
    }
    return this.productTypes$;

  }

  getProductCategories(): Observable<SelectItem[]>{
    if(!this.productCategories$){
      this.productCategories$ = this.http.get<SelectItem[]>('assets/data/product-categories.json').pipe(
        shareReplay(1)
      );
    }
    return this.productCategories$;

  }

  getReservationTypes(): Observable<SelectItem[]>{
    if(!this.reservationTypes$){
      this.reservationTypes$ = this.http.get<SelectItem[]>('assets/data/reservation-types.json').pipe(
        shareReplay(1)
      );
    }
    return this.reservationTypes$;

  }

  getApprovalStatuses(): Observable<SelectItem[]> {
    if(!this.approvalStatuses$){
      this.approvalStatuses$ = this.http.get<SelectItem[]>('assets/data/approval-statuses.json').pipe(
        shareReplay(1)
      );
    }
    return this.approvalStatuses$;

  }


}
