import { errorTypes } from '../../config';
import { updateProfile } from '../Actions/appActions';
import { removeNull } from '../../Utility/utility';
import {
  getFailed,
  getSuccessful,
  postFailed,
  postSuccessful,
} from '../Actions/httpActions';
import { changeFetchStatus, updateFlagState } from '../Actions/flagActions';

export default function profileMidleware(store) {
  return function (next) {
    return function (action) {
      const { payload } = action;

      if (payload && payload.profileMiddleware) {
        // console.log('Running profile picture upload');

        const { url, method, fetchBody, headers } = payload;
        // console.log('Fetch Body: ', fetchBody);
        // console.log('Url: ', url);

        const fetchOptions = removeNull(
          new FetchOptions(method, fetchBody, headers)
        );

        // console.log('Fetch Options: ', fetchOptions);

        // call fetch here
        fetch(url, fetchOptions)
          .then(response => {
            console.log('Got a response');
            return response.json();
          })
          .then(uploadRes => {
            console.log('Upload Result: ', uploadRes);

            if (uploadRes.app && !uploadRes.app.error) {
              // Update
              store.dispatch(postSuccessful(uploadRes.app));
              store.dispatch(updateFlagState(uploadRes.flags));
            } else {
              store.dispatch(postFailed(uploadRes.app));
              store.dispatch(updateFlagState(uploadRes.flags));
            }

            store.dispatch(changeFetchStatus({ fetchStatus: 'done' }));
          });
      }

      next(action);
    };
  };
}

class FetchOptions {
  constructor(method, fetchBody, headers, mode, cache) {
    this.method = method;
    this.body = fetchBody;
    this.headers = headers;
    this.mode = mode || 'cors';
    this.cache = cache || 'default';
  }
}
