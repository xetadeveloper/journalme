import {
  GET_FAILED,
  GET_SUCCESSFUL,
  POST_FAILED,
  POST_SUCCESSFUL,
} from "../ActionTypes/actionTypes";

const initialState = {
  isLoggedIn: false,
};

export default function appReducer(state = initialState, action) {
  const { type, payload } = action;

  if (
    type === POST_SUCCESSFUL ||
    type === POST_FAILED ||
    type === GET_FAILED ||
    type === GET_SUCCESSFUL
  ) {
    console.log(`Action Type: ${type}`);
    return { ...state, ...payload };
  }

  return state;
}
