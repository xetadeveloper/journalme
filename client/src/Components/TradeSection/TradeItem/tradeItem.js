// Modules
import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

// Styles
import style from './tradeItem.module.css';

export default function TradeItem(props) {
  const { trade, journalID } = props;
  const { entryDate, strategy, leverage, tradesize, pl, _id: tradeID } = trade;

  // const fullEntryDate = entryDate.split('T')[0];
  const dateObj = new Date(entryDate);
  // Construct Date Format
  const displayDate = `${dateObj.getDate()}-${
    dateObj.getMonth() < 10 ? '0' + dateObj.getMonth() : dateObj.getMonth()
  }-${dateObj.getFullYear()}`;

  const { url } = useRouteMatch();

  return (
    <NavLink
      to={`${url}/trade?journalID=${journalID}&tradeID=${tradeID}`}
      className={`${style.trade}`}>
      <h4>{displayDate}</h4>
      <h4>{strategy}</h4>
      <h4>x{leverage}</h4>
      <h4>${tradesize}</h4>
      <h4 className={pl > 0 ? style.profit : style.loss}>
        {pl > 0 ? `$${pl}` : `-$${Math.abs(pl)}`}
      </h4>
    </NavLink>
  );
}
