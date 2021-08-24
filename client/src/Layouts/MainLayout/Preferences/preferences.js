// Modules
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

// Components
import ListItem from '../../../Components/ListItem/listItem';

// Styles
import style from './preferences.module.css';

export default function Preferences(props) {
  const { url } = useRouteMatch();

  return (
    <div className={`flex flex-col ${style.container}`}>
      <div className={`${style.header}`}>
        <h1>Preferences</h1>
      </div>

      <div className={`flex flex-col ${style.listHolder}`}>
        <ListItem url={`${url}/profile`} itemName='User Profile' />
        <ListItem url={`${url}/settings`} itemName='Settings' />
        <ListItem url={`${url}/themes`} itemName='Themes' />
      </div>
    </div>
  );
}
