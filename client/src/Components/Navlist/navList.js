// Modules
import React from 'react';
import { FiX } from 'react-icons/fi';

// Styles
import style from './navList.module.css';
import NavListItem from './NavListItem/navListItem';

export default function NavList(props) {
  const { setShowNav, showCancel, smallScreen, navItemsList } = props;

  function renderNavItems(navItemsList) {
    return navItemsList.map((link, index) => {
      return <NavListItem key={index} {...link} smallScreen={smallScreen} />;
    });
  }

  return (
    <div
      className={`flex flex-col ${style.container} ${
        smallScreen && style.fullHeight
      }`}>
      {/* Cancel Button */}
      {showCancel && (
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
        ${style.navigation}`}>
        {renderNavItems(navItemsList)}
      </ul>
    </div>
  );
}
