import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  getTestBed,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { TokensStorageService } from '@core/authentication/tokens-storage.service';
import { TokensAction } from '@core/stores/tokens/tokens.actions';
import { Tokens } from '@core/stores/tokens/tokens.model';
import { UserAction } from '@core/stores/user/user.actions';
import { User } from '@core/stores/user/user.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NGXLogger } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of, Subject } from 'rxjs';
import { ModalModule } from '../app/core/modal-service/modal.module';
import { AppComponent } from './app.component';

export const user1: User = {
  id: 1,
  username: 'mike8',
  password: 'haslo1234',
  email: 'michal.kowalski@gmail.com',
  phoneNumber: '123123123',
  birthDate: null,
  firstName: 'majkel',
  lastName: 'majk',
};

export const userInitial: User = {
  id: undefined,
  username: undefined,
  email: undefined,
  birthDate: undefined,
  phoneNumber: undefined,
  firstName: undefined,
  lastName: undefined,
  authenticationLevel: undefined,
};

const initialState = { user: userInitial };

const tokensMock: Tokens = {
  access_token: 'access_token_login',
  refresh_token: 'refresh_token_login',
  expires_in: 300,
};

const landingPageUrl = 'http://localhost:4200/landing-page';
const diaryPageUrl = 'http://localhost:4200/main/diary';
@Injectable()
class RouterMock {
  public eventsSource = new Subject<NavigationEnd>();
  public events = this.eventsSource.asObservable();
  public url = '';

  public navigateByUrl(string): Promise<boolean> {
    return of(true).toPromise();
  }

  public setUrl(url: string): void {
    this.url = url;
  }
}

@Injectable()
class SyncStorageMock {
  private storage;

  public retrieve(key: string): any {
    return this.storage;
  }

  public store(key: string, value: any): any {
    this.storage = value;
  }
}

@Injectable()
export class TokensStorageServiceMock {
  private tokens: Tokens = tokensMock;

  constructor() {}

  public setTokens(tokens: Tokens): void {
    this.tokens = tokens;
  }

  public getTokens(): Tokens {
    return this.tokens;
  }
}

@Injectable()
class AuthenticationServiceMock {
  public getAuthState$(): Observable<boolean> {
    return of(true);
  }

  public isAuthOperationInProgress(): boolean {
    return false;
  }
}

describe('AppComponent', () => {
  let injector: TestBed;
  let router: RouterMock;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let logger: NGXLogger;
  let localStorageService: LocalStorageService;
  let store: MockStore;
  let authenticationService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule,
        LoggerTestingModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [AppComponent],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: LocalStorageService,
          useClass: SyncStorageMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: AuthenticationService,
          useClass: AuthenticationServiceMock,
        },
        {
          provide: TokensStorageService,
          useClass: TokensStorageServiceMock,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    injector = getTestBed();
    store = injector.inject(MockStore);
    authenticationService = injector.inject(AuthenticationService);
    localStorageService = injector.inject(LocalStorageService);
    router = injector.inject<RouterMock>(Router as any);
    logger = injector.inject(NGXLogger);
    fixture = injector.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'food-trainer'`, () => {
    expect(component.title).toEqual('food-trainer');
  });

  it(`should log navigation events'`, () => {
    const logSpy = spyOn(logger, 'log');
    ((router as unknown) as RouterMock).eventsSource.next(
      new NavigationEnd(1, 'randomUrlStart', 'RandomUrlEnd')
    );
    expect(logSpy).toHaveBeenCalled();
  });

  it(`should turn off spinner and do not navigate to landing page if tokens are upsent'`, () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    router.setUrl(landingPageUrl);

    component.ngOnInit();

    expect(component.showSpinner).toBeFalsy();
    expect(navigateByUrlSpy).not.toHaveBeenCalledWith('/');
  });

  it(`should turn off spinner and  navigate to landing page if tokens are upsent'`, () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    router.setUrl(diaryPageUrl);

    component.ngOnInit();

    expect(component.showSpinner).toBeFalsy();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/');
  });

  it('should refresh tokens and do not navigate to main page', fakeAsync(() => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const dispatchSpy = spyOn(store, 'dispatch');
    router.setUrl(diaryPageUrl);
    localStorageService.store('tokens', tokensMock);

    component.ngOnInit();
    store.setState({ user: user1 });
    tick(2000);

    expect(component.showSpinner).toBeFalsy();
    expect(navigateByUrlSpy).not.toHaveBeenCalledWith('/main');
    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      UserAction.GET_CREDENTIALS_REQUEST()
    );
  }));

  it('should refresh tokens and navigate to main page', fakeAsync(() => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const dispatchSpy = spyOn(store, 'dispatch');
    router.setUrl(landingPageUrl);
    localStorageService.store('tokens', tokensMock);

    component.ngOnInit();
    store.setState({ user: user1 });
    tick(2000);

    expect(component.showSpinner).toBeFalsy();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/main');
    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      UserAction.GET_CREDENTIALS_REQUEST()
    );
  }));

  it('should fail to refresh tokens and navigate to landing page', fakeAsync(() => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const dispatchSpy = spyOn(store, 'dispatch');
    spyOn(authenticationService, 'getAuthState$').and.returnValue(of(false));
    router.setUrl(diaryPageUrl);
    localStorageService.store('tokens', tokensMock);

    component.ngOnInit();
    tick(2000);

    expect(component.showSpinner).toBeFalsy();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/');
    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      UserAction.GET_CREDENTIALS_REQUEST()
    );
  }));

  it('should fail to get user credentials and navigate to landing page', fakeAsync(() => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    const dispatchSpy = spyOn(store, 'dispatch');
    router.setUrl(diaryPageUrl);
    localStorageService.store('tokens', tokensMock);

    component.ngOnInit();
    tick(7000);

    expect(component.showSpinner).toBeFalsy();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/');
    expect(dispatchSpy).toHaveBeenCalledWith(
      TokensAction.REFRESH_TOKENS_REQUEST()
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      UserAction.GET_CREDENTIALS_REQUEST()
    );
  }));
});
