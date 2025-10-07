import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from '../dto/loginRequest';
import {LoginResponse} from '../dto/loginResponse';
import {ResponseWrapper} from '../dto/responseWrapper';
import {environment} from '../../../environments/environment';
import {ERole} from '../models/eRole';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private urlLogin_ = "/auth/sign-in";
  private urlRegister_ = "/auth/register";
  private logout_ = "/auth/logout";
  private apiUrlRefreshToken = "/auth/refresh-token";
  isLoading = false;
  private currentUser$ = new BehaviorSubject<{id: string, username: string, roles: ERole[]} | null>(null); //To stock user connected state
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private _httpClient: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    if(stored){
      const user = JSON.parse(stored);
      user.roles = user.roles?.map((r: any) => r.toString()) ?? [];
      this.currentUser$.next(user);
      this.isAuthenticated$.next(true);
    }
  }


  getCurrentUser(): Observable<{ id: string,username: string, roles: ERole[] } | null>{
    return this.currentUser$.asObservable();
  }


  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  setCurrentUser(user : {id: string,username: string, roles: any[]}  | null): void{
    this.currentUser$.next(user);
  }

  setIsAuthenticated(value: boolean): void {
    this.isAuthenticated$.next(value);
  }

  isAdmin(): boolean{
    return this.currentUser$.value?.roles.includes(ERole.ADMIN) ?? false ;
  }

  getUserRoles(): string[] {
    const user = this.currentUser$.value ?? JSON.parse (localStorage.getItem('currentUser') || 'null');
    return user?.roles ?? [];
  }
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  getUserId(): string {
    const user = this.currentUser$.value ?? JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user?.id ? user.id.toString() : '';
  }


  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this._httpClient.post<ResponseWrapper<LoginResponse>>(
      `${environment.apiUrl}${this.urlLogin_}`,
      loginRequest,
      {withCredentials: true}
    ).pipe(
      tap((response: ResponseWrapper<LoginResponse>) => {
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }

        const roles: ERole[] = (response.data.roles ?? [])
          .map(r => r.role)
          .filter((role) => !!role );

        const user = {
          id: response.data.id?.toString() ?? '' ,
          username: response.data.username ?? '',
          roles: roles
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.setCurrentUser(user);
        this.setIsAuthenticated(true);
      }),
      map(response => response.data),
      catchError(err => {
        console.error(`Error when login : ${err}`);
        this.setIsAuthenticated(false);
        this.setCurrentUser(null);
        return throwError(() => new Error('Error when login'));
      })
    );
  }
}
