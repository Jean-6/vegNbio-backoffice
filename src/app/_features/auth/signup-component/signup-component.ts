import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../_core/services/auth-service';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AlertService} from '../../../_core/services/alert-service';
import {InputText} from 'primeng/inputtext';
import {Loader} from '../../../_core/layout/loader/loader';
import {AutoFocus} from 'primeng/autofocus';
import {finalize, Subject, takeUntil} from 'rxjs';
import {ERole} from '../../../_core/dto/eRole';
import {LoginResponse} from '../../../_core/dto/auth';

@Component({
  selector: 'app-signup-component',
  imports: [
    InputText,
    Loader,
    ReactiveFormsModule,
    RouterOutlet,
    AutoFocus,
    RouterLink
  ],
  templateUrl: './signup-component.html',
  standalone: true,
  styleUrl: './signup-component.css'
})
export class SignupComponent implements OnInit {

  registerForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private formBuilder: FormBuilder,
              protected authService: AuthService,
              private router: Router,
              private alertService: AlertService) {

  }


  ngOnInit(): void {
    this.initSignupForm();
  }

  initSignupForm(){
    this.registerForm = new FormGroup({
      username: new FormControl('',Validators.required),
      email: new FormControl('',Validators.required),
      password: new FormControl ('', Validators.required),
    });
  }


  onSubmit() {
    this.authService.isLoading = true;

    //const signupRequest: RegisterRequest = this.signupForm.value;
    const registerRequest = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      source: 'web',
      userType: null
    };
    this.authService.registration(registerRequest).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.authService.isLoading = false;
      })
    ).subscribe({
      next: (res: LoginResponse) => {
        const roles: string[] = (res.roles ?? []).map(r => r.role);

        if (roles.includes(ERole.ADMIN)) {
          //this.router.navigateByUrl('/canteen-list');
          //this.router.navigateByUrl('/admin-dashboard');
        } else if (roles.includes(ERole.RESTORER)) {
          this.router.navigateByUrl('/change-status');
          //this.router.navigateByUrl('/restorer-dashboard');
        } else {

          this.router.navigateByUrl('/sign-in');
        }
        this.alertService.success('Authentification réussie');
      },
      error: (err: any) => {
        this.router.navigateByUrl('/sign-in');
        this.alertService.error('login failed');
        console.error(`error when sign in : ${err}`);
      }
    });
  }
}
