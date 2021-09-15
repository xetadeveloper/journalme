// Modules
import React from 'react';
import { FiTrash } from 'react-icons/fi';
import { NavLink as div, NavLink, useRouteMatch } from 'react-router-dom';

// Styles
import style from './tradeItem.module.css';

export default function TradeItem(props) {
  const { trade, username, showDelete, tradeDelete, orientation } = props;
  const { entryDate, strategy, leverage, tradesize, pl } = trade;
  const { _id: tradeID, journalID } = trade;

  const { isMobile, isTablet } = orientation;

  // const fullEntryDate = entryDate.split('T')[0];
  const dateObj = new Date(entryDate);
  // Construct Date Format
  const displayDate = `${dateObj.getDate()}-${
    dateObj.getMonth() + 1 < 10
      ? '0' + (dateObj.getMonth() + 1)
      : dateObj.getMonth() + 1
  }-${dateObj.getFullYear()}`;

  const { url } = useRouteMatch();

  return (
    <div>
      {!showDelete ? (
        <NavLink
          to={`/journal/${username}/journaltrades/trade?journalID=${journalID}&tradeID=${tradeID}`}
          className={`${style.trade} ${showDelete && style.tradeDelete}`}>
          <h4>{displayDate}</h4>
          {!isMobile && !isTablet && <h4>{strategy}</h4>}
          {!isMobile && !isTablet && <h4>x{leverage}</h4>}
          <h4>${tradesize}</h4>
          <h4 className={pl > 0 ? style.profit : style.loss}>
            {pl > 0 ? `$${pl}` : `-$${Math.abs(pl)}`}
          </h4>
          {showDelete && (
            <FiTrash
              className={`${style.deleteIcon}`}
              onClick={() => {
                tradeDelete(trade);
              }}
            />
          )}
        </NavLink>
      ) : (
        <div
          to={`/journal/${username}/journaltrades/trade?journalID=${journalID}&tradeID=${tradeID}`}
          className={`${style.trade} ${showDelete && style.tradeDelete}`}>
          <h4>{displayDate}</h4>
          {!isMobile && !isTablet && <h4>{strategy}</h4>}
          {!isMobile && !isTablet && <h4>x{leverage}</h4>}
          <h4>${tradesize}</h4>
          <h4 className={pl > 0 ? style.profit : style.loss}>
            {pl > 0 ? `$${pl}` : `-$${Math.abs(pl)}`}
          </h4>
          {showDelete && (
            <FiTrash
              className={`${style.deleteIcon}`}
              onClick={() => {
                tradeDelete(trade);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
