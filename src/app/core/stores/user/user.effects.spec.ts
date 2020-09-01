import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs';
import { UserEffects } from './user.effects';
import { NGXLogger, LoggerConfig } from 'ngx-logger';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('AuthenticationService', () => {
  let injector: TestBed;
  let service: UserEffects;
  let actions$: ReplaySubject<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule],
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        NGXLogger,
        LoggerConfig,
      ],
    });

    injector = getTestBed();
    service = injector.inject(UserEffects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
