// Modules
import React from 'react';
import { useMediaQuery } from 'react-responsive';

// Redux
import { connect } from 'react-redux';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import SideNav from '../../Components/SideNav/sideNav';
import Home from './Home/home';

// Style
import style from './mainLayout.module.css';
import Navbar from '../../Components/Navbar/navbar';

function MainLayout(props) {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const { user, isLoggedIn } = props;

  const { path } = useRouteMatch();

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
    <div className={`flex ${isMobile && 'flex-col'} ${style['container']}`}>
      {isMobile ? (
        <Navbar navItemsList={navItemsList} />
      ) : (
        <SideNav navItemsList={navItemsList} />
      )}

      <Switch>
        <Route
          path={`${path}/:user`}
          render={routeprops => <Home {...routeprops} />}
        />
      </Switch>
    </div>
  );
}

function mapStateToProps(state) {
  console.log('State: ', state);
  const { user, isLoggedIn } = state.app;
  //   const {} = state.flags;
  return { user, isLoggedIn };
}

export default connect(mapStateToProps)(MainLayout);
