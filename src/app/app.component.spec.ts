import {
  TestBed,
  async,
  ComponentFixture,
  getTestBed,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { LocalStorageService } from 'ngx-webstorage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

const initialState = undefined;

describe('AppComponent', () => {
  let injector: TestBed;
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerTestingModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [AppComponent],
      providers: [provideMockStore({ initialState }), LocalStorageService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    injector = getTestBed();
    fixture = injector.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = injector.inject(Router);
  }));

  it('should create the app', () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    expect(component).toBeTruthy();
  });

  it(`should have as title 'food-trainer'`, () => {
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl');
    expect(component.title).toEqual('food-trainer');
  });
});
