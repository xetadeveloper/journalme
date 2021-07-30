import React from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { logoutUser } from '../../../Redux/Actions/appActions';

import style from '../loginContainer.module.css';

function Logout(props) {
  const { isLoggedIn, user } = props;

  const history = useHistory();

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/login');
    }
  });

  return (
    <form className={`grey-text flex flex-col  ${style.form}`}>
      <h4>We're so sorry to see you go :(</h4>
      <button type='button' className={`${style.formBtn}`}>
        Logout
      </button>
      <NavLink
        to={`/journal/${user}`}
        className={`${style.journalLink}`}
        onClick={() => {
          logoutUser();
        }}>
        Back to Journal?
      </NavLink>
    </form>
  );
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.app;
  return { isLoggedIn };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => dispatch(logoutUser()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
