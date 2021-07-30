import { LOGIN_USER, LOGOUT_USER } from '../ActionTypes/actionTypes';

export function loginUser(payload) {
  if (payload) {
    payload.url = 'api/login';
  }


  return {
    type: LOGIN_USER,
    payload,
  };
}

export function logoutUser(payload) {
  if (payload) {
    payload.url = 'api/logout';
  }


  return {
    type: LOGOUT_USER,
    payload,
  };
}
