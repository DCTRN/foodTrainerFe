import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Sex } from '@core/stores/user/user-details.model';
import { select, Store } from '@ngrx/store';
import {
  registerRequest,
  UserAction,
  UserActionType,
} from '@stores/user/user.actions';
import { User } from '@stores/user/user.model';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { MatSelectData } from '@itf/mat-select-data.model';
import { UserFromForm } from '@itf/user-utility-types.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();
  public minDate: Date;

  public sex: Array<MatSelectData<Sex, string>> = [
    {
      value: Sex.MALE,
      viewValue: 'Male',
    },
    {
      value: Sex.FEMALE,
      viewValue: 'Female',
    },
  ];

  public registerForm: FormGroup;
  public usernameFormControl: FormControl;
  public passwordFormControl: FormControl;
  public passwordConfirmationFormControl: FormControl;
  public emailFormControl: FormControl;
  public birthDateFormControl: FormControl;
  public phoneNumberFormControl: FormControl;
  public firstNameFormControl: FormControl;
  public lastNameFormControl: FormControl;

  public ageFormControl: FormControl;
  public heightFormControl: FormControl;
  public weightFormControl: FormControl;
  public sexFormControl: FormControl;

  public user: User;

  private readonly signature = '[R.C]';
  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private changeDectorRef: ChangeDetectorRef
  ) {
    this.setMinimalDateInDatePicker();
  }

  public ngOnInit(): void {
    this.createRegisterFormControls();
    this.createRegisterFormGroup();
    this.getLastUserState();
    this.subscribeToFormChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public register(): void {
    if (!this.isRegisterFormValid()) {
      this.openSnackBar('Please, fill form with valid data');
    } else {
      this.handleRegister();
    }
  }

  public navigateToMainPage(): void {
    this.router.navigateByUrl('/landing-page');
  }

  private setMinimalDateInDatePicker() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
  }

  private getLastUserState() {
    this.store.pipe(select('user'), take(1)).subscribe((u: User) => {
      this.setCurrentValueInForms(u);
      this.updateFormValidity();
      this.updateView();
    });
  }

  private updateFormValidity(): void {
    const controls = Object.keys(this.registerForm.controls);
    for (const control of controls) {
      if (!this.registerForm.controls[control].value) {
        continue;
      }
      this.registerForm.controls[control].markAsDirty();
      this.registerForm.controls[control].updateValueAndValidity();
    }
  }

  private updateView() {
    this.registerForm.markAsDirty();
    this.registerForm.updateValueAndValidity();

    this.changeDectorRef.detectChanges();
    this.changeDectorRef.markForCheck();
  }

  private subscribeToFormChanges() {
    this.subscriptions.add(
      this.registerForm.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => this.updateUserStoreState())
    );
  }

  private updateUserStoreState() {
    // TODO change UserFromForm to User
    const user: UserFromForm = this.extractUserDataFromForms();
    this.store.dispatch(UserAction.USER_UPDATE(user));
  }

  private setCurrentValueInForms(u: User) {
    this.user = u;
    this.usernameFormControl?.setValue(this.user.username);
    this.emailFormControl?.setValue(this.user.email);
    this.phoneNumberFormControl?.setValue(this.user.phoneNumber);
    this.firstNameFormControl?.setValue(this.user.firstName);
    this.lastNameFormControl?.setValue(this.user.lastName);
    this.birthDateFormControl?.setValue(this.user.birthDate);
    this.ageFormControl?.setValue(this.user?.details.age);
    this.heightFormControl?.setValue(this.user?.details.height);
    this.weightFormControl?.setValue(this.user?.details.weight);
    this.sexFormControl?.setValue(this.user?.details.sex);
  }

  private handleRegister() {
    // TODO change UserFromForm to User
    const user: UserFromForm = this.extractUserDataFromForms();
    this.store.dispatch(registerRequest(user as User));
    this.logger.log(
      `${this.signature} dispatching ${UserActionType.REGISTER_REQUEST}`
    );
  }

  private extractUserDataFromForms(): UserFromForm {
    return {
      username: this.usernameFormControl.value,
      password: this.passwordFormControl.value,
      email: this.emailFormControl.value,
      birthDate: this.birthDateFormControl.value,
      phoneNumber: String(this.phoneNumberFormControl.value),
      firstName: this.firstNameFormControl.value,
      lastName: this.lastNameFormControl.value,
      details: {
        age: this.ageFormControl.value,
        height: this.heightFormControl.value,
        weight: this.weightFormControl.value,
        sex: this.sexFormControl.value,
      },
    };
  }

  private isRegisterFormValid() {
    return this.registerForm?.valid;
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
      age: this.ageFormControl,
      height: this.heightFormControl,
      weight: this.weightFormControl,
      sex: this.sexFormControl,
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
    this.createAgeFormControl();
    this.createHeightFormControl();
    this.createWeightFormControl();
    this.createSexFormControl();
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

  private createAgeFormControl() {
    this.ageFormControl = new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]);
  }

  private createHeightFormControl() {
    this.heightFormControl = new FormControl('', [
      Validators.required,
      Validators.min(50),
      Validators.max(250),
    ]);
  }

  private createWeightFormControl() {
    this.weightFormControl = new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(250),
    ]);
  }

  private createSexFormControl() {
    this.sexFormControl = new FormControl('', [Validators.required]);
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

  private openSnackBar(message: string) {
    this.notificationService.info(message);
  }
}
