// Modules
import React from 'react';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';

// Styles
import style from './sideNav.module.css';

// Components
import NavList from '../Navlist/navList';
import { FiLogOut } from 'react-icons/fi';
import SmallButton from '../Buttons/SmallButton/smallButton';
import RoundButton from '../Buttons/RoundButton/roundButton';
import { FaPlus } from 'react-icons/fa';

export default function SideNav(props) {
  const { navItemsList, handleCreateTrade } = props;

  const history = useHistory();

  return (
    <aside className={`flex flex-col grey-bg ${style.container}`}>
      <div
        className={`flex justify-content-between align-items-center ${style.menuContainer}`}>
        <Link to='#'>
          <h2 className={`logo`}>JournalMe </h2>
        </Link>

        <div className={`${style.dropMenu}`}>
          <div
            className={`flex justify-content-between ${style.userBtn}`}
            onClick={e => {
              history.push('/logout');
            }}>
            <RoundButton>
              <FiLogOut className={style.userIcon} />
            </RoundButton>
          </div>
        </div>
      </div>

      <div
        className={`flex justify-content-between ${style.navBtn}`}
        onClick={handleCreateTrade}>
        <SmallButton>
          <h5 className={style.btnText}>New Trade</h5>
          <FaPlus className={style.plusIcon} />
        </SmallButton>
      </div>

      <div className={style.navigation}>
        <NavList
          showCancel={false}
          smallScreen={false}
          navItemsList={navItemsList}
          setShowNav={() => {}}
        />
      </div>
    </aside>
  );
}
