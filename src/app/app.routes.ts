import {Routes} from '@angular/router';
import {Signin} from './_features/auth/signin/signin';
import {ForgotPassword} from './_features/auth/forgot-password/forgot-password';
import {ResetPassword} from './_features/auth/reset-password/reset-password';
import {UserListComponent} from './_features/admin/user-list-component/user-list-component';
import {AdminDashboard} from './_features/admin/admin-dashboard/admin-dashboard';
import {adminGuard} from './_core/guards/admin-guard';
import {RestorerDashboard} from './_features/restorer/restorer-dashboard/restorer-dashboard';
import {restorerGuard} from './_core/guards/restorer-guard';

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
  {
    path: 'forgot-password',
    component: ForgotPassword
  },
  {
    path: 'reset-password',
    component: ResetPassword
  },

  /*REST*/

  {
    path : 'restorer-dashboard',
    component: RestorerDashboard,
    canActivate: [restorerGuard],
    children:[
      {
        path : 'user-list',
        component: UserListComponent,
      }
    ]
  },

  /*ADM*/
  {
    path : 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminGuard],
    children:[
      {
        path : 'user-list',
        component: UserListComponent,
      }
    ]
  },

];
