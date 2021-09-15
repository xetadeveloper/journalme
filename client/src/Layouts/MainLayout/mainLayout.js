// Modules
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { dummyJournals } from '../../dummyData';

// Redux
import { connect } from 'react-redux';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { getUserInfo, showError } from '../../Redux/Actions/appActions';
import {
  resetErrorFlag,
  resetLoginRedirect,
  resetSessionRestored,
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
import JournalPreferences from './JournalPreferences/journalPreferences';
import RecentTrades from './RecentTrades/recentTrades';
import SlidingModal from '../../Components/SlidingModal/slidingModal';
import CreateJournal from './CreateJournal/createJournal';
import TradeAnalysis from './TradeAnalysis/tradeAnalysis';

function MainLayout(props) {
  const isMobile = useMediaQuery({ query: '(max-width: 425px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });
  const isWideScreen = useMediaQuery({ query: '(min-width: 1441px)' });

  const orientation = { isMobile, isTablet, isWideScreen };

  // Props
  const { isLoggedIn, userInfo, getUserInfo, showError } = props;
  const { journalTrades, isError, error, resetErrorFlag } = props;
  const { resetSessionRestored, reopenLastSession, isSessionRestored } = props;
  const { loginRedirect, resetLoginRedirect, recentTrades } = props;
  const { userTrades } = props;

  // States
  const [slidingModals, setSlidingModals] = useState([]);
  const [modalState, setModalState] = useState({ show: false });

  const { username, journals, firstname, preferences, _id } = userInfo || {};
  const { strategies } = preferences || {};
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

      setSlidingModals(prev => [
        ...prev,
        {
          slidingState: {
            show: true,
            message: error.message,
          },
        },
      ]);
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

  // Creates Error or informational modals
  function createSlidingModals() {
    // console.log('Full Sliding MOdals State: ', slidingModals);

    return slidingModals.map((modalState, index) => {
      const { slidingState } = modalState;
      // console.log(`Modal State for modal ${index}: `, modalState);
      return (
        <SlidingModal
          key={index}
          modalIndex={index}
          slidingState={slidingState}
          slidingModals={slidingModals}
          setSlidingModals={setSlidingModals}
        />
      );
    });
  }

  // Redirects to trade creation page
  function handleCreateTrade(evt, error) {
    setModalState({
      show: true,
      type: 'selectModal',
      submitBtnText: 'Create Trade',
      error,
      inputData: [
        {
          inputName: 'journalName',
          optionList: journals.map(journal => journal.journalName),
          inputMsg: 'Select Journal For Trade?',
          placeholderOption: 'Select Journal',
          required: true,
          defaultOption: 'Select Journal',
        },
      ],
      actionHandler: (evt, formData) => {
        const { journalName } = formData;

        // console.log('Journal: ', journalName);

        if (journalName.value === journalName.placeholderOption) {
          const error = {
            type: 'inputerror',
            message: 'One or more required inputs have not been selected',
            errorFields: [
              {
                field: 'journalName',
                message: 'Select a journal',
              },
            ],
          };

          showError(error);
          handleCreateTrade(null, error);
          return;
        }

        const journalID = journals.find(
          journal => journal.journalName === journalName.value
        ).journalID;

        // console.log('JournalID in modal: ', journalID);

        setModalState({ show: false });

        history.push(
          `/journal/${username}/createTrade?journalID=${journalID}&createMode=true`
        );
      },
    });
  }

  return (
    <div
      className={`flex 
      ${(isMobile || isWideScreen) && 'flex-col'} 
      ${style.container}`}>
      {/* Loading modal */}
      <Modal
        isLoggedIn={isLoggedIn}
        modalState={{
          show: !firstname,
          type: 'loading',
          message: 'Fetching Data',
        }}
      />

      {/* Generic Modal */}
      <Modal modalState={modalState} setModalState={setModalState} />

      {/* Sliding Modal */}
      {slidingModals.length ? (
        <div className={`flex flex-col ${style.slidingModalHolder}`}>
          {createSlidingModals()}
        </div>
      ) : null}

      {isMobile || isWideScreen ? (
        <Navbar
          navItemsList={navItemsList}
          orientation={orientation}
          handleCreateTrade={handleCreateTrade}
        />
      ) : (
        <SideNav
          navItemsList={navItemsList}
          handleCreateTrade={handleCreateTrade}
        />
      )}

      <div className={`${style.pageHolder}`}>
        <Switch>
          {/* For displaying a trade's details */}
          <Route
            path={`${path}/:user/journaltrades/trade`}
            render={routeprops => (
              <TradeDetails
                {...routeprops}
                orientation={orientation}
                journalTrades={journalTrades}
                strategies={strategies}
                username={username}
              />
            )}
          />

          {/* For displaying trades analysis */}
          <Route
            path={`${path}/:user/journaltrades/analyzetrades`}
            render={routeprops => (
              <TradeAnalysis
                {...routeprops}
                orientation={orientation}
                userInfo={userInfo}
                journalTrades={journalTrades}
              />
            )}
          />

          {/* For displaying all trades of a journal */}
          <Route
            path={`${path}/:user/journaltrades`}
            render={routeprops => (
              <JournalTrades
                {...routeprops}
                orientation={orientation}
                isLoggedIn={isLoggedIn}
                strategies={strategies}
                journalTrades={journalTrades}
                userInfo={userInfo}
              />
            )}
          />

          {/* For displaying user profile */}
          <Route
            path={`${path}/:user/preferences/profile`}
            render={routeprops => (
              <Profile
                {...routeprops}
                userInfo={userInfo}
                isLoggedIn={isLoggedIn}
                orientation={orientation}
              />
            )}
          />

          {/* For displaying and editing settings */}
          <Route
            path={`${path}/:user/preferences/journalpreferences`}
            render={routeprops => (
              <JournalPreferences
                {...routeprops}
                userInfo={userInfo}
                orientation={orientation}
              />
            )}
          />

          {/* For displaying preferences */}
          <Route
            path={`${path}/:user/preferences`}
            render={routeprops => (
              <Preferences
                {...routeprops}
                orientation={orientation}
                username={username}
              />
            )}
          />

          {/* For displaying recent trades */}
          <Route
            path={`${path}/:user/recenttrades`}
            render={routeprops => (
              <RecentTrades
                {...routeprops}
                orientation={orientation}
                recentTrades={recentTrades}
                username={username}
                orientation={orientation}
              />
            )}
          />

          {/* For creating journals*/}
          <Route
            path={`${path}/:user/createJournal`}
            render={routeprops => (
              <CreateJournal
                {...routeprops}
                orientation={orientation}
                userInfo={userInfo}
              />
            )}
          />

          {/* For creating trades*/}
          <Route
            path={`${path}/:user/createTrade`}
            render={routeprops => (
              <TradeDetails
                {...routeprops}
                orientation={orientation}
                journalTrades={journalTrades}
                strategies={strategies}
                username={username}
              />
            )}
          />

          {/* For displaying all journals for a user */}
          <Route
            path={`${path}/:user`}
            render={routeprops => (
              <Home
                {...routeprops}
                orientation={orientation}
                journals={journals}
                userTrades={userTrades}
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
  const { recentTrades, userTrades } = state.app;
  const { isError, isSessionRestored, loginRedirect, isUpdated } = state.flags;

  return {
    isLoggedIn,
    userInfo,
    isError,
    error,
    journalTrades,
    isSessionRestored,
    loginRedirect,
    recentTrades,
    userTrades,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUserInfo: username =>
      dispatch(getUserInfo({ username, httpMiddleware: true, method: 'GET' })),

    reopenLastSession: () =>
      dispatch(reopenLastSession({ httpMiddleware: true, method: 'GET' })),

    resetErrorFlag: () => dispatch(resetErrorFlag()),

    resetSessionRestored: () => dispatch(resetSessionRestored()),

    resetLoginRedirect: () => dispatch(resetLoginRedirect()),

    showError: error => dispatch(showError(error)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
