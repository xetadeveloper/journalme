// Modules
import React, { useEffect } from "react";

// Components

// Styles
import style from "./landing.module.css";

// Redux
import { connect } from "react-redux";
import { reopenLastSession } from "../../Redux/Actions/httpActions";

function LandingPage(props) {
  const { isLoggedIn, reopenLastSession } = props;

  // Handles the reopening of last saved session
  useEffect(() => {
    if (!isLoggedIn) {
      reopenLastSession();
    }
  }, [isLoggedIn]);

  return <div>Landing Page</div>;
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.app;
  return {
    isLoggedIn: isLoggedIn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    reopenLastSession: () =>
      dispatch(reopenLastSession({ httpMiddleware: true, method: "GET" })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
