import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';
import {Product, ProductFilter} from '../dto/product';
import {AuthService} from './auth-service';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {


  productFilter: ProductFilter = new ProductFilter() ;
  private readonly baseUrl = `${environment.apiUrl}`;
  private readonly productEndpoint =`${this.baseUrl}/api/product`;

  constructor(private http: HttpClient,
              private authService: AuthService) {}


  loadProducts(filter?: ProductFilter): Observable<ResponseWrapper<Product[]>> {

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
    //if (this.authService.isAdmin()) {
      return this.http.get<ResponseWrapper<Product[]>>(`${this.productEndpoint}/`, {params});
    //}
    //return throwError(() => new Error('Accès non autorisé'));
  }

}
