import { Component, OnInit } from '@angular/core';
import { Friend } from '@core/stores/friends/friends.model';
import { UserCardButton } from '../user-card-list/user-card/user-card.component';

@Component({
  selector: 'app-find-friend',
  templateUrl: './find-friend.component.html',
  styleUrls: ['./find-friend.component.scss'],
})
export class FindFriendComponent implements OnInit {
  public friend: Friend = {
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
  public button: Partial<UserCardButton> = {
    isDisplayed: true,
    isDisabled: false,
  };
  constructor() {}

  public ngOnInit(): void {}
}
