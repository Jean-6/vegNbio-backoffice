import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, shareReplay} from 'rxjs';
import {SelectItem} from '../dto/selectItem';
import {ResponseWrapper} from '../dto/responseWrapper';



export interface SelectCanteen {
  id: string;
  name: string;
}



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
  private cities$?: Observable<SelectItem[]>;
  private menuItemType$?: Observable<SelectItem[]>;
  private menuIngredients$?: Observable<SelectItem[]>;
  private foodTypes$?: Observable<SelectItem[]>;

  private apiCanteenUrl = "http://localhost:8082/api/canteen/";

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

  getCities(): Observable<SelectItem[]> {
    if(!this.cities$){
      this.cities$ = this.http.get<SelectItem[]>('assets/data/cities.json').pipe(
        shareReplay(1)
      );
    }
    return this.cities$;
  }

  getCanteens(): Observable<ResponseWrapper<SelectCanteen[]>> {
    return this.http.get<ResponseWrapper<SelectCanteen[]>>('http://localhost:8082/api/canteen/');
  }

  getOwnCanteensApproved(): Observable<ResponseWrapper<SelectCanteen[]>> {
    return this.http.get<ResponseWrapper<SelectCanteen[]>>('http://localhost:8082/api/canteen/me/approved');
  }

  getMenuItemType(): Observable<SelectItem[]> {
    if(!this.menuItemType$){
      this.menuItemType$ = this.http.get<SelectItem[]>('assets/data/menu-item-types.json').pipe(
        shareReplay(1)
      );
    }
    return this.menuItemType$;
  }


  getIngredientsOfMenu(): Observable<SelectItem[]> {
    if(!this.menuIngredients$){
      this.menuIngredients$ = this.http.get<SelectItem[]>('assets/data/ingredients.json').pipe(
        shareReplay(1)
      );
    }
    return this.menuIngredients$;
  }

  getFoodTypes(): Observable<SelectItem[]> {
    if(!this.foodTypes$){
      this.foodTypes$ = this.http.get<SelectItem[]>('assets/data/food-types.json').pipe(
        shareReplay(1)
      );
    }
    return this.foodTypes$;
  }

}
