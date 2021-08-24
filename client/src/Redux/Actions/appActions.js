import {
  GET_JOURNAL_TRADES,
  UPDATE_TRADE,
  GET_USER_INFO,
  LOGIN_USER,
  LOGOUT_USER,
  SIGNUP_USER,
  DELETE_TRADE,
} from '../ActionTypes/actionTypes';

export function loginUser(payload) {
  if (payload) {
    payload.url = '/api/login';
  }

  return {
    type: LOGIN_USER,
    payload,
  };
}

export function signupUser(payload) {
  if (payload) {
    payload.url = '/api/signup';
  }

  return {
    type: SIGNUP_USER,
    payload,
  };
}

export function logoutUser(payload) {
  if (payload) {
    payload.url = '/api/logout';
  }

  return {
    type: LOGOUT_USER,
    payload,
  };
}

export function getUserInfo(payload) {
  if (payload) {
    payload.url = `/api/${payload.username}/journals`;
  }
  return {
    type: GET_USER_INFO,
    payload,
  };
}

export function getJournalTrades(payload) {
  // console.log('trade payload: ', payload);
  if (payload) {
    payload.url = `/api/${payload.username}/trades?journalID=${payload.journalID}`;
  }
  return {
    type: GET_JOURNAL_TRADES,
    payload,
  };
}

export function updateTrade(payload) {
  console.log('update trade payload: ', payload);
  if (payload) {
    payload.url = `/api/${payload.username}/updateTrade`;
  }

  return {
    type: UPDATE_TRADE,
    payload,
  };
}

export function deleteTrade(payload) {
  console.log('delete trade payload: ', payload);
  if (payload) {
    payload.url = `/api/${payload.username}/deleteTrade`;
  }

  return {
    type: DELETE_TRADE,
    payload,
  };
}
