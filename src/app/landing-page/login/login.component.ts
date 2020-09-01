import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleErrorStateMatcher } from 'src/app/utils/simple-error-state-matcher.class';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/stores/user/user.model';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { register, login } from 'src/app/core/stores/user/user.actions';
import { LoginCredentials } from 'src/app/api/authentication/login-credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();

  public loginForm: FormGroup;
  public usernameFormControl: FormControl;
  public passwordFormControl: FormControl;

  public user$: Observable<User>;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userStore: Store<{ user: User }>
  ) {
    this.userStore
      .pipe(select('user'))
      .pipe(tap((user) => console.log(user)))
      .subscribe();
  }

  public ngOnInit(): void {
    this.createLoginFormControls();
    this.createLoginFormGroup();
  }

  public login(): void {
    if (!this.loginForm?.valid) {
      return;
    }
    const loginCredentials: LoginCredentials = {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
    };
    this.userStore.dispatch(login(loginCredentials));
  }

  public navigateToMainPage(): void {
    this.router.navigateByUrl('/landing-page');
  }

  private createLoginFormGroup() {
    this.loginForm = this.formBuilder.group({
      username: this.usernameFormControl,
      password: this.passwordFormControl,
    });
  }

  private createLoginFormControls() {
    this.createusernameFormControl();
    this.createPasswordFormControl();
  }

  private createPasswordFormControl() {
    this.passwordFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);
  }

  private createusernameFormControl() {
    this.usernameFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]);
  }
}
