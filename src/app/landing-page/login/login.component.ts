import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LoginCredentials } from '@api/authentication/login-credentials.model';
import { loginRequest, UserActionType } from '@stores/user/user.actions';
import { User } from '@stores/user/user.model';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();

  public loginForm: FormGroup;
  public usernameFormControl: FormControl;
  public passwordFormControl: FormControl;

  public user$: Observable<User>;

  private readonly signature = '[L.C]';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userStore: Store<{ user: User }>,
    private logger: NGXLogger,
    private snackBar: MatSnackBar
  ) {
    this.userStore.pipe(select('user')).subscribe();
  }

  public ngOnInit(): void {
    this.createLoginFormControls();
    this.createLoginFormGroup();
  }

  public login(): void {
    if (!this.isLoginFormValid()) {
      this.openSnackBar('Please, fill forms with valid data.');
    } else {
      this.handleLogin();
    }
  }

  private handleLogin() {
    const loginCredentials: LoginCredentials = this.extractLoginCredentials();
    this.logger.log(`${this.signature} dispatching ${UserActionType.LOGIN_REQUEST}`);
    this.userStore.dispatch(loginRequest(loginCredentials));
  }

  private extractLoginCredentials(): LoginCredentials {
    return {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
    };
  }

  private isLoginFormValid() {
    return this.loginForm?.valid;
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
    this.createUsernameFormControl();
    this.createPasswordFormControl();
  }

  private createPasswordFormControl() {
    this.passwordFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);
  }

  private createUsernameFormControl() {
    this.usernameFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]);
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }
}
