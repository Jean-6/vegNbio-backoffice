import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth-service';
import {ERole} from '../../models/eRole';

@Component({
  selector: 'app-aside-menu-component',
  imports: [
    NgIf
  ],
  templateUrl: './aside-menu-component.html',
  standalone: true,
  styleUrl: './aside-menu-component.css'
})

export class AsideMenuComponent implements OnInit{

  isAdmin = false;
  isRestorer = false;


  constructor(private authService: AuthService) {
  }

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
  }

}
