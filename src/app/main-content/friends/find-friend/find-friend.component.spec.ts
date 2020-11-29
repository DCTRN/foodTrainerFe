import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FindFriendComponent } from './find-friend.component';

describe('FindFriendComponent', () => {
  let component: FindFriendComponent;
  let fixture: ComponentFixture<FindFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FindFriendComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
