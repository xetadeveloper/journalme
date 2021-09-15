// Modules
import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

// Components

// Styles
import style from './landing.module.css';

// Redux
import { connect } from 'react-redux';
import { reopenLastSession } from '../../Redux/Actions/httpActions';
import { resetSessionRestored } from '../../Redux/Actions/flagActions';

function LandingPage(props) {
  const { isLoggedIn, isSessionRestored, reopenLastSession, userInfo } = props;
  const { resetSessionRestored } = props;

  console.log('User: ', userInfo);

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
      console.log('Session Restored In Landing...');
      resetSessionRestored();
      // If session has been restored we'll only change the user profile icon to logged in instead,
      // which will be a link to the home page
    }
  }, [isSessionRestored, history, userInfo.username, resetSessionRestored]);

  return (
    <div className={`${style.container}`}>
      {/* Navbar */}
      <nav
        className={`flex justify-content-between align-items-center grey-bg ${style.navbar}`}>
        <h1 className={`logo`}>JournalMe</h1>
        <ul
          className={`flex justify-content-between align-items-center ${style.navlist}`}>
          <li>
            <NavLink to='/about'>Home</NavLink>
          </li>
          <li>
            <NavLink to='/about'>About</NavLink>
          </li>
          <li>
            <NavLink to='/contactus'>Contact Us</NavLink>
          </li>
          <li>
            <NavLink to='/blog'>Blog</NavLink>
          </li>
          <li>
            <NavLink
              to={`${
                isLoggedIn ? `/journal/${userInfo.username}` : '/login'
              }`}>
              {isLoggedIn ? 'Journals' : 'Login'}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn, userInfo } = state.app;
  const { isSessionRestored } = state.flags;
  return {
    isLoggedIn,
    isSessionRestored,
    userInfo,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    reopenLastSession: () =>
      dispatch(reopenLastSession({ httpMiddleware: true, method: 'GET' })),
    resetSessionRestored: () => dispatch(resetSessionRestored()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage);
