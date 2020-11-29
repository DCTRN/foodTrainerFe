import { createReducer, on } from '@ngrx/store';
import { Friends, FriendsAction } from './friends.actions';

export const friendsFeatureKey = 'friends';

export const initialState: Friends = {
  friends: [],
};

export const _friendsReducer = createReducer(
  initialState,
  on(FriendsAction.GET_ALL_FRIENDS_REQUEST, (state) => state),
  on(FriendsAction.GET_ALL_FRIENDS_REQUEST_SUCCESS, (state, action) => ({
    friends: action.friends,
  })),
  on(FriendsAction.GET_ALL_FRIENDS_REQUEST_ERROR, (state) => state),
  on(FriendsAction.SEND_FRIEND_REQUEST, (state) => state),
  on(FriendsAction.SEND_FRIEND_REQUEST_SUCCESS, (state, action) => ({
    friends: [...state.friends, action.friend],
  })),
  on(FriendsAction.SEND_FRIEND_REQUEST_ERROR, (state) => state),
  on(FriendsAction.ACCEPT_FRIEND_REQUEST, (state) => state),
  on(FriendsAction.ACCEPT_FRIEND_REQUEST_SUCCESS, (state, action) => ({
    friends: [...state.friends, action.friend],
  })),
  on(FriendsAction.ACCEPT_FRIEND_REQUEST_ERROR, (state) => state),
  on(FriendsAction.DELETE_FRIEND_REQUEST, (state) => state),
  on(FriendsAction.DELETE_FRIEND_REQUEST_SUCCESS, (state, action) => ({
    friends: [...state.friends.filter((friend) => friend.id !== action.id)],
  })),
  on(FriendsAction.DELETE_FRIEND_REQUEST_ERROR, (state) => state)
);

export function friendsReducer(state, action) {
  return _friendsReducer(state, action);
}
