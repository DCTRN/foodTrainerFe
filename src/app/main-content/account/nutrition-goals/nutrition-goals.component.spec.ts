import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalService } from '@core/modal-service/modal.service';
import { ModalConfiguration } from '@core/modal-service/models/modal-configuration';
import { NotificationService } from '@core/notifications/service/notification.service';
import { User } from '@core/stores/user/user.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { user1, user1NutritionGoals } from '@testsUT/user/user-mock-data.model';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { ReplaySubject } from 'rxjs';
import { NutritionGoalsComponent } from './nutrition-goals.component';

const userInitial: User = user1;
export const initialState: any = {
  user: userInitial,
};

class NotificationServiceMock {
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
  public warrning(message: string, duration: number = 5000): void {}
  public info(message: string, duration: number = 5000): void {}
}

export class ModalServiceMock {
  public openDialog(modalConfiguration: ModalConfiguration): void {}
  public closeDialog(modalId: string): void {}
  public getDialogs(): ModalConfiguration[] {
    return null;
  }
}

describe('NutritionGoalsComponent', () => {
  const actions$ = new ReplaySubject(1);
  let injector: TestBed;
  let component: NutritionGoalsComponent;
  let fixture: ComponentFixture<NutritionGoalsComponent>;
  let store: MockStore;
  let notificationService: NotificationService;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NutritionGoalsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LoggerTestingModule,
        MatSelectModule,
      ],
      providers: [
        {
          provide: NotificationService,
          useClass: NotificationServiceMock,
        },
        {
          provide: ModalService,
          useClass: ModalServiceMock,
        },
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    modalService = injector.inject(ModalService);
    notificationService = injector.inject(NotificationService);
    store = injector.inject(MockStore);
    fixture = injector.createComponent(NutritionGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill forms with current value from store', () => {
    const kcal = component.kcalFormControl.value;
    const protein = component.proteinFormControl.value;
    const carbs = component.carbsFormControl.value;
    const fats = component.fatsFormControl.value;

    expect(kcal).toEqual(user1NutritionGoals.kcal);
    expect(protein).toEqual(user1NutritionGoals.protein);
    expect(carbs).toEqual(user1NutritionGoals.carbs);
    expect(fats).toEqual(user1NutritionGoals.fats);
  });

  it('should not send update credentials action and display notification when fields are invalid', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const infoSpy = spyOn(notificationService, 'info');

    component.kcalFormControl.setValue(0);
    fixture.detectChanges();
    component.updateNutritionGoals();

    expect(infoSpy).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should send update credentials action', () => {
    let modalConfiguration: ModalConfiguration;
    const dispatchSpy = spyOn(store, 'dispatch');
    const infoSpy = spyOn(notificationService, 'info');
    const openDialogSpy = spyOn(modalService, 'openDialog').and.callFake(
      (mc) => (modalConfiguration = mc)
    );

    component.kcalFormControl.setValue(4000);
    component.proteinFormControl.setValue(50);
    component.carbsFormControl.setValue(25);
    component.fatsFormControl.setValue(25);
    fixture.detectChanges();
    component.updateNutritionGoals();

    expect(modalConfiguration).toBeTruthy();
    expect(openDialogSpy).toHaveBeenCalled();
    const buttons = modalConfiguration.getFooter().getButtons();
    expect(buttons.length).toEqual(2);
    buttons[1].getCallback()();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should disable / enable button dependng on changes', fakeAsync(() => {
    expect(component.disabled).toEqual(true);

    component.kcalFormControl.setValue(user1NutritionGoals.kcal + 1);

    expect(component.disabled).toEqual(false);
  }));
});
