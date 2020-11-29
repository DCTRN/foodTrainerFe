import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserCardListComponent } from './user-card-list.component';

const userInitial: User = {
  username: 'mike8',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: new Date(),
  firstName: 'majkel',
  lastName: 'majk',
  id: 5,
  authenticationLevel: 1,
};
export const initialState: any = {
  user: userInitial,
};

describe('UserCardListComponent', () => {
  let injector: TestBed;
  let component: UserCardListComponent;
  let fixture: ComponentFixture<UserCardListComponent>;
  let store: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserCardListComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    fixture = TestBed.createComponent(UserCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user credentials on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      UserAction.GET_CREDENTIALS_REQUEST()
    );
  });
});
