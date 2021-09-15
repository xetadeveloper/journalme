// Modules
import React from 'react';
import { FiLogOut, FiX } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import RoundButton from '../Buttons/RoundButton/roundButton';

// Styles
import style from './navList.module.css';
import NavListItem from './NavListItem/navListItem';

export default function NavList(props) {
  const { setShowNav, showCancel, smallScreen, isWideScreen, navItemsList } =
    props;

  // console.log('Props: ', props)

  function renderNavItems(navItemsList) {
    return navItemsList.map((link, index) => {
      return (
        <NavListItem
          key={index}
          {...link}
          smallScreen={smallScreen}
          isWideScreen={isWideScreen}
          setShowNav={setShowNav}
        />
      );
    });
  }

  return (
    <div
      className={`flex
       ${smallScreen && 'flex-col'} 
      ${style.container} ${isWideScreen && style.containerWide}
      ${smallScreen && style.fullHeight} `}>
      {/* Cancel Button */}
      {showCancel && !isWideScreen && (
        <div className={`flex align-items-center justify-content-between ${style.menuHolder}`}>
          <NavLink className={`${style.userBtn}`} to='/logout'>
            <RoundButton>
              <FiLogOut className={style.userIcon} />
            </RoundButton>
          </NavLink>
          <div
            className={`${style.cancel}`}
            onClick={() => {
              setShowNav(false);
            }}>
            <FiX />
          </div>
        </div>
      )}
      <ul
        className={`
        ${smallScreen && 'flex flex-col justify-content-center'} 
        ${style.navigation} ${isWideScreen && style.navlistWide}`}>
        {renderNavItems(navItemsList)}
      </ul>
    </div>
  );
}
