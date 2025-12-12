import {Routes} from '@angular/router';
import {ForgotPassword} from './_features/auth/forgot-password/forgot-password';
import {ResetPassword} from './_features/auth/reset-password/reset-password';
import {UserListComponent} from './_features/admin/user/user-list-component/user-list-component';
import {AdminDashboard} from './_features/admin/admin-dashboard/admin-dashboard';
import {adminGuard} from './_core/guards/admin-guard';
import {RestorerDashboard} from './_features/restorer/restorer-dashboard/restorer-dashboard';
import {BookingListComponent} from './_features/shared/booking/booking-list-component/booking-list-component';
import {CanteenListComponent} from './_features/shared/canteen/canteen-list-component/canteen-list-component';
import {EventListComponent} from './_features/shared/event/event-list-component/event-list-component';
import {ProductListComponent} from './_features/admin/product/product-list-component/product-list-component';
import {AddEventComponent} from './_features/shared/event/add-event-component/add-event-component';
import {AddProductComponent} from './_features/admin/product/add-product-component/add-product-component';
import {AddCanteenComponent} from './_features/shared/canteen/add-canteen-component/add-canteen-component';
import {AddMenuComponent} from './_features/shared/menu/add-menu-component/add-menu-component';
import {ListMenuComponent} from './_features/shared/menu/list-menu-component/list-menu-component';
import {SignupComponent} from './_features/auth/signup-component/signup-component';
import {SigninComponent} from './_features/auth/signin-component/signin-component';
import {ReceiptComponent} from './_features/restorer/receipt-component/receipt-component';
import {roleGuard} from './_core/guards/role-guard';
import {StatusComponent} from './_features/restorer/status-component/status-component';
import {StatusChangeList} from './_features/admin/status-change-list/status-change-list';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    component: SigninComponent
  },
  {
    path: 'signup',
    component: SignupComponent
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
    canActivate: [roleGuard],
    children:[]
  },

  {
    path : 'change-status',
    component: ReceiptComponent,
    canActivate: [roleGuard],
  },

  /*ADM*/
  {
    path : 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminGuard],
  },
  {
    path : 'user-list',
    component: UserListComponent,
    canActivate: [adminGuard],
  },

  {
    path : 'booking-list',
    component: BookingListComponent,
    canActivate: [roleGuard],
  },

  {
    path : 'status-change-list',
    component: StatusChangeList,
    canActivate: [roleGuard],
  },
  {
    path : 'status',
    component: StatusComponent,
    canActivate: [roleGuard],
  },

  {
    path : 'canteen-list',
    component: CanteenListComponent,
    canActivate: [roleGuard],
  },
  {
    path : 'event-list',
    component: EventListComponent,
    canActivate: [roleGuard],
  },
  {
    path : 'add-event',
    component: AddEventComponent,
    canActivate: [roleGuard],
  },
  {
    path : 'product-list',
    component: ProductListComponent,
    canActivate: [roleGuard],
  },

  {
    path : 'add-product',
    component: AddProductComponent,
    canActivate: [roleGuard],
  },
  {
    path : 'menu-list',
    component: ListMenuComponent,
    canActivate: [roleGuard],
  },

  {
    path : 'add-menu',
    component: AddMenuComponent,
    canActivate: [roleGuard],
  },
  {
    path : 'canteen-list',
    component: CanteenListComponent,
    canActivate: [roleGuard],
  },

  {
    path : 'add-canteen',
    component: AddCanteenComponent,
    canActivate: [roleGuard],
  },
];
