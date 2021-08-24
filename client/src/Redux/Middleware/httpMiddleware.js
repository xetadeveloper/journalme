import { removeNull } from '../../Utility/utility';
import { changeFetchStatus, updateFlagState } from '../Actions/flagActions';
import {
  getFailed,
  getSuccessful,
  postFailed,
  postSuccessful,
} from '../Actions/httpActions';

export default function httpMiddleware(store) {
  return function (next) {
    return function (action) {
      const { payload } = action;

      if (payload && payload.httpMiddleware) {
        console.log('Running fetch');
        store.dispatch(changeFetchStatus({ fetchStatus: 'fetching' }));

        const { url, method, fetchBody, headers } = payload;
        // console.log('Fetch Body: ', fetchBody);
        // console.log('Url: ', url);

        const fetchOptions = removeNull(
          new FetchOptions(method, fetchBody, headers)
        );

        // console.log('Fetch Options: ', fetchOptions);

        // call fetch here
        fetch(url, fetchOptions)
          .then(response => response.json())
          .then(data => {
            console.log('Fetch Result: ', data);
            switch (method) {
              case 'GET':
                if (data.app && data.app.error) {
                  store.dispatch(getFailed(data.app));
                  store.dispatch(updateFlagState(data.flags));
                } else {
                  store.dispatch(getSuccessful(data.app));
                  store.dispatch(updateFlagState(data.flags));
                }
                break;

              case 'POST':
                if (data.app && data.app.error) {
                  store.dispatch(postFailed(data.app));
                  store.dispatch(updateFlagState(data.flags));
                } else {
                  store.dispatch(postSuccessful(data.app));
                  store.dispatch(updateFlagState(data.flags));
                }
                break;

              default:
                break;
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
    this.body = method !== 'GET' ? JSON.stringify(fetchBody) : fetchBody;
    this.headers = headers;
    this.mode = mode || 'cors';
    this.cache = cache || 'default';
  }
}
