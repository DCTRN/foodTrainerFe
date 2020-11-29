import { User } from '@core/stores/user/user.model';

export interface FriendRequest {
  userId: number;
  friendId: number;
}

export interface Friend {
  id: number;
  isAccepted: boolean;
  friend: User;
  friendshipRequesterId: number;
  friendshipRequestDate: Date;
  friendshipAcceptDate: Date;
}

export interface UserFriend extends Friend {
  user: User;
}
