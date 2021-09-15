import {
  GET_FAILED,
  GET_SUCCESSFUL,
  POST_FAILED,
  POST_SUCCESSFUL,
  SHOW_ERROR,
} from '../ActionTypes/actionTypes';

const initialState = {
  isLoggedIn: false,
  userInfo: {},
};

export default function appReducer(state = initialState, action) {
  const { type, payload } = action;

  // console.log("Reducer Type: ", type);

  switch (type) {
    case POST_SUCCESSFUL:
    case POST_FAILED:
    case GET_FAILED:
    case GET_SUCCESSFUL:
      console.log(`Action Type: ${type}`);
      return { ...state, ...payload };
      break;

    case SHOW_ERROR:
      return { ...state, error: { ...payload } };
      break;
  }

  return state;
}
