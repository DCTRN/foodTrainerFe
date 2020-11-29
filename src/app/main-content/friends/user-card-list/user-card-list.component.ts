import { Component, OnInit } from '@angular/core';
import { UserAction } from '@core/stores/user/user.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';

@Component({
  selector: 'app-user-card-list',
  templateUrl: './user-card-list.component.html',
  styleUrls: ['./user-card-list.component.scss'],
})
export class UserCardListComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  public ngOnInit(): void {
    this.store.dispatch(UserAction.GET_CREDENTIALS_REQUEST());
  }
}
