import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth-service';
import {ERole} from '../../dto/eRole';
import {Observable} from 'rxjs';
import {RouterLink} from '@angular/router';


export interface CurrentUser {
  id: string;
  username: string;
  roles: ERole[];
  isActive: boolean;
  isVerified: boolean;
}
@Component({
  selector: 'app-aside-menu-component',
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './aside-menu-component.html',
  standalone: true,
  styleUrl: './aside-menu-component.css'
})

export class AsideMenuComponent implements OnInit{

  isAdmin = false;
  isRestorer = false;
  currentUser$!: Observable<CurrentUser | null>;
  isProfileOnly = false;


  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.isAdmin = user.roles?.includes(ERole.ADMIN);
        this.isRestorer = user.roles?.includes(ERole.RESTORER);
      } else {
        this.isAdmin = false;
        this.isRestorer = false;
      }
    });

    this.isProfileOnly = this.authService.canAccessOnlyProfile();
  }




}
