import {Component, OnInit} from '@angular/core';
import {InputText} from 'primeng/inputtext';
import {Loader} from '../../../_core/layout/loader/loader';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterOutlet} from '@angular/router';
import {finalize, Subject, takeUntil} from 'rxjs';
import {LoginResponse} from '../../../_core/dto/loginResponse';
import {AuthService} from '../../../_core/services/auth-service';
import {AlertService} from '../../../_core/services/alert-service';
import {LoginRequest} from '../../../_core/dto/loginRequest';
import {ERole} from '../../../_core/dto/eRole';
import {AutoFocus} from 'primeng/autofocus';

@Component({
  selector: 'app-signin-component',
  imports: [
    InputText,
    Loader,
    ReactiveFormsModule,
    RouterOutlet,
    AutoFocus
  ],
  templateUrl: './signin-component.html',
  standalone: true,
  styleUrl: './signin-component.css'
})
export class SigninComponent implements OnInit{


  signinForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  loginResponse: LoginResponse | null = null;

  constructor(private formBuilder: FormBuilder,
              protected authService: AuthService,
              private router: Router,
              private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.initSigninForm();
  }

  private initSigninForm(){
    this.signinForm = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl ('', Validators.required),
    });
  }

  onSubmit() {
    this.authService.isLoading = true;

    const loginRequest: LoginRequest = this.signinForm.value;
    this.authService.login(loginRequest).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.authService.isLoading = false;
      })
    ).subscribe({
      next: (res: LoginResponse) => {
        const roles: string[] = (res.roles ?? []).map(r => r.role);

        if (roles.includes(ERole.ADMIN)) {
          this.router.navigateByUrl('/admin-dashboard');
        } else if (roles.includes(ERole.RESTORER)) {
          this.router.navigateByUrl('/restorer-dashboard');
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
