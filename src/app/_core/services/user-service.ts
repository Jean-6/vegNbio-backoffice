import { Injectable } from '@angular/core';
import {HttpClient,  HttpParams} from '@angular/common/http';
import {User, UserFilter} from '../dto/user';
import {Observable, throwError} from 'rxjs';
import {ResponseWrapper} from '../dto/responseWrapper';
import {environment} from '../../../environments/environment';
import {AuthService} from './auth-service';
import {RoleChangeRequest} from '../dto/roleRequest';
import {Role} from '../dto/role';


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



  loadRoleChanges(filter?:UserFilter): Observable<ResponseWrapper<RoleChangeRequest[]>> {

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
      return this.http.get<ResponseWrapper<RoleChangeRequest[]>>(`${this.userEndpoint}/role-change-requests`, {params});
    }

    return throwError(() => new Error('Accès non autorisé'));
  }


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

  submitRoleChangeRequest(requestDto: RoleChangeRequest, documents: File[]): Observable<any> {
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(requestDto)], {type: 'application/json'})
    );

    documents.forEach(file => {
      formData.append('documents', file);
    });

    return this.http.post(`${this.userEndpoint}/become-restorer`, formData);
  }

  approveRoleRequest(request: RoleChangeRequest, adminComment?: string): Observable<RoleChangeRequest> {
    const params = adminComment ? { params: { adminComment } } : {};
    return this.http.put<RoleChangeRequest>(
      `${this.userEndpoint}/${request.userInfo?.userId}/role-requests/approve`,
      {},
      params
    );
  }

}
