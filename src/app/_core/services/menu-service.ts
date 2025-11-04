import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';
import {AddMenuItem, MenuItem, MenuItemFilter} from '../dto/menuItem';
import {AuthService} from './auth-service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  itemMenuFilter: MenuItemFilter ={} ;
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient,
              private authService: AuthService) {}


  saveItemMenuWithPictures( menuItem: AddMenuItem, pictures: File[]): Observable<ResponseWrapper<any>> {
    const formData = new FormData();

    // Add JSON object as Blob
    const jsonBlob = new Blob([JSON.stringify(menuItem)], { type: 'application/json' });
    formData.append('data', jsonBlob);

    // Add files
    pictures.forEach(file => formData.append('pictures', file, file.name));

    // Envoyer le POST
    return this.http.post<ResponseWrapper<any>>(
      `${this.baseUrl}/api/menu/`,
      formData
    );

  }


  getItemsMenu(filter?:MenuItemFilter): Observable<ResponseWrapper<MenuItem[]>> {
    let params = new HttpParams();
    /*if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value ! == undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }*/

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => params = params.append(key, v));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }


    if (this.authService.isAdmin()) {
      return this.http.get<ResponseWrapper<MenuItem[]>>(`${this.baseUrl}/api/menu`, {params});
    }

    if (this.authService.isRestorer()) {
      return this.http.get<ResponseWrapper<MenuItem[]>>(`${this.baseUrl}/api/menu/me`,  {params});

    }
    return throwError(() => new Error('Accès non autorisé'));
  }


}
