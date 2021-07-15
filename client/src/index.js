import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./index.css";

// Redux Store
import store from "./Redux/Store/store";

// Components
import LandingPage from "./Layouts/Landing/landing";
import MainLayout from "./Layouts/MainLayout/mainLayout";
import AboutUs from "./Layouts/About/about";
import ContactUs from "./Layouts/ContactUs/contactUs";
import Login from "./Layouts/Login/login";
import NotFound from "./Layouts/NotFound/notFound";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/contactus" component={ContactUs} />
        <Route path="/journal" component={MainLayout} />
        <Route path="/login" component={Login} />
        <Route path="/about" component={AboutUs} />
        <Route path="/" exact component={LandingPage} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
