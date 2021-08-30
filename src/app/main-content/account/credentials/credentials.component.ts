import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { ModalService } from '@core/modal-service/modal.service';
import { Button } from '@core/modal-service/models/button';
import { ButtonPosition } from '@core/modal-service/models/button-position.enum';
import { ButtonType } from '@core/modal-service/models/button-type.enum';
import { Content } from '@core/modal-service/models/content';
import { Footer } from '@core/modal-service/models/footer';
import { Header } from '@core/modal-service/models/header';
import { HeaderColor } from '@core/modal-service/models/header-color.enum';
import { Icon } from '@core/modal-service/models/icon.enum';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';
import { NotificationService } from '@core/notifications/service/notification.service';
import { UserAction, UserActionType } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { select, Store } from '@ngrx/store';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
})
export class CredentialsComponent implements OnInit, OnDestroy {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();
  public minDate: Date;

  public updateCredentialsForm: FormGroup;
  public usernameFormControl: FormControl;
  public emailFormControl: FormControl;
  public birthDateFormControl: FormControl;
  public phoneNumberFormControl: FormControl;
  public firstNameFormControl: FormControl;
  public lastNameFormControl: FormControl;

  public user: User;
  public disabled = true;
  public toolTipContent = 'Please, change credentials before applying changes.';
  public toolTipPosition: TooltipPosition = 'above';
  public toolTipDelay = 200;

  private readonly signature = '[R.C]';
  private subscriptions = new Subscription();

  private readonly modalId = 'change-credentials-modal';
  private readonly modalTitle = 'Update credentials warrning';

  private modalHeader = new Header()
    .setTitle(this.modalTitle)
    .setIcon(Icon.WARNING)
    .setColor(HeaderColor.YELLOW_HEADER);

  private modalContent = new Content([
    'You are about to change your account credentials.',
    '',
    'Do you want to proceed?',
  ]);

  private closeButton = new Button()
    .setText('Close')
    .setCallback(() => this.closeChangeWarrningDialog())
    .setType(ButtonType.SECONDARY)
    .setPosition(ButtonPosition.LEFT);

  private updateCredentialsButton = new Button()
    .setText('Update credentials')
    .setCallback(() => this.handleUpdateCredentials());

  private modalFooter = new Footer()
    .addButton(this.closeButton)
    .addButton(this.updateCredentialsButton);

  private modalConfig = new ModalConfiguration()
    .setId(this.modalId)
    .setHeader(this.modalHeader)
    .setContent(this.modalContent)
    .setFooter(this.modalFooter);

  private readonly invalidFormMessage = 'Please, fill form with valid data';

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private changeDectorRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private modalService: ModalService
  ) {
    this.setMinimalDateInDatePicker();
  }

  private closeChangeWarrningDialog(): void {
    return this.modalService.closeDialog(this.modalId);
  }

  public ngOnInit(): void {
    this.initializeComponent();
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public updateCredentials(): void {
    if (!this.isFormValid()) {
      this.openSnackBar(this.invalidFormMessage);
    } else {
      this.modalService.openDialog(this.modalConfig);
    }
  }

  private initializeComponent(): void {
    this.createUpdateCredentialsFormControls();
    this.createUpdateCredentialsFormGroup();
    this.subscribeToUserStore();
    this.store.dispatch(UserAction.GET_CREDENTIALS_REQUEST());
    this.subscribeToFormChanges();
  }

  private subscribeToFormChanges(): void {
    this.subscriptions.add(
      this.updateCredentialsForm.valueChanges.subscribe((u: User) =>
        this.formChangesHandler(u)
      )
    );
  }

  private formChangesHandler(u: User): void {
    let changes = false;
    changes = this.objectKeysHandler(changes, u);
    this.updateButtonDisableProperty(changes);
  }

  private objectKeysHandler(changes: boolean, u: User): boolean {
    const keys = Object.keys(u);
    for (const key of keys) {
      if (changes) {
        return changes;
      }
      changes = this.disablingButtonHandler(key, changes, u);
    }
    return changes;
  }

  private disablingButtonHandler(
    value: string,
    changes: boolean,
    u: User
  ): boolean {
    if (!this.shouldUseDateHandler(value)) {
      changes = this.disablingButtonDefaultHandler(changes, u, value);
    } else {
      changes = this.disablingButtonDateHandler(u, value, changes);
    }
    return changes;
  }

  private disablingButtonDefaultHandler(
    changes: boolean,
    u: User,
    value: string
  ): boolean {
    changes = this.setChangesToTruIfValuesDiffer(
      String(u[value]),
      String(this.user[value]),
      changes
    );
    return changes;
  }

  private disablingButtonDateHandler(
    u: User,
    value: string,
    changes: boolean
  ): boolean {
    const curr = this.transformToValidDateFormat(u[value]);
    const origin = this.transformToValidDateFormat(this.user[value]);
    changes = this.setChangesToTruIfValuesDiffer(curr, origin, changes);
    return changes;
  }

  private setChangesToTruIfValuesDiffer(
    curr: string,
    origin: string,
    changes: boolean
  ): boolean {
    if (curr === origin) {
      return;
    }
    changes = true;
    return changes;
  }

  private transformToValidDateFormat(date: string): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  private shouldUseDateHandler(value: string): boolean {
    return value === 'birthDate';
  }

  private updateButtonDisableProperty(changes: boolean): void {
    if (changes) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  private subscribeToUserStore() {
    this.subscriptions.add(
      this.store.pipe(select('user')).subscribe((user) => {
        this.user = user;
        this.updateForm(user);
      })
    );
  }

  private setMinimalDateInDatePicker() {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
  }

  private updateForm(u: User): void {
    this.setCurrentValueInForms(u);
    this.updateFormValidity();
    this.updateView();
  }

  private updateFormValidity(): void {
    const controls = Object.keys(this.updateCredentialsForm.controls);
    for (const control of controls) {
      if (!this.updateCredentialsForm.controls[control].value) {
        continue;
      }
      this.updateCredentialsForm.controls[control].markAsDirty();
      this.updateCredentialsForm.controls[control].updateValueAndValidity();
    }
  }

  private updateView() {
    this.updateCredentialsForm.markAsDirty();
    this.updateCredentialsForm.updateValueAndValidity();
    this.changeDectorRef.detectChanges();
    this.changeDectorRef.markForCheck();
  }

  private setCurrentValueInForms(u: User) {
    this.user = u;
    this.usernameFormControl?.setValue(this.user.username);
    this.emailFormControl?.setValue(this.user.email);
    this.phoneNumberFormControl?.setValue(this.user.phoneNumber);
    this.firstNameFormControl?.setValue(this.user.firstName);
    this.lastNameFormControl?.setValue(this.user.lastName);
    this.birthDateFormControl?.setValue(this.user.birthDate);
  }

  private handleUpdateCredentials() {
    // TODO change Partial<User> to User
    const user: Partial<User> = this.extractUserDataFromForms();
    user.id = this.user.id;
    this.store.dispatch(UserAction.PATCH_CREDENTIALS_REQUEST(user as User));
    this.closeChangeWarrningDialog();
    this.logger.log(
      `${this.signature} dispatching ${UserActionType.PATCH_CREDENTIALS_REQUEST}`
    );
  }

  private extractUserDataFromForms(): Partial<User> {
    return {
      username: this.usernameFormControl.value,
      email: this.emailFormControl.value,
      birthDate: this.birthDateFormControl.value,
      phoneNumber: String(this.phoneNumberFormControl.value),
      firstName: this.firstNameFormControl.value,
      lastName: this.lastNameFormControl.value,
    };
  }

  private isFormValid() {
    return this.updateCredentialsForm?.valid;
  }

  private createUpdateCredentialsFormGroup() {
    this.updateCredentialsForm = this.formBuilder.group({
      username: this.usernameFormControl,
      email: this.emailFormControl,
      birthDate: this.birthDateFormControl,
      phoneNumber: this.phoneNumberFormControl,
      firstName: this.firstNameFormControl,
      lastName: this.lastNameFormControl,
    });
  }

  private createUpdateCredentialsFormControls() {
    this.createusernameFormControl();
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
