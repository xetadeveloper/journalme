// Modules
import React, { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { dummyJournals } from '../../dummyData';

// Redux
import { connect } from 'react-redux';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

// Styles
import style from './mainLayout.module.css';

// Components
import SideNav from '../../Components/SideNav/sideNav';
import Home from './Home/home';
import Navbar from '../../Components/Navbar/navbar';
import JournalTrades from './JournalTrades/journalTrades';
import TradeDetails from './TradeDetails/tradeDetails';

function MainLayout(props) {
  const isMobile = useMediaQuery({ query: '(max-width: 425px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });
  const isWideScreen = useMediaQuery({ query: '(min-width: 1441px)' });

  const { user, isLoggedIn } = props;

  const { path } = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/login');
    }
  });

  // Default Navigation List
  const navItemsList = [
    { linkName: 'Journals', linkPath: `${path}/${user}` },
    { linkName: 'Recent Trades', linkPath: `${path}/${user}/recenttrades` },
    {
      linkName: 'Preferences',
      linkPath: `${path}/${user}/preferences`,
      accordion: true,
      accordionList: [
        { linkName: 'Themes', linkPath: `${path}/${user}/preferences/themes` },
        {
          linkName: 'Profile',
          linkPath: `${path}/${user}/preferences/profile`,
        },
        {
          linkName: 'Strategies',
          linkPath: `${path}/${user}/preferences/profile`,
        },
      ],
    },
    { linkName: 'About Us', linkPath: '/about' },
    { linkName: 'Need Help?', linkPath: '/contactus' },
  ];

  return (
    <div
      className={`flex 
      ${(isMobile || isWideScreen) && 'flex-col'} 
      ${style.container}`}>
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
          <Route
            path={`${path}/:user/journaltrades/trade`}
            render={routeprops => (
              <TradeDetails
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
                journalInfo={dummyJournals}
              />
            )}
          />
          <Route
            path={`${path}/:user/journaltrades`}
            render={routeprops => (
              <JournalTrades
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
                journalInfo={dummyJournals}
              />
            )}
          />
          <Route
            path={`${path}/:user`}
            render={routeprops => (
              <Home
                {...routeprops}
                isMobile={isMobile}
                isTablet={isTablet}
                isWideScreen={isWideScreen}
                journalInfo={dummyJournals}
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
  const { user, isLoggedIn } = state.app;
  //   const {} = state.flags;
  return { user, isLoggedIn };
}

export default connect(mapStateToProps)(MainLayout);
