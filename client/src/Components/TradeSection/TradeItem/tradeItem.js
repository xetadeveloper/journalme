// Modules
import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

// Styles
import style from './tradeItem.module.css';

export default function TradeItem(props) {
  const { trade, journalName } = props;
  const { entryDate, strategy, leverage, tradeSize, profitLoss, tradeID } =
    trade;

  const { url } = useRouteMatch();

  return (
    <NavLink
      to={`${url}/trade?journalName=${journalName}&tradeID=${tradeID}`}
      className={`${style.trade}`}>
      <h4>{entryDate}</h4>
      <h4>{strategy}</h4>
      <h4>x{leverage}</h4>
      <h4>${tradeSize}</h4>
      <h4 className={profitLoss > 0 ? style.profit : style.loss}>
        {profitLoss > 0 ? `$${profitLoss}` : `-$${Math.abs(profitLoss)}`}
      </h4>
    </NavLink>
  );
}
