// Modules
import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

// Styles
import style from './sideNav.module.css';
import { FiMenu, FiPlus } from 'react-icons/fi';
import NavList from '../Navlist/navList';

export default function SideNav(props) {
  const { navItemsList } = props;

  return (
    <aside className={`${style.container} `}>
      <div
        className={`flex flex-col justify-content-between ${style.menuContainer}`}>
        <Link to='#'>
          <h2 className={`logo`}>JournalMe </h2>
        </Link>

        <button
          className={` flex 
          justify-content-center align-items-center ${style.bigBtn} brand-color-bg`}>
          New Trade
          <FiPlus />
        </button>
      </div>

      <div>
        <NavList
          showCancel={false}
          smallScreen={false}
          navItemsList={navItemsList}
        />
      </div>
    </aside>
  );
}
