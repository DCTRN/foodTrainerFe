import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { ErrorFormat } from '@core/models/error-format.model';
import { select, Store } from '@ngrx/store';
import { register, UserActionType } from '@stores/user/user.actions';
import { User } from '@stores/user/user.model';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { NGXLogger } from 'ngx-logger';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();

  public registerForm: FormGroup;
  public usernameFormControl: FormControl;
  public passwordFormControl: FormControl;
  public passwordConfirmationFormControl: FormControl;
  public emailFormControl: FormControl;
  public birthDateFormControl: FormControl;
  public phoneNumberFormControl: FormControl;
  public firstNameFormControl: FormControl;
  public lastNameFormControl: FormControl;

  public user: User;

  private readonly signature = '[R.C]';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userStore: Store<AppState>,
    private logger: NGXLogger,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.createRegisterFormControls();
    this.createRegisterFormGroup();
    this.userStore
      .pipe(
        select('user'),
        filter((u: User) => !!u?.email)
      )
      .subscribe((u: User) => {
        this.user = u;
        this.usernameFormControl?.setValue(this.user.username);
        this.emailFormControl?.setValue(this.user.email);
        this.phoneNumberFormControl?.setValue(this.user.phoneNumber);
        this.firstNameFormControl?.setValue(this.user.firstName);
        this.lastNameFormControl?.setValue(this.user.lastName);
        this.birthDateFormControl?.setValue(this.user.birthDate);
      });
  }

  public register(): void {
    if (!this.registerForm?.valid) {
      this.snackBar.open('Please fill form with valid data.', 'Close', {
        duration: 5000,
      });
      return;
    }
    const user: User = {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
      email: this.emailFormControl.value,
      birthDate: this.birthDateFormControl.value,
      phoneNumber: String(this.phoneNumberFormControl.value),
      firstName: this.firstNameFormControl.value,
      lastName: this.lastNameFormControl.value,
    };
    this.userStore.dispatch(register(user));
    this.logger.log(`${this.signature} dispatching ${UserActionType.REGISTER}`);
  }

  public navigateToMainPage(): void {
    this.router.navigateByUrl('/landing-page');
  }

  private createRegisterFormGroup() {
    this.registerForm = this.formBuilder.group({
      username: this.usernameFormControl,
      password: this.passwordFormControl,
      passwordConfirmation: this.passwordConfirmationFormControl,
      email: this.emailFormControl,
      birthDate: this.birthDateFormControl,
      phoneNumber: this.phoneNumberFormControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
    });
  }

  private createRegisterFormControls() {
    this.createusernameFormControl();
    this.createPasswordFormControl();
    this.createPasswordConfirmationFormControl();
    this.createEmailFormControl();
    this.createBirthDateFormControl();
    this.createPhoneNumberFormControl();
    this.createFirstNameFormControl();
    this.createLastNameFormControl();
  }

  private createLastNameFormControl() {
    this.lastNameFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]);
  }

  private createFirstNameFormControl() {
    this.firstNameFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]);
  }

  private createPhoneNumberFormControl() {
    this.phoneNumberFormControl = new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{9}'),
    ]);
  }

  private createBirthDateFormControl() {
    this.birthDateFormControl = new FormControl('', [Validators.required]);
  }

  private createEmailFormControl() {
    this.emailFormControl = new FormControl('', [
      Validators.required,
      Validators.email,
    ]);
  }

  private createPasswordConfirmationFormControl() {
    this.passwordConfirmationFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);
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
