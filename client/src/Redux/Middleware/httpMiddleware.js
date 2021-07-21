import { removeNull } from "../../Utility/utility";
import { changeFetchStatus, updateFlagState } from "../Actions/flagActions";
import {
  getFailed,
  getSuccessful,
  postFailed,
  postSuccessful,
} from "../Actions/httpActions";

export default function httpMiddleware(store) {
  return function (next) {
    return function (action) {
      const { payload } = action;

      if (payload && payload.httpMiddleware) {
        console.log("Running fetch");
        store.dispatch(changeFetchStatus({ fetchStatus: "fetching" }));

        const { url, method, fetchBody, headers } = payload;
        const fetchOptions = removeNull(
          new FetchOptions(method, fetchBody, headers)
        );

        // call fetch here
        fetch(url, fetchOptions)
          .then((response) => response.json())
          .then((data) => {
            console.log("Fetch Result: ", data);
            switch (method) {
              case "GET":
                if (data.error) {
                  store.dispatch(getFailed(data));
                } else {
                  store.dispatch(getSuccessful(data.app));
                  store.dispatch(updateFlagState(data.flags));
                }
                break;

              case "POST":
                data.error
                  ? store.dispatch(postFailed(data))
                  : store.dispatch(postSuccessful(data));
                break;

              default:
                break;
            }

            store.dispatch(changeFetchStatus({ fetchStatus: "done" }));
          });
      }

      next(action);
    };
  };
}

class FetchOptions {
  constructor(method, fetchBody, headers, mode, cache) {
    this.method = method;
    this.body = method !== "GET" ? JSON.stringify(fetchBody) : fetchBody;
    this.headers = headers;
    this.mode = mode || "cors";
    this.cache = cache || "default";
  }
}
