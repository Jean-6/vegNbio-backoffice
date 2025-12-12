import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ResponseWrapper} from '../dto/responseWrapper';
import {environment} from '../../../environments/environment';
import {ERole} from '../dto/eRole';
import {RegisterRequest} from '../dto/registerRequest';
import {LoginRequest, LoginResponse} from '../dto/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrlAuth = "/api/auth"
  isLoading = false;
  private currentUser$ = new BehaviorSubject<{id: string, username: string, roles: ERole[],isActive: boolean, isVerified:boolean} | null>(null); //To stock user connected state
  private isAuthenticated$ = new BehaviorSubject<boolean>(false)

  constructor(private _httpClient: HttpClient) {
    const stored = localStorage.getItem('currentUser');
    if(stored){
      const user = JSON.parse(stored);
      user.roles = user.roles?.map((r: any) => r.toString()) ?? [];
      this.currentUser$.next(user);
      this.isAuthenticated$.next(true);
    }
  }


  getCurrentUser(): Observable<{ id: string,username: string, roles: ERole[], isActive: boolean, isVerified: boolean } | null>{
    return this.currentUser$.asObservable();
  }


  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  setCurrentUser(user : {id: string,username: string, roles: any[], isActive: boolean, isVerified: boolean}  | null): void{
    this.currentUser$.next(user);
  }

  setIsAuthenticated(value: boolean): void {
    this.isAuthenticated$.next(value);
  }


  getUserRoles(): string[] {
    const user = this.currentUser$.value ?? JSON.parse (localStorage.getItem('currentUser') || 'null');
    return user?.roles ?? [];
  }
  getAccessToken(): string | null {
    return localStorage.getItem("token");
  }
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  getUserId(): string {
    const user = this.currentUser$.value ?? JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user?.id ? user.id.toString() : '';
  }


  getSupplierStatus(): string | null {
    const user = this.currentUser$.getValue() ?? JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user?.supplierInfo?.approval?.status ?? null;
  }

  canAccessOnlyProfile(): boolean {
    const status = this.getSupplierStatus();
    return status === 'PENDING' || status === 'REJECTED';
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {

    return this._httpClient.post<ResponseWrapper<LoginResponse>>(
      `${environment.apiUrl}${this.apiUrlAuth}/sign-in`,
      loginRequest,
      {withCredentials: true}
    ).pipe(
      tap((response: ResponseWrapper<LoginResponse>) => {
        console.log("response : "+ response.data.token)
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        const roles: ERole[] = (response.data.roles ?? [])
          .map(r => r.role)
          .filter((role) => !!role );

        const user = {
          id: response.data.id?.toString() ?? '' ,
          username: response.data.username ?? '',
          roles: roles,
          isActive: response.data.isActive,
          isVerified: response.data.isVerified
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

  registration(registerRequest: RegisterRequest): Observable<LoginResponse> {
    return this._httpClient.post<ResponseWrapper<LoginResponse>>(
      `${environment.apiUrl}${this.apiUrlAuth}/signup`,
      registerRequest,
      {withCredentials: true}
    ).pipe(
      tap((response: ResponseWrapper<LoginResponse>) => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        const roles: ERole[] = (response.data.roles ?? [])
          .map(r => r.role)
          .filter((role) => !!role );

        const user = {
          id: response.data.id?.toString() ?? '' ,
          username: response.data.username ?? '',
          roles: roles,
          isActive: response.data.isActive,
          isVerified: response.data.isVerified
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

  logout(): Observable<void> {
    this.isLoading = true;

    // Appel optionnel au backend pour invalider le refresh token
    const refreshToken = this.getRefreshToken();
    let logoutRequest$: Observable<any> = of(null); // fallback si pas de backend

    if (refreshToken) {
      logoutRequest$ = this._httpClient.post<void>(
        `${environment.apiUrl}${this.apiUrlAuth}/sign-out`,
        { refreshToken },
        { withCredentials: true }
      );
    }

    return logoutRequest$.pipe(
      tap(() => {
        // Nettoyage côté front
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');

        this.setCurrentUser(null);
        this.setIsAuthenticated(false);
        this.isLoading = false;
      }),
      catchError(err => {
        console.error('Erreur lors de la déconnexion', err);
        // Même en cas d’erreur côté backend, on nettoie quand même
        localStorage.clear()
        this.setCurrentUser(null);
        this.setIsAuthenticated(false);
        this.isLoading = false;
        return throwError(() => new Error('Erreur lors de la déconnexion'));
      })
    );
  }


  // Méthodes helpers
  isAdmin(): boolean {
    const user = this.currentUser$.getValue();
    return user?.roles.includes(ERole.ADMIN) ?? false;
  }

  isRestorer(): boolean {
    const user = this.currentUser$.getValue();
    return user?.roles.includes(ERole.RESTORER) ?? false;
  }

  canAccessMenu(): boolean {
    const user = this.currentUser$.getValue();
    if (!user) return false;
    return this.isAdmin() || (this.isRestorer() && user.isVerified);
  }
}
