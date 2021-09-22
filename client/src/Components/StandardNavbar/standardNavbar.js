import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

// Styles
import style from './standardNavbar.module.css';

// Components
import { FiBook, FiMenu } from 'react-icons/fi';
import RoundButton from '../Buttons/RoundButton/roundButton';

export default function StandardNavbar(props) {
  const { changeNavbar, isLoggedIn, userInfo, linkColor } = props;

  const [showNavList, setShowNavList] = useState(false);
  const history = useHistory();

  return (
    <nav className={`${style.navbarHolder} ${changeNavbar && style.greybg} `}>
      <div
        className={`flex justify-content-between align-items-center ${style.container} ${style.navbar}`}>
        <div
          to='/'
          className={`flex justify-content-center align-items-center ${style[linkColor]} ${style.logo}`}>
          {/* <img src={logoImage} alt='JournalMe Logo' /> */}
          <div className={`flex justify-content-center align-items-center ${style.logoImg}`}>
            J
          </div>
          JournalMe
        </div>
        {/* Navigation */}
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
            {!isLoggedIn && (
              <li
                className={`${style.navItem} ${style[linkColor]} ${style.loginTextLink}`}>
                <NavLink to='/login?signup=true'>Sign Up</NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Do a user button here for login or signup */}
        <div className={`${style.loginHolder}`}>
          {isLoggedIn ? (
            <div
              className={`${style.roundLoginBtn}`}
              onClick={() => {
                history.push(`/journal/${userInfo.username}`);
              }}>
              <RoundButton>
                <FiBook />
              </RoundButton>
            </div>
          ) : (
            <div className={`flex ${style.btnGroup}`}>
              {/* Login btn */}
              <button
                className={`${style.loginBtn}`}
                onClick={() => {
                  history.push('/login');
                }}>
                Login
              </button>

              {/* Sign up btn */}
              <button
                className={`${style.loginBtn}`}
                onClick={() => {
                  history.push('/login?signup=true');
                }}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
