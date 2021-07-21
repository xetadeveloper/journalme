// Modules
import React, { useState } from 'react';
import { FiMenu, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import NavList from '../Navlist/navList';

// Styles
import style from './navbar.module.css';

export default function Navbar(props) {
  const [showNav, setShowNav] = useState(false);
  const { navItemsList } = props;

  return (
    <nav
      className={`flex justify-content-between align-items-center ${style.container}`}>
      <Link to='#'>
        <h2 className={`logo`}>JournalMe </h2>
      </Link>

      <div className={`flex`}>
        <div className={`flex align-items-center ${style.menuBtn}`}>
          <FiPlus />
        </div>
        <div
          className={`flex align-items-center ${style.menuBtn}`}
          onClick={() => setShowNav(true)}>
          <FiMenu />
        </div>
      </div>

      {/* Navigation */}
      <div className={`${style.navlist} ${showNav && style.showNavigation}`}>
        <NavList
          setShowNav={setShowNav}
          showCancel={true}
          smallScreen={true}
          navItemsList={navItemsList}
        />
      </div>
    </nav>
  );
}
