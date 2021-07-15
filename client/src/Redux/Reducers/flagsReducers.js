import { FETCH_STATUS } from "../ActionTypes/flagActionTypes";

const initialState = { fetchStatus: "done" };

export default function flagReducers(state = initialState, action) {
  const { type, payload } = action;

  if (type === FETCH_STATUS) {
    return { ...state, ...payload };
  }

  return state;
}
