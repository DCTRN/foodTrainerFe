import { createReducer, on } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { Friends, FriendsAction } from './friends.actions';
import { Friend } from './friends.model';

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
  on(FriendsAction.ACCEPT_FRIEND_REQUEST_SUCCESS, (state, action) => {
    const f = state.friends.filter((friend) => friend.id !== action.friend.id);
    f.push(action.friend);
    return {
      friends: f,
    };
  }),
  on(FriendsAction.ACCEPT_FRIEND_REQUEST_ERROR, (state) => state),
  on(FriendsAction.DELETE_FRIEND_REQUEST, (state) => state),
  on(FriendsAction.DELETE_FRIEND_REQUEST_SUCCESS, (state, action) => ({
    friends: [...deleteFriendById(state, action)],
  })),
  on(FriendsAction.DELETE_FRIEND_REQUEST_ERROR, (state) => state)
);

function deleteFriendById(state: Friends, action): Friend[] {
  return state.friends.filter((friend) => friend.id !== action.id);
}

export function friendsReducer(state, action) {
  return _friendsReducer(state, action);
}
