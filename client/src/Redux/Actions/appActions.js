import {
  GET_JOURNAL_TRADES,
  UPDATE_TRADE,
  GET_USER_INFO,
  LOGIN_USER,
  LOGOUT_USER,
  SIGNUP_USER,
  DELETE_TRADE,
  SHOW_ERROR,
  UPDATE_PROFILE,
  DELETE_USER,
  UPDATE_PASSWORD,
  UPDATE_PREFERENCES,
  GET_RECENT_TRADES,
  CREATE_JOURNAL,
  CREATE_TRADE,
  UPDATE_JOURNAL,
  DELETE_JOURNAL,
  FETCH_PROFILE_PIC,
  UPLOAD_PROFILE_PIC,
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

export function showError(payload) {
  console.log('show error payload: ', payload);

  return {
    type: SHOW_ERROR,
    payload,
  };
}

export function updateProfile(payload) {
  console.log('update user payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/profile/updateUser`;
  }

  return {
    type: UPDATE_PROFILE,
    payload,
  };
}

export function updatePassword(payload) {
  console.log('update password payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/profile/updatePassword`;
  }

  return {
    type: UPDATE_PASSWORD,
    payload,
  };
}

export function updatePreferences(payload) {
  console.log('update preferences payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/preferences/updatePreferences`;
  }

  return {
    type: UPDATE_PREFERENCES,
    payload,
  };
}

export function deleteUser(payload) {
  console.log('delete user payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/profile/deleteUser`;
  }

  return {
    type: DELETE_USER,
    payload,
  };
}

export function getRecentTrades(payload) {
  console.log('get recent trades payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/recentTrades`;
  }

  return {
    type: GET_RECENT_TRADES,
    payload,
  };
}

export function createTrade(payload) {
  console.log('create trade payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/createTrade`;
  }

  return {
    type: CREATE_TRADE,
    payload,
  };
}

export function createJournal(payload) {
  console.log('create journal payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/createJournal`;
  }

  return {
    type: CREATE_JOURNAL,
    payload,
  };
}

export function updateJournal(payload) {
  console.log('update journal payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/updateJournal`;
  }

  return {
    type: UPDATE_JOURNAL,
    payload,
  };
}

export function uploadProfilePic(payload) {
  console.log('upload profile pic payload: ', payload);
  const apiKey = process.env.REACT_APP_IMGBB_API_KEY;
  console.log('API Key: ', apiKey);

  if (payload) {
    payload.url = `https://api.imgbb.com/1/upload?key=735301767b85be18f78f23003b0c43b3`;
  }

  return {
    type: UPLOAD_PROFILE_PIC,
    payload,
  };
}

export function fetchProfilePic(payload) {
  console.log('fetch profile pic payload: ', payload);

  if (payload) {
    payload.url = ``;
  }

  return {
    type: FETCH_PROFILE_PIC,
    payload,
  };
}

export function deleteJournal(payload) {
  console.log('delete journal payload: ', payload);

  if (payload) {
    payload.url = `/api/${payload.username}/deleteJournal`;
  }

  return {
    type: DELETE_JOURNAL,
    payload,
  };
}
