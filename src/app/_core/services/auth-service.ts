import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from '../dto/loginRequest';
import {LoginResponse} from '../dto/loginResponse';
import {ResponseWrapper} from '../dto/responseWrapper';
import {environment} from '../../../environments/environment';
import {ERole} from '../models/ERole';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private urlLogin_ = "/auth/sign-in";
  private urlRegister_ = "/auth/register";
  private logout_ = "/auth/logout";
  private apiUrlRefreshToken = "/auth/refresh-token";
  isLoading = false;
  private currentUser = new BehaviorSubject<{username: string, roles: ERole[]} | null>(null); //To stock user connected state
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private _httpClient: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if(savedUser){
      this.currentUser.next(JSON.parse(savedUser));
      this.isAuthenticated.next(true);
    }
  }


  getCurrentUser(): Observable<{ username: string, roles: ERole[] } | null>{
    return this.currentUser.asObservable();
  }


  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  setCurrentUser(user : {username: string, roles: any[]}  | null): void{

    if(!user){
      this.currentUser.next(null);
      localStorage.removeItem('currentUser');
      return;
    }

    const mappedRoles: ERole[] = (user.roles || [])
      .map(r => {
        switch (r.role) {
          case 'ADMIN': return ERole.ADMIN;
          case 'CUSTOMER': return ERole.CUSTOMER;
          case 'RESTORER': return ERole.RESTORER;
          case 'SUPPLIER': return ERole.SUPPLIER;
          default: return null;
        }
      })
      .filter((r): r is ERole => r !== null);

    const safeUser = {
      username: user.username,
      roles: mappedRoles
    }
    this.currentUser.next(safeUser);

    // persistance locale (optionnel mais recommandé)
    localStorage.setItem("currentUser", JSON.stringify(safeUser));
  }

  setIsAuthenticated(value: boolean): void {
    this.isAuthenticated.next(value);
  }

  isAdmin(): boolean{
    return this.currentUser.value?.roles.includes(ERole.ADMIN) ?? false ;
  }

  /*getUserRoles(): string[] {
    const user = this.currentUser.value ?? JSON.parse (localStorage.getItem('currentUser') || 'null');
    return user?.roles ?? [];
  }
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }*/


  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this._httpClient.post<ResponseWrapper<LoginResponse>>(`${environment.apiUrl}${this.urlLogin_}`,
      loginRequest,
      {withCredentials: true}).pipe(
      tap((response: ResponseWrapper<LoginResponse>) => {
        if (response.data.accessToken != null) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }

        const roles: ERole[] = (response.data.roles ?? [])
          .map(r => r.role)
          .filter((role): role is ERole => role !== undefined);


        this.setCurrentUser({
          username: response.data.username ?? '' ,
          roles: roles
        })
        this.setIsAuthenticated(true);

      }),
      map(response => response.data),
      catchError(err => {
        console.error(`Error when login : ${err}`)
        this.setIsAuthenticated(false)
        this.setCurrentUser(null);
        return throwError(()=> new Error('Error when login'));

      })
    );
  }

}
