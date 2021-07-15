import { FETCH_STATUS } from "../ActionTypes/flagActionTypes";

export function changeFetchStatus(payload) {
  return {
    type: FETCH_STATUS,
    payload,
  };
}
