// Modules
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

// Components

// Styles
// import style from "./landing.module.css";

// Redux
import { connect } from "react-redux";
import { reopenLastSession } from "../../Redux/Actions/httpActions";
import { resetSessionRestored } from "../../Redux/Actions/flagActions";

function LandingPage(props) {
  const { isLoggedIn, isSessionRestored, reopenLastSession, user } = props;
  const { resetSessionRestored } = props;

  // Handles the reopening of last saved session
  useEffect(() => {
    if (!isLoggedIn) {
      reopenLastSession();
    }
  }, [isLoggedIn, reopenLastSession]);

  // // Handles flag actions
  const history = useHistory();
  useEffect(() => {
    if (isSessionRestored) {
      resetSessionRestored();
      history.push(`/journal/${user}`);
    }
  }, [isSessionRestored, history, user, resetSessionRestored]);

  return <div>Landing Page</div>;
}

function mapStateToProps(state) {
  const { isLoggedIn, user } = state.app;
  const { isSessionRestored } = state.flags;
  return {
    isLoggedIn,
    isSessionRestored,
    user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    reopenLastSession: () =>
      dispatch(reopenLastSession({ httpMiddleware: true, method: "GET" })),
    resetSessionRestored: () => dispatch(resetSessionRestored()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
