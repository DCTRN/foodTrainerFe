import { Component, OnInit } from '@angular/core';
import { ListType } from '../user-card-list/user-card-list.component';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent implements OnInit {
  public type = ListType;
  constructor() {}

  public ngOnInit(): void {}
}
