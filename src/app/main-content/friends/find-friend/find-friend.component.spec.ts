import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  getTestBed,
  TestBed,
} from '@angular/core/testing';
import { NotificationService } from '@core/notifications/service/notification.service';
import { Friend } from '@core/stores/friends/friends.model';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { FindFriendComponent } from './find-friend.component';
import { FindFriendService } from './find-friend.service';

const user1: User = {
  id: 66,
  username: 'mikeRandom',
  email: 'mikeRandom@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};
const user2: User = {
  id: 3,
  username: 'mike28',
  email: 'mike28@gmail.com',
  birthDate: null,
  phoneNumber: '220123146',
  firstName: 'majkel',
  lastName: 'majk',
  authenticationLevel: 1,
};

const usersMock = [user1, user2];

class FindFriendServiceMock {
  public findUsersBy(searchText: string): Observable<User[]> {
    return of(null);
  }
}

class NotificationServiceMock {
  public success(message: string, duration: number = 5000): void {}
  public error(message: string, duration: number = 5000): void {}
}

const friendsInitial: Friend[] = [
  {
    id: 5,
    isAccepted: true,
    friend: {
      id: 2,
      username: 'mike2',
      email: 'mike2@gmail.com',
      birthDate: new Date(),
      phoneNumber: '223123146',
      firstName: 'majkel',
      lastName: 'majk',
      authenticationLevel: 1,
    },
    friendshipRequesterId: 1,
    friendshipRequestDate: null,
    friendshipAcceptDate: null,
  },
];
const initialState = { friends: friendsInitial };

describe('FindFriendComponent', () => {
  let injector: TestBed;
  let component: FindFriendComponent;
  let fixture: ComponentFixture<FindFriendComponent>;
  let notificationService: NotificationService;
  let findFriendService: FindFriendService;
  let mockStore: MockStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FindFriendComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: FindFriendService, useClass: FindFriendServiceMock },
        { provide: NotificationService, useClass: NotificationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    injector = getTestBed();
    mockStore = injector.inject(MockStore);
    notificationService = injector.inject(NotificationService);
    findFriendService = injector.inject(FindFriendService);
    fixture = injector.createComponent(FindFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable / enable button dependng on changes', () => {
    expect(component.disabled).toEqual(true);

    component.searchTextFormControl.setValue('changed value');

    expect(component.disabled).toEqual(false);

    component.searchTextFormControl.setValue('');

    expect(component.disabled).toEqual(true);
  });

  it('should disable / enable button dependng on changes', () => {
    const searchText = 'some username';
    spyOn(findFriendService, 'findUsersBy').and.returnValue(of(usersMock));

    component.searchText = searchText;
    component.onFindClick();

    expect(findFriendService.findUsersBy).toHaveBeenCalledWith(searchText);
    expect(component.users.length).toEqual(2);
  });

  it('should clear component on float button click', () => {
    component.clear();

    expect(component.disabled).toEqual(true);
    expect(component.searchText).toEqual(null);
    expect(component.users.length).toEqual(0);
  });

  it('should dispatch appropriate event on friend action', () => {
    const searchText = 'some username';
    spyOn(findFriendService, 'findUsersBy').and.returnValue(of(usersMock));

    component.searchText = searchText;
    component.onFindClick();

    expect(findFriendService.findUsersBy).toHaveBeenCalledWith(searchText);
    expect(component.users.length).toEqual(2);
  });
});
