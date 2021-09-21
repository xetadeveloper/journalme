import React, { useState } from 'react';

// Styles
import style from './standardNavbar.module.css';

// Components
import { FiBook, FiLogIn, FiMenu } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import RoundButton from '../Buttons/RoundButton/roundButton';

export default function StandardNavbar(props) {
  const { changeNavbar, isLoggedIn, userInfo, linkColor } = props;

  const [showNavList, setShowNavList] = useState(false);

  return (
    <nav className={`${style.navbarHolder} ${changeNavbar && style.greybg} `}>
      <div
        className={`flex justify-content-between align-items-center ${style.container} ${style.navbar}`}>
        <NavLink to='/' className={`${style[linkColor]} ${style.logo}`}>
          JournalMe
        </NavLink>
        {/* Navigation */}
        {/* Move this to the middle of the nav */}
        <div>
          <FiMenu
            className={`${style.menuIcon} ${style[linkColor]}`}
            onClick={() => {
              setShowNavList(prev => !prev);
            }}
          />
          <ul
            className={`flex justify-content-between align-items-center 
          ${style.navlist} ${showNavList && style.showNavList}`}>
            <li className={`${style.navItem} ${style[linkColor]}`}>
              <NavLink to='/'>Home</NavLink>
            </li>
            <li className={`${style.navItem} ${style[linkColor]}`}>
              <NavLink to='/about'>About</NavLink>
            </li>
            <li className={`${style.navItem} ${style[linkColor]}`}>
              <NavLink to='/contactus'>Contact Us</NavLink>
            </li>
            <li className={`${style.navItem} ${style[linkColor]}`}>
              <NavLink to='/blog'>Blog</NavLink>
            </li>
            <li
              className={`${style.navItem} ${style[linkColor]} ${style.loginTextLink}`}>
              <NavLink
                to={`${
                  isLoggedIn ? `/journal/${userInfo.username}` : '/login'
                }`}>
                {isLoggedIn ? 'Journals' : 'Login'}
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Do a user button here for login or signup */}
        <NavLink
          className={`${style.loginHolder}`}
          to={`${isLoggedIn ? `/journal/${userInfo.username}` : '/login'}`}>
          {isLoggedIn ? (
            <div className={`${style.loginBtn}`}>
              <RoundButton>
                <FiBook />
              </RoundButton>
            </div>
          ) : (
            <div className={`${style.loginBtn}`}>
              <RoundButton>
                <FiLogIn />
              </RoundButton>
            </div>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
