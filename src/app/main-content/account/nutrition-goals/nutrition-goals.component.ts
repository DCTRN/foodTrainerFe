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
import { Sex, UserDetails } from '@core/stores/user/user-details.model';
import { UserNutritionGoals } from '@core/stores/user/user-nutrition-goals.model';
import { UserAction, UserActionType } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { MatSelectData } from '@itf/mat-select-data.model';
import { select, Store } from '@ngrx/store';
import { SimpleErrorStateMatcher } from '@utils/simple-error-state-matcher.class';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-nutrition-goals',
  templateUrl: './nutrition-goals.component.html',
  styleUrls: ['./nutrition-goals.component.scss'],
})
export class NutritionGoalsComponent implements OnInit, OnDestroy {
  public simpleErrorStateMatcher = new SimpleErrorStateMatcher();

  public updateNutritionGoalsForm: FormGroup;
  public kcalFormControl: FormControl;
  public proteinFormControl: FormControl;
  public carbsFormControl: FormControl;
  public fatsFormControl: FormControl;

  public user: User;
  public disabled = true;
  public toolTipContent = 'Please, change credentials before applying changes.';
  public toolTipPosition: TooltipPosition = 'above';
  public toolTipDelay = 200;

  public isNutritionsPercentageEqual100 = true;

  private readonly signature = '[R.C]';
  private subscriptions = new Subscription();

  private readonly modalId = 'change-nutrition-goals-modal';
  private readonly modalTitle = 'Update nutrition goals warrning';

  private modalHeader = new Header()
    .setTitle(this.modalTitle)
    .setIcon(Icon.WARNING)
    .setColor(HeaderColor.YELLOW_HEADER);

  private modalContent = new Content([
    'You are about to change your nutrition goals.',
    '',
    'Do you want to proceed?',
  ]);

  private closeButton = new Button()
    .setText('Close')
    .setCallback(() => this.closeChangeWarrningDialog())
    .setType(ButtonType.SECONDARY)
    .setPosition(ButtonPosition.LEFT);

  private updateNutritionGoalsButton = new Button()
    .setText('Update nutrition goals')
    .setCallback(() => this.handleUpdateNutritionGoals());

  private modalFooter = new Footer()
    .addButton(this.closeButton)
    .addButton(this.updateNutritionGoalsButton);

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

  public updateNutritionGoals(): void {
    if (!this.isFormValid()) {
      this.openSnackBar(this.invalidFormMessage);
    } else {
      this.modalService.openDialog(this.modalConfig);
    }
  }

  public isSumOfNutritionsEqual100(): boolean {
    const limit = 100;
    const nutritions = this.extractNutritionGoalsFromForms();
    const sum =
      Number(nutritions.protein) +
      Number(nutritions.carbs) +
      Number(nutritions.fats);
    return sum === limit;
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
      this.updateNutritionGoalsForm.valueChanges.subscribe(
        (nutritionGoalsCurrent: UserNutritionGoals) => {
          this.disabled = true;
          const { nutritionGoals } = this.user as unknown as User & {
            type: string;
          };
          this.isNutritionsPercentageEqual100 =
            this.isSumOfNutritionsEqual100();
          const shouldActivateUpdateButton =
            this.nutritionGoalsValidator(
              nutritionGoals,
              nutritionGoalsCurrent
            ) && this.isNutritionsPercentageEqual100;
          if (shouldActivateUpdateButton) {
            this.disabled = false;
          }
        }
      )
    );
  }

  private nutritionGoalsValidator(
    nutritionGoalsOrigin: UserNutritionGoals,
    nutritionGoalsCurrent: UserNutritionGoals
  ): boolean {
    const { id, ...nutritionGoalsWithoutId } = nutritionGoalsOrigin;
    return Object.keys(nutritionGoalsWithoutId).some((key: string) => {
      const result =
        String(nutritionGoalsWithoutId[key]) !==
        String(nutritionGoalsCurrent[key]);
      if (result) {
      }
      return result;
    });
  }

  private subscribeToUserStore() {
    this.subscriptions.add(
      this.store.pipe(select('user')).subscribe((user) => {
        this.user = user;
        this.updateForm(user);
      })
    );
  }

  private updateForm(u: User): void {
    this.setCurrentValueInForms(u);
    this.updateFormValidity();
    this.updateView();
  }

  private updateFormValidity(): void {
    const controls = Object.keys(this.updateNutritionGoalsForm.controls);
    for (const control of controls) {
      if (!this.updateNutritionGoalsForm.controls[control].value) {
        continue;
      }
      this.updateNutritionGoalsForm.controls[control].markAsDirty();
      this.updateNutritionGoalsForm.controls[control].updateValueAndValidity();
    }
  }

  private updateView() {
    this.updateNutritionGoalsForm.markAsDirty();
    this.updateNutritionGoalsForm.updateValueAndValidity();
    this.changeDectorRef.detectChanges();
    this.changeDectorRef.markForCheck();
  }

  private setCurrentValueInForms(u: User) {
    this.user = u;
    this.kcalFormControl?.setValue(this.user?.nutritionGoals.kcal);
    this.proteinFormControl?.setValue(this.user?.nutritionGoals.protein);
    this.carbsFormControl?.setValue(this.user?.nutritionGoals.carbs);
    this.fatsFormControl?.setValue(this.user?.nutritionGoals.fats);
  }

  private handleUpdateNutritionGoals() {
    const nutritionGoals: UserNutritionGoals =
      this.extractNutritionGoalsFromForms();
    this.store.dispatch(
      UserAction.PATCH_CREDENTIALS_REQUEST({
        ...this.user,
        nutritionGoals: { ...this.user.nutritionGoals, ...nutritionGoals },
      })
    );
    this.closeChangeWarrningDialog();
    this.logger.log(
      `${this.signature} dispatching ${UserActionType.PATCH_CREDENTIALS_REQUEST}`
    );
  }

  private extractNutritionGoalsFromForms(): UserNutritionGoals {
    return {
      kcal: this.kcalFormControl.value,
      protein: this.proteinFormControl.value,
      carbs: this.carbsFormControl.value,
      fats: this.fatsFormControl.value,
    };
  }

  public isFormValid() {
    return this.updateNutritionGoalsForm?.valid;
  }

  private createUpdateCredentialsFormGroup() {
    this.updateNutritionGoalsForm = this.formBuilder.group({
      kcal: this.kcalFormControl,
      protein: this.proteinFormControl,
      carbs: this.carbsFormControl,
      fats: this.fatsFormControl,
    });
  }

  private createUpdateCredentialsFormControls() {
    this.createKcalFormControl();
    this.createProteinFormControl();
    this.createCarbsFormControl();
    this.createFatsFormControl();
  }

  private createKcalFormControl() {
    this.kcalFormControl = new FormControl('', [
      Validators.required,
      Validators.min(600),
      Validators.max(20000),
    ]);
  }

  private createProteinFormControl() {
    this.proteinFormControl = new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(97),
    ]);
  }

  private createCarbsFormControl() {
    this.carbsFormControl = new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(97),
    ]);
  }

  private createFatsFormControl() {
    this.fatsFormControl = new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(97),
    ]);
  }

  private openSnackBar(message: string) {
    this.notificationService.info(message);
  }
}
