import {
  FETCH_STATUS,
  RESET_ERROR_FLAG,
  RESET_DATA_UPDATED,
  RESET_SESSION_RESTORED,
  UPDATE_FLAG_STATE,
  RESET_LOGIN_REDIRECT,
  RESET_DATA_DELETED,
  RESET_DATA_CREATED,
  RESET_PROFILE_UPLOAD,
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
  // console.log('Called reset session flag action');
  return {
    type: RESET_SESSION_RESTORED,
    payload,
  };
}

export function resetErrorFlag(payload) {
  // console.log('Called reset error flag action');
  return {
    type: RESET_ERROR_FLAG,
    payload,
  };
}

export function resetLoginRedirect(payload) {
  // console.log('Called reset login redirect flag action');
  return {
    type: RESET_LOGIN_REDIRECT,
    payload,
  };
}

export function resetDataUpdatedFlag(payload) {
  // console.log('Called data updated flag action');
  return {
    type: RESET_DATA_UPDATED,
    payload,
  };
}

export function resetDataDeletedFlag(payload) {
  // console.log('Called data deleted flag action');
  return {
    type: RESET_DATA_DELETED,
    payload,
  };
}

export function resetDataCreatedFlag(payload) {
  // console.log('Called reset data created flag action');
  return {
    type: RESET_DATA_CREATED,
    payload,
  };
}

export function resetProfilePicUpdated(payload) {
  // console.log('Called reset profile upload flag action');
  return {
    type: RESET_PROFILE_UPLOAD,
    payload,
  };
}
