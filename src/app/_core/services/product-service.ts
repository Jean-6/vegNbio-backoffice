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


  filter: ProductFilter = new ProductFilter() ;
  private readonly baseUrl = `${environment.apiUrl}`;
  private readonly productEndpoint =`${this.baseUrl}/api/product`;

  constructor(private http: HttpClient,
              private authService: AuthService) {}


  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  loadProducts(filter?: ProductFilter): Observable<ResponseWrapper<Product[]>> {



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
    /*if (filter) {
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
    }*/

    if (this.authService.isAdmin()) {
      return this.http.get<ResponseWrapper<Product[]>>(`${this.productEndpoint}/`, {params});
    }

    if (this.authService.isRestorer()) {
      return this.http.get<ResponseWrapper<Product[]>>(`${this.productEndpoint}/approved`,  {params});

    }
    return throwError(() => new Error('Accès non autorisé'));
  }

  approveProduct(selectedProduct: Product) {
    return this.http.put(`${this.productEndpoint}/${selectedProduct.id}/approve`, {});
  }

  rejectProduct(selectedProduct: Product, reason?: string) {
    const params = reason ? { params: { reasons: reason } } : {};
    return this.http.put(`${this.productEndpoint}/${selectedProduct.id}/reject`, {}, params);
  }

}
