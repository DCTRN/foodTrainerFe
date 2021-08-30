import { user1, user2 } from '@testsUT/user/user-mock-data.model';
import { isEqual } from 'lodash';
import { Friends, FriendsAction } from './friends.actions';
import { Friend } from './friends.model';
import { friendsReducer } from './friends.reducer';

const friend1: Friend = {
  id: 6,
  isAccepted: false,
  friend: user1,
  friendshipRequesterId: 5,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friend1Accepted: Friend = {
  id: 6,
  isAccepted: true,
  friend: user1,
  friendshipRequesterId: 5,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friend2: Friend = {
  id: 7,
  isAccepted: false,
  friend: user2,
  friendshipRequesterId: 5,
  friendshipRequestDate: null,
  friendshipAcceptDate: null,
};
const friends: Array<Friend> = [friend1, friend2];

const initialState: Friends = {
  friends: [],
};

describe('Friends Reducer', () => {
  it('should return the previous state', () => {
    const action = {} as any;

    const result = friendsReducer(initialState, action);

    expect(result).toBe(initialState);
  });

  it('should test get all friends', () => {
    let result = friendsReducer(
      initialState,
      FriendsAction.GET_ALL_FRIENDS_REQUEST()
    );
    expect(result).toBe(initialState);

    result = friendsReducer(
      result,
      FriendsAction.GET_ALL_FRIENDS_REQUEST_ERROR()
    );
    expect(result).toBe(initialState);

    result = friendsReducer(
      result,
      FriendsAction.GET_ALL_FRIENDS_REQUEST_SUCCESS({ friends })
    );
    expect(isEqual(result.friends, friends)).toEqual(true);
  });

  it('should test send friend request', () => {
    let result = friendsReducer(
      initialState,
      FriendsAction.SEND_FRIEND_REQUEST({ id: 1 })
    );
    expect(result).toEqual(initialState);

    result = friendsReducer(result, FriendsAction.SEND_FRIEND_REQUEST_ERROR());
    expect(result).toEqual(initialState);

    result = friendsReducer(
      result,
      FriendsAction.SEND_FRIEND_REQUEST_SUCCESS({ friend: friend1 })
    );
    const f1 = result.friends[0];
    expect(isEqual(f1, friend1)).toEqual(true);
  });

  it('should test accept friend request', () => {
    let result = friendsReducer(
      initialState,
      FriendsAction.ACCEPT_FRIEND_REQUEST({ id: 1 })
    );
    expect(result).toEqual(initialState);

    result = friendsReducer(
      result,
      FriendsAction.ACCEPT_FRIEND_REQUEST_ERROR()
    );
    expect(result).toEqual(initialState);

    result = friendsReducer(
      result,
      FriendsAction.ACCEPT_FRIEND_REQUEST_SUCCESS({ friend: friend1Accepted })
    );
    const f1 = result.friends[0];
    expect(isEqual(f1, friend1Accepted)).toEqual(true);
  });

  it('should test accept friend request', () => {
    let result = friendsReducer(
      initialState,
      FriendsAction.ACCEPT_FRIEND_REQUEST_SUCCESS({ friend: friend1Accepted })
    );
    let f1 = result.friends[0];
    expect(isEqual(f1, friend1Accepted)).toEqual(true);

    result = friendsReducer(
      result,
      FriendsAction.DELETE_FRIEND_REQUEST({ id: 6 })
    );
    expect(result).toEqual(result);

    result = friendsReducer(
      result,
      FriendsAction.DELETE_FRIEND_REQUEST_ERROR()
    );
    expect(result).toEqual(result);

    result = friendsReducer(
      result,
      FriendsAction.DELETE_FRIEND_REQUEST_SUCCESS({ id: 6 })
    );
    f1 = result.friends[0];
    expect(result.friends.length).toEqual(0);
  });
});
