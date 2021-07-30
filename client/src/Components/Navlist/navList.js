// Modules
import React from 'react';
import { FiX } from 'react-icons/fi';

// Styles
import style from './navList.module.css';
import NavListItem from './NavListItem/navListItem';

export default function NavList(props) {
  const { setShowNav, showCancel, smallScreen, isWideScreen, navItemsList } =
    props;

  function renderNavItems(navItemsList) {
    return navItemsList.map((link, index) => {
      return (
        <NavListItem
          key={index}
          {...link}
          smallScreen={smallScreen}
          isWideScreen={isWideScreen}
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
        <div
          className={`${style.cancel}`}
          onClick={() => {
            setShowNav(false);
          }}>
          <FiX />
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
