// Modules
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { dummyJournals } from '../../dummyData';

// Redux
import { connect } from 'react-redux';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import {
  deleteTrade,
  getJournalTrades,
  getUserInfo,
  updateTrade,
} from '../../Redux/Actions/appActions';
import {
  resetErrorFlag,
  resetLoginRedirect,
  resetSessionRestored,
  resetDataUpdatedFlag,
  resetDataDeletedFlag,
} from '../../Redux/Actions/flagActions';
import { reopenLastSession } from '../../Redux/Actions/httpActions';

// Styles
import style from './mainLayout.module.css';

// Components
import SideNav from '../../Components/SideNav/sideNav';
import Home from './Home/home';
import Navbar from '../../Components/Navbar/navbar';
import JournalTrades from './JournalTrades/journalTrades';
import TradeDetails from './TradeDetails/tradeDetails';
import Modal from '../../Components/Modals/modal';
import Preferences from './Preferences/preferences';
import Profile from './Profile/profile';
import Settings from './Settings/settings';
import RecentTrades from './RecentTrades/recentTrades';

function MainLayout(props) {
  const isMobile = useMediaQuery({ query: '(max-width: 425px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });
  const isWideScreen = useMediaQuery({ query: '(min-width: 1441px)' });

  // Props
  const { isLoggedIn, userInfo, getUserInfo, getJournalTrades } = props;
  const { journalTrades, isError, error, resetErrorFlag, isUpdated } = props;
  const { resetSessionRestored, reopenLastSession, isSessionRestored } = props;
  const { loginRedirect, resetLoginRedirect, updateTrade } = props;
  const { resetDataUpdatedFlag, isDeleted, deleteTrade } = props;
  const { resetDataDeletedFlag } = props;

  // console.log('UserInfo: ', userInfo);
  const { username, journals, firstname, preferences, _id } = userInfo || {};
  const { strategies } = preferences || {};

  // console.log('Username: ', username);

  const { path } = useRouteMatch();
  const history = useHistory();

  // Handles reopening of last session
  useEffect(() => {
    if (!isLoggedIn) {
      // We reopen last session if available
      // console.log('Reopeoning last session in mainlayout');
      reopenLastSession();
    } else {
      // Handles retreival of the journals if not in redux store
      if (!firstname) {
        // Get userInfo from server
        // console.log('getting user info from server');
        getUserInfo(username);
      }
    }
  }, [isLoggedIn, firstname, username]);

  // Use an effect to deal with error here
  useEffect(() => {
    if (isError) {
      console.log('Error Occured: ', error);
      resetErrorFlag();
    }
  }, [isError]);

  // For resetting session restoration
  useEffect(() => {
    if (isSessionRestored) {
      // console.log('Session Restored In MainLayout  ..');
      resetSessionRestored();
    }
  }, [isSessionRestored]);

  // Handles the redirection to login if not logged in
  useEffect(() => {
    if (loginRedirect) {
      history.push('/login');
      resetLoginRedirect();
    }
  }, [loginRedirect]);

  // Default Navigation List
  const navItemsList = [
    { linkName: 'Journals', linkPath: `${path}/${username}` },
    { linkName: 'Recent Trades', linkPath: `${path}/${username}/recenttrades` },
    { linkName: 'Preferences', linkPath: `${path}/${username}/preferences` },
    { linkName: 'About Us', linkPath: '/about' },
    { linkName: 'Need Help?', linkPath: '/contactus' },
  ];

  return (
    <div
      className={`flex 
      ${(isMobile || isWideScreen) && 'flex-col'} 
      ${style.container}`}>
      <Modal
        isLoggedIn={isLoggedIn}
        modalState={{
          show: !firstname,
          type: 'loading',
          message: 'Fetching Journals',
        }}
      />

      {isMobile || isWideScreen ? (
        <Navbar
          navItemsList={navItemsList}
          isWideScreen={isWideScreen}
          isMobile={isMobile}
        />
      ) : (
        <SideNav navItemsList={navItemsList} />
      )}

      <div className={`${style.pageHolder}`}>
        <Switch>
          {/* For displaying a trade's details */}
          <Route
            path={`${path}/:user/journaltrades/trade`}
            render={routeprops => (
              <TradeDetails
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
                getJournalTrades={getJournalTrades}
                journalTrades={journalTrades}
                updateTrade={updateTrade}
                strategies={strategies}
                userID={_id}
                isLoggedIn={isLoggedIn}
                username={username}
                isUpdated={isUpdated}
                resetDataUpdatedFlag={resetDataUpdatedFlag}
                isDeleted={isDeleted}
                deleteTrade={deleteTrade}
                resetDataDeletedFlag={resetDataDeletedFlag}
              />
            )}
          />

          {/* For displaying all trades of a journal */}
          <Route
            path={`${path}/:user/journaltrades`}
            render={routeprops => (
              <JournalTrades
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
                journals={journals}
                userID={_id}
                isLoggedIn={isLoggedIn}
                username={username}
                strategies={strategies}
                getJournalTrades={getJournalTrades}
                journalTrades={journalTrades}
              />
            )}
          />

          {/* For displaying user profile */}
          <Route
            path={`${path}/:user/preferences/profile`}
            render={routeprops => (
              <Profile
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
              />
            )}
          />

          {/* For displaying and editing settings */}
          <Route
            path={`${path}/:user/preferences/settings`}
            render={routeprops => (
              <Settings
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
              />
            )}
          />

          {/* For displaying preferences */}
          <Route
            path={`${path}/:user/preferences`}
            render={routeprops => (
              <Preferences
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
              />
            )}
          />

          {/* For displaying recent trades */}
          <Route
            path={`${path}/:user/recenttrades`}
            render={routeprops => (
              <RecentTrades
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
              />
            )}
          />

          {/* For displaying all journals for a user */}
          <Route
            path={`${path}/:user`}
            render={routeprops => (
              <Home
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
                journals={journals}
              />
            )}
          />
        </Switch>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  // console.log('State: ', state);
  const { isLoggedIn, userInfo, journalTrades, error } = state.app;
  const { isError, isSessionRestored, loginRedirect, isUpdated, isDeleted } =
    state.flags;

  return {
    isLoggedIn,
    userInfo,
    isError,
    error,
    journalTrades,
    isSessionRestored,
    loginRedirect,
    isUpdated,
    isDeleted,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUserInfo: username =>
      dispatch(getUserInfo({ username, httpMiddleware: true, method: 'GET' })),

    resetErrorFlag: () => dispatch(resetErrorFlag()),

    reopenLastSession: () =>
      dispatch(reopenLastSession({ httpMiddleware: true, method: 'GET' })),

    resetSessionRestored: () => dispatch(resetSessionRestored()),

    resetLoginRedirect: () => dispatch(resetLoginRedirect()),

    resetDataUpdatedFlag: () => dispatch(resetDataUpdatedFlag()),

    resetDataDeletedFlag: () => dispatch(resetDataDeletedFlag()),

    getJournalTrades: (username, journalID) =>
      dispatch(
        getJournalTrades({
          username,
          journalID,
          httpMiddleware: true,
          method: 'GET',
        })
      ),

    updateTrade: (username, fetchBody) =>
      dispatch(
        updateTrade({
          username,
          fetchBody,
          httpMiddleware: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),

    deleteTrade: (username, fetchBody) =>
      dispatch(
        deleteTrade({
          username,
          fetchBody,
          httpMiddleware: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
