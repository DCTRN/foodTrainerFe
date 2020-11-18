import { TestBed } from '@angular/core/testing';

import { UserFriendsApiService } from './user-friends-api.service';

describe('UserFriendsApiService', () => {
  let service: UserFriendsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFriendsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
