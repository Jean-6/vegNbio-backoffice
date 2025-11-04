import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';
import {AddCanteen, Canteen, CanteenFilter} from '../dto/canteen';
import {AuthService} from './auth-service';
import {environment} from '../../../environments/environment';
import {Approval} from '../dto/approval';



@Injectable({
  providedIn: 'root'
})
export class CanteenService {

  filters: CanteenFilter ={} ;
  private readonly baseUrl = `${environment.apiUrl}`;
  private readonly canteenEndpoint =`${this.baseUrl}/api/canteen`;


  constructor(private http: HttpClient,
              private authService: AuthService) {}


  loadCanteens(filter?:CanteenFilter): Observable<ResponseWrapper<Canteen[]>> {

    let params = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => {
              params = params.append(key, v);
            });
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    if (this.authService.isAdmin()) {
      return this.http.get<ResponseWrapper<Canteen[]>>(`${this.baseUrl}/api/canteen/`, {params});
    }

    if (this.authService.isRestorer()) {
      return this.http.get<ResponseWrapper<Canteen[]>>(`${this.baseUrl}/api/canteen/me`,  {params});

    }
    return throwError(() => new Error('Accès non autorisé'));

  }

  saveCanteenWithPictures(canteen: AddCanteen, pictures: File[]): Observable<ResponseWrapper<any>> {
    const formData = new FormData();

    // Add JSON object as Blob
    const jsonBlob = new Blob([JSON.stringify(canteen)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    // Add files
    pictures.forEach(file => formData.append('pictures', file, file.name));

    // Envoyer le POST
    return this.http.post<ResponseWrapper<any>>(
      `${this.canteenEndpoint}/`,
      formData
    );
  }

  getCanteenById(id: string): Observable<ResponseWrapper<Canteen>> {
    return this.http.get<ResponseWrapper<Canteen>>(`${this.canteenEndpoint}/${id}`);
  }

  getCanteenSelected(): Observable<ResponseWrapper<Canteen[]>> {
    return this.http.get<ResponseWrapper<Canteen[]>>(`${this.canteenEndpoint}/`);
  }

  approveOrReject(id: string, request: Approval): Observable <ResponseWrapper<any>> {
    return this.http.put<ResponseWrapper<any>>(`${this.canteenEndpoint}/approve/${id}`, request);
  }


  delete(id: string): Observable <ResponseWrapper<any>> {
    return this.http.delete<ResponseWrapper<any>>(`${this.canteenEndpoint}/delete/${id}`);
  }

  clearFilter(field: keyof CanteenFilter){
    if(Array.isArray(this.filters[field])) {
      (this.filters[field] as any[]) = [];
    } else{
      this.filters[field] = undefined;
    }
  }


}
