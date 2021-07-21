import {
  FETCH_STATUS,
  UPDATE_FLAG_STATE,
} from "../ActionTypes/flagActionTypes";

const initialState = { fetchStatus: "done" };

export default function flagReducers(state = initialState, action) {
  const { type, payload } = action;
  // console.log("Reducer Type: ", type);

  switch (type) {
    case FETCH_STATUS:
      return { ...state, ...payload };

    case UPDATE_FLAG_STATE:
      return { ...state, ...payload };
  }

  return state;
}
