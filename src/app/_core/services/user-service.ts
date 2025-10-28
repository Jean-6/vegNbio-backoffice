import { Injectable } from '@angular/core';
import {HttpClient,  HttpParams} from '@angular/common/http';
import {User, UserFilter} from '../dto/user';
import {Observable, throwError} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth-service';


export interface UploadResponse {
  message: string;
  urls: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  filters: UserFilter = new UserFilter() ;
  private readonly baseUrl = `${environment.apiUrl}`;
  private readonly userEndpoint =`${this.baseUrl}/api/user`;

  constructor(private http: HttpClient,
              private authService: AuthService) {}


  loadUsers(filter?:UserFilter): Observable<ResponseWrapper<User[]>> {

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
      return this.http.get<ResponseWrapper<User[]>>(`${this.userEndpoint}/`, {params});
    }

    return throwError(() => new Error('Accès non autorisé'));
  }


  uploadDocs(userId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {formData.append('files', file);});
    formData.append('userId', userId);
    return this.http.post<UploadResponse>(`${environment.apiUrl}${this.userEndpoint}/restorer/receipt`, formData);
  }

  verifyUser(userId: string): Observable<ResponseWrapper<User>> {
    return this.http.patch<ResponseWrapper<User>>(`${this.userEndpoint}/${userId}/verify`, {});
  }

  toggleActive(userId: string): Observable<ResponseWrapper<User>> {
    return this.http.patch<ResponseWrapper<User>>(`${this.userEndpoint}/${userId}/active`, {});
  }

  clearFilter(field: keyof UserFilter){
    if(Array.isArray(this.filters[field])) {
      (this.filters[field] as any[]) = [];
    } else{
      this.filters[field] = undefined;
    }
  }
}
