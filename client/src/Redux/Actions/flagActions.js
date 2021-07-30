import {
  FETCH_STATUS,
  RESET_ERROR_FLAG,
  RESET_SESSION_RESTORED,
  UPDATE_FLAG_STATE,
} from '../ActionTypes/flagActionTypes';

export function changeFetchStatus(payload) {
  return {
    type: FETCH_STATUS,
    payload,
  };
}

export function updateFlagState(payload) {
  return {
    type: UPDATE_FLAG_STATE,
    payload,
  };
}

export function resetSessionRestored(payload) {
  return {
    type: RESET_SESSION_RESTORED,
    payload,
  };
}

export function resetErrorFlag(payload) {
  return {
    type: RESET_ERROR_FLAG,
    payload,
  };
}
