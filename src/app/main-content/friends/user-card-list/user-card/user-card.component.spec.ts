import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { Friend } from '@core/stores/friends/friends.model';
import {
  UserCardButtonAction,
  UserCardButtonActionType,
  UserCardComponent,
} from './user-card.component';

const friend: Friend = {
  id: 1,
  isAccepted: false,
  friend: {
    id: 5,
    username: 'mike98',
    email: 'mike98@gmail.com',
    birthDate: new Date(),
    phoneNumber: '111222333',
    firstName: 'Michal1',
    lastName: 'Pytlik1',
    authenticationLevel: 1,
  },
  friendshipRequesterId: 5,
  friendshipRequestDate: new Date(),
  friendshipAcceptDate: new Date(),
};

describe('UserCardComponent', () => {
  let injector: TestBed;
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.friend = friend;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send action event on button click', () => {
    const actions: UserCardButtonActionType[] = [];
    component.add = { isDisplayed: true };
    component.delete = { isDisplayed: true };
    component.accept = { isDisplayed: true };
    component.discard = { isDisplayed: true };
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'button'
    ) as HTMLButtonElement[];
    component.actions.subscribe((action: UserCardButtonAction) =>
      actions.push(action.action)
    );
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].click();
    }

    expect(actions.length).toEqual(4);

    expect(actions.includes(UserCardButtonActionType.ADD)).toBeTruthy();
    expect(actions.includes(UserCardButtonActionType.DELETE)).toBeTruthy();
    expect(actions.includes(UserCardButtonActionType.ACCEPT)).toBeTruthy();
    expect(actions.includes(UserCardButtonActionType.DISCARD)).toBeTruthy();
  });

  it('should disable all buttons', () => {
    const actions: UserCardButtonActionType[] = [];
    component.add = { isDisplayed: true, isDisabled: true };
    component.delete = { isDisplayed: true, isDisabled: true };
    component.accept = { isDisplayed: true, isDisabled: true };
    component.discard = { isDisplayed: true, isDisabled: true };
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll(
      'button[disabled]'
    ) as HTMLButtonElement[];

    expect(buttons.length).toEqual(4);
  });
});
