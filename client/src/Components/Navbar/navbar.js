// Modules
import React, { useState } from 'react';
import { FiLogOut, FiMenu, FiPlus, FiPlusCircle, FiUser } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';

// Styles
import style from './navbar.module.css';

// Components
import NavList from '../Navlist/navList';
import SmallButton from '../Buttons/SmallButton/smallButton';
import RoundButton from '../Buttons/RoundButton/roundButton';

export default function Navbar(props) {
  const [showNav, setShowNav] = useState(false);
  const { navItemsList, handleCreateTrade, orientation } = props;
  const { isWideScreen, isMobile } = orientation;

  return (
    <nav
      className={`flex justify-content-center align-items-center ${style.container}`}>
      <div
        className={`flex justify-content-between align-items-center ${style.navContent}`}>
        <Link to='/'>
          <h2 className={`logo`}>JournalMe </h2>
        </Link>

        {/* Create Trade */}
        {isMobile && (
          <div className={`${style.userBtn}`} onClick={handleCreateTrade}>
            <RoundButton>
              <FiPlus className={style.userIcon} />
            </RoundButton>
          </div>
        )}

        {/* Navigation */}
        <div
          className={`${style.navlist} 
          ${!isWideScreen && showNav && style.showNavigation} 
          ${isWideScreen && style.navlistWideScreen}`}>
          <NavList
            showCancel={isMobile}
            smallScreen={isMobile}
            isWideScreen={isWideScreen}
            navItemsList={navItemsList}
            setShowNav={setShowNav}
          />
        </div>

        <div className={`flex ${style.btnHolder}`}>
          <div className={`flex align-items-center ${style.menuBtn}`}>
            {isWideScreen && (
              <div
                className={`${style.wideScreenButton}`}
                onClick={handleCreateTrade}>
                <SmallButton btnClick={handleCreateTrade}>
                  New Trade <FiPlus className={style.plusIcon} />
                </SmallButton>
              </div>
            )}
          </div>
          {!isWideScreen && (
            <div
              className={`flex align-items-center ${style.menuBtn}`}
              onClick={() => setShowNav(true)}>
              <FiMenu />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
