import { createStore, applyMiddleware, combineReducers } from "redux";
import appReducer from "../Reducers/appReducer";
import flagsReducer from "../Reducers/flagsReducers";

// Middlewares
import httpMiddleware from "../Middleware/httpMiddleware";

const rootReducer = combineReducers({
  app: appReducer,
  flags: flagsReducer,
});

const store = createStore(rootReducer, applyMiddleware(httpMiddleware));
export default store;

console.log("Store's Startup State", store.getState());
store.subscribe(() => {
  console.log("Store's State", store.getState());
});
