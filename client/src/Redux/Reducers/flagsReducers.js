import {
  FETCH_STATUS,
  RESET_ERROR_FLAG,
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
  console.log("Flag Reducer Type: ", type);

  switch (type) {
    case FETCH_STATUS:
      return { ...state, ...payload };

    case UPDATE_FLAG_STATE:
      return { ...state, ...payload };

    case RESET_SESSION_RESTORED:
      return { ...state, isSessionRestored: false };

    case RESET_ERROR_FLAG:
      return { ...state, isError: false};
  }

  return state;
}
