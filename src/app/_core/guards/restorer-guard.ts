import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth-service';
import {map, take} from 'rxjs';
import {ERole} from '../models/ERole';

export const restorerGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {
      console.log("Guard 1: user from service =", user);
      if(!user || !user.roles || user.roles.length === 0){
        console.log("Guard 2: trying localStorage fallback");
        const stored = localStorage.getItem('currentUser');
        if(stored){

          const parsed = JSON.parse(stored);
          parsed.role = parsed.roles?.map((r: any) => r.toString()) ?? [];
          user = parsed;
          console.log("Guard 2: restored from localStorage =", user);
          //user = JSON.parse(stored);
        }
      }
      if(user && user.roles.includes(ERole.RESTORER)){
        console.log("Guard 3: access granted");
        return true;
      }else {
        console.log("Guard 4: redirect to sign-in");
        return router.createUrlTree(['/sign-in']);
      }
    })

  )
};
