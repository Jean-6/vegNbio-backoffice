import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth-service';
import {inject} from '@angular/core';
import {map, take} from 'rxjs';

export const roleGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {

      if(!user){
        router.navigate(['/sign-in']);
        return false;
      }
      return true;
    })
  );
};
