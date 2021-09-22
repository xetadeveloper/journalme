import { SHOW_ERROR } from '../ActionTypes/actionTypes';
import {
  FETCH_STATUS,
  RESET_DATA_CREATED,
  RESET_DATA_DELETED,
  RESET_DATA_UPDATED,
  RESET_ERROR_FLAG,
  RESET_LOGIN_REDIRECT,
  RESET_PROFILE_UPLOAD,
  RESET_SESSION_RESTORED,
  UPDATE_FLAG_STATE,
} from '../ActionTypes/flagActionTypes';

const initialState = {
  fetchStatus: 'done',
  isSessionRestored: false,
  isError: false,
};

export default function flagReducers(state = initialState, action) {
  const { type, payload } = action;
  // console.log('Flag Reducer Type: ', type);

  switch (type) {
    case FETCH_STATUS:
      return { ...state, ...payload };

    case UPDATE_FLAG_STATE:
      return { ...state, ...payload };

    case RESET_SESSION_RESTORED:
      // console.log('Resetting session restored flag');
      return { ...state, isSessionRestored: false };

    case RESET_ERROR_FLAG:
      // console.log('Resetting error flag');
      return { ...state, isError: false };

    case RESET_LOGIN_REDIRECT:
      // console.log('Resetting login redirect flag');
      return { ...state, loginRedirect: false };

    case RESET_DATA_UPDATED:
      // console.log('Resetting data updated flag');
      return { ...state, isUpdated: false };

    case RESET_DATA_DELETED:
      // console.log('Resetting data deleted flag');
      return { ...state, isDeleted: false };

    case RESET_DATA_CREATED:
      // console.log('Resetting data cteated flag');
      return { ...state, isCreated: false };

    case RESET_PROFILE_UPLOAD:
      // console.log('Resetting profile upload flag');
      return { ...state, isProfilePicUpdated: false };

    case SHOW_ERROR:
      return { ...state, isError: true };
  }

  return state;
}
