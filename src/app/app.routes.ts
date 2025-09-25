import {Routes} from '@angular/router';
import {Signin} from './_features/auth/signin/signin';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    component: Signin
  },
];
