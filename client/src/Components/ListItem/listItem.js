// Modules
import React from 'react';
import { NavLink } from 'react-router-dom';

// Styles
import style from './listItem.module.css';

export default function ListItem(props) {
  const { url, itemName, clickHandler } = props;

  return (
    <NavLink to={url} className={`${style.item}`} onClick={clickHandler}>
      {itemName}
    </NavLink>
  );
}
