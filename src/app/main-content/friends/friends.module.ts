import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsComponent } from './friends.component';
import { UserCardComponent } from './user-card-list/user-card/user-card.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { FindFriendComponent } from './find-friend/find-friend.component';
import { MatCardModule } from '@angular/material/card';
import { UserCardListComponent } from './user-card-list/user-card-list.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    FriendsComponent,
    UserCardComponent,
    FriendsListComponent,
    FriendRequestsComponent,
    FindFriendComponent,
    UserCardListComponent,
  ],
  imports: [
    CommonModule,
    FriendsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTabsModule,
    MatTooltipModule,
    MatCardModule,
    MatRippleModule,
  ],
})
export class FriendsModule {}
