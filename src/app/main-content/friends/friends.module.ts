import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconRegistryModule } from '@main-content/shared/icon-registry/icon-registry.module';
import { FindFriendComponent } from './find-friend/find-friend.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsComponent } from './friends.component';
import { UserCardListComponent } from './user-card-list/user-card-list.component';
import { UserCardComponent } from './user-card-list/user-card/user-card.component';

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
    MatDividerModule,
    MatExpansionModule,
    IconRegistryModule,
  ],
  exports: [FriendsComponent],
})
export class FriendsModule {}
