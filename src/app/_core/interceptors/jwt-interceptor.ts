import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth-service';
import {Injectable} from '@angular/core';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token =  this.authService.getAccessToken();

    if(token){
      console.log("token :" + token)
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(cloned);
    }
    return next.handle(req);

  }
}
