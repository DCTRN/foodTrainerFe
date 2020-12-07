import { createAction, props } from '@ngrx/store';
import { Friend } from './friends.model';

export type Friends = {
  friends: Array<Friend>;
};

export const getAllFriendsType = '[FRIENDS] GET_ALL_FRIENDS_REQUEST';
export const getAllFriendsSuccessType =
  '[FRIENDS] GET_ALL_FRIENDS_REQUEST_SUCCESS';
export const getAllFriendsErrorType = '[FRIENDS] GET_ALL_FRIENDS_REQUEST_ERROR';

export const sendFriendRequestType = '[FRIENDS] SEND_FRIEND_REQUEST';
export const sendFriendRequestSuccessType =
  '[FRIENDS] SEND_FRIEND_REQUEST_SUCCESS';
export const sendFriendRequestErrorType = '[FRIENDS] SEND_FRIEND_REQUEST_ERROR';

export const acceptFriendRequestType = '[FRIENDS] ACCEPT_FRIEND_REQUEST';
export const acceptFriendRequestSuccessType =
  '[FRIENDS] ACCEPT_FRIEND_REQUEST_SUCCESS';
export const acceptFriendRequestErrorType =
  '[FRIENDS] ACCEPT_FRIEND_REQUEST_ERROR';

export const deleteFriendRequestType = '[FRIENDS] DELETE_FRIEND_REQUEST';
export const deleteFriendRequestSuccessType =
  '[FRIENDS] DELETE_FRIEND_REQUEST_SUCCESS';
export const deleteFriendRequestErrorType =
  '[FRIENDS] DELETE_FRIEND_REQUEST_ERROR';

export const getAllFriends = createAction(getAllFriendsType);
export const getAllFriendsSuccess = createAction(
  getAllFriendsSuccessType,
  props<Friends>()
);
export const getAllFriendsError = createAction(getAllFriendsErrorType);

export const sendFriendRequest = createAction(
  sendFriendRequestType,
  props<{ id: number }>()
);
export const sendFriendRequestSuccess = createAction(
  sendFriendRequestSuccessType,
  props<{ friend: Friend }>()
);
export const sendFriendRequestError = createAction(sendFriendRequestErrorType);

export const acceptFriendRequest = createAction(
  acceptFriendRequestType,
  props<{ id: number }>()
);
export const acceptFriendRequestSuccess = createAction(
  acceptFriendRequestSuccessType,
  props<{ friend: Friend }>()
);
export const acceptFriendRequestError = createAction(
  acceptFriendRequestErrorType
);

export const deleteFriendRequest = createAction(
  deleteFriendRequestType,
  props<{ id: number }>()
);
export const deleteFriendRequestSuccess = createAction(
  deleteFriendRequestSuccessType,
  props<{ id: number }>()
);
export const deleteFriendRequestError = createAction(
  deleteFriendRequestErrorType
);

export const FriendsActionType = {
  GET_ALL_FRIENDS_REQUEST: getAllFriendsType,
  GET_ALL_FRIENDS_REQUEST_SUCCESS: getAllFriendsSuccessType,
  GET_ALL_FRIENDS_REQUEST_ERROR: getAllFriendsErrorType,
  SEND_FRIEND_REQUEST: sendFriendRequestType,
  SEND_FRIEND_REQUEST_SUCCESS: sendFriendRequestSuccessType,
  SEND_FRIEND_REQUEST_ERROR: sendFriendRequestErrorType,
  ACCEPT_FRIEND_REQUEST: acceptFriendRequestType,
  ACCEPT_FRIEND_REQUEST_SUCCESS: acceptFriendRequestSuccessType,
  ACCEPT_FRIEND_REQUEST_ERROR: acceptFriendRequestErrorType,
  DELETE_FRIEND_REQUEST: deleteFriendRequestType,
  DELETE_FRIEND_REQUEST_SUCCESS: deleteFriendRequestSuccessType,
  DELETE_FRIEND_REQUEST_ERROR: deleteFriendRequestErrorType,
};

export const FriendsAction = {
  GET_ALL_FRIENDS_REQUEST: getAllFriends,
  GET_ALL_FRIENDS_REQUEST_SUCCESS: getAllFriendsSuccess,
  GET_ALL_FRIENDS_REQUEST_ERROR: getAllFriendsError,
  SEND_FRIEND_REQUEST: sendFriendRequest,
  SEND_FRIEND_REQUEST_SUCCESS: sendFriendRequestSuccess,
  SEND_FRIEND_REQUEST_ERROR: sendFriendRequestError,
  ACCEPT_FRIEND_REQUEST: acceptFriendRequest,
  ACCEPT_FRIEND_REQUEST_SUCCESS: acceptFriendRequestSuccess,
  ACCEPT_FRIEND_REQUEST_ERROR: acceptFriendRequestError,
  DELETE_FRIEND_REQUEST: deleteFriendRequest,
  DELETE_FRIEND_REQUEST_SUCCESS: deleteFriendRequestSuccess,
  DELETE_FRIEND_REQUEST_ERROR: deleteFriendRequestError,
};
