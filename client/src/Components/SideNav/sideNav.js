// Modules
import React, { useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

// Styles
import style from './sideNav.module.css';

// Components
import NavList from '../Navlist/navList';
import { FiPlus, FiUser } from 'react-icons/fi';
import SmallButton from '../Buttons/SmallButton/smallButton';
import RoundButton from '../Buttons/RoundButton/roundButton';

export default function SideNav(props) {
  const { navItemsList } = props;

  return (
    <aside className={`flex flex-col grey-bg ${style.container}`}>
      <div className={`flex justify-content-between align-items-center ${style.menuContainer}`}>
        <Link to='#'>
          <h2 className={`logo`}>JournalMe </h2>
        </Link>

        <div className={`flex justify-content-between ${style.userBtn}`}>
          <RoundButton>
            <FiUser className={style.userIcon} />
          </RoundButton>
        </div>
      </div>

      <div className={`flex justify-content-between ${style.navBtn}`}>
        <SmallButton>
          <h5 className={style.btnText}>New Trade</h5>
          <FiPlus className={style.plusIcon} />
        </SmallButton>
      </div>

      <div className={style.navigation}>
        <NavList
          showCancel={false}
          smallScreen={false}
          navItemsList={navItemsList}
        />
      </div>
    </aside>
  );
}
