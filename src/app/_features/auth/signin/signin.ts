import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginRequest} from '../../../_core/dto/loginRequest';
import {finalize, Subject, takeUntil} from 'rxjs';
import {LoginResponse} from '../../../_core/dto/loginResponse';
import {Loader} from '../../../_core/layout/loader/loader';
import {AuthService} from '../../../_core/services/auth-service';
import {AlertService} from '../../../_core/services/alert-service';
import {ERole} from '../../../_core/models/ERole';

@Component({
  selector: 'app-signin',
  imports: [
    RouterOutlet,
    InputText,
    ReactiveFormsModule,
    Loader,

  ],
  providers: [
    AuthService,
  ],
  templateUrl: './signin.html',
  standalone: true,
  styleUrl: './signin.css'
})
export class Signin implements OnInit{

  myForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  loginResponse: LoginResponse | null = null;

  constructor(private formBuilder: FormBuilder,
              protected authService: AuthService,
              private router: Router,
              private alertService: AlertService) {

  }

  ngOnInit(): void {
    this.myForm = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl ('', Validators.required),
    });
  }

  onSubmit() {

    this.authService.isLoading = true;

    console.log(this.myForm.value)
    const loginRequest: LoginRequest = this.myForm.value;
    this.authService.login(loginRequest).pipe(
      takeUntil(this.destroy$),
      finalize(()=>{
        this.authService.isLoading = false;
      })
    ).subscribe({
      next : (res:LoginResponse)=>{
        console.log('sign in result : ', res)
        this.loginResponse = res;
        this.authService.setCurrentUser({
          username: res.username || '',
          roles: (res.roles ?? [] ).map(r => r.role as ERole)
        });
        this.router.navigateByUrl('/dashboard');
        this.alertService.success('sign in successfully');
      },
      error:(err:any)=>{
        this.router.navigateByUrl('/sign-in');
        this.alertService.error('login failed ')
        console.error(`error when sign in : ${err}`)
      }
    })

  }
}
