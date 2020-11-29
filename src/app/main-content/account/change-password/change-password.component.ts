import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();

  public changePasswordForm: FormGroup;
  public passwordFormControl: FormControl;
  public passwordConfirmationFormControl: FormControl;

  public user: User;

  private readonly signature = '[CHP.C]';
  private subscriptions = new Subscription();
  private readonly modalId = 'change-password-modal';

  private readonly modalTitle = 'Change password warrning';

  private modalHeader = new Header()
    .setTitle(this.modalTitle)
    .setIcon(Icon.WARNING)
    .setColor(HeaderColor.YELLOW_HEADER);

  private modalContent = new Content([
    'You are about to change your account password.',
    '',
    'Do you want to proceed?',
  ]);

  private closeButton = new Button()
    .setText('Close')
    .setCallback(() => this.closeChangeWarrningDialog())
    .setType(ButtonType.SECONDARY)
    .setPosition(ButtonPosition.LEFT);

  private changePasswordButton = new Button()
    .setText('Change password')
    .setCallback(() => this.handleUpdateCredentials());

  private modalFooter = new Footer()
    .addButton(this.closeButton)
    .addButton(this.changePasswordButton);

  private modalConfig = new ModalConfiguration()
    .setId(this.modalId)
    .setHeader(this.modalHeader)
    .setContent(this.modalContent)
    .setFooter(this.modalFooter);

  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private changeDectorRef: ChangeDetectorRef,
    private modalService: ModalService
  ) {}

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
      this.openSnackBar('Please, fill form with valid data');
    } else {
      this.modalService.openDialog(this.modalConfig);
    }
  }

  private initializeComponent(): void {
    this.createchangePasswordFormControls();
    this.createChangePasswordFormGroup();
    this.subscribeToUserStore();
    this.store.dispatch(UserAction.GET_CREDENTIALS_REQUEST());
  }

  private subscribeToUserStore() {
    this.subscriptions.add(
      this.store.pipe(select('user')).subscribe((user) => {
        this.user = user;
      })
    );
  }

  private handleUpdateCredentials() {
    const password = this.passwordConfirmationFormControl.value;
    const user: User = { ...this.user, password };
    this.store.dispatch(UserAction.PATCH_CREDENTIALS_REQUEST(user));
    this.closeChangeWarrningDialog();
    this.changePasswordForm.reset();
    this.logger.log(
      `${this.signature} dispatching ${UserActionType.PATCH_CREDENTIALS_REQUEST}`
    );
  }

  private isFormValid() {
    return this.changePasswordForm?.valid;
  }

  private createChangePasswordFormGroup() {
    this.changePasswordForm = this.formBuilder.group({
      password: this.passwordFormControl,
      passwordConfirmation: this.passwordConfirmationFormControl,
    });
  }

  private createchangePasswordFormControls() {
    this.createPasswordFormControl();
    this.createPasswordConfirmationFormControl();
  }

  private createPasswordFormControl() {
    this.passwordFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);
  }

  private createPasswordConfirmationFormControl() {
    this.passwordConfirmationFormControl = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);
  }

  private openSnackBar(message: string) {
    this.notificationService.info(message);
  }
}
