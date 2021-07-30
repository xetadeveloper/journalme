// Modules
import React, { useState } from 'react';

// Styles
import style from './tradeSection.module.css';

// Components
import { FiChevronRight } from 'react-icons/fi';
import TradeItem from './TradeItem/tradeItem';

export default function TradeSection(props) {
  const { monthRange, tradeList, collapseTrades, journalName } = props;
  const [showTradeList, setShowTradeList] = useState(false);

  function renderTrades(tradeList) {
    return tradeList.map(trade => (
      <TradeItem trade={trade} journalName={journalName} />
    ));
  }

  return (
    <section
      className={`${style.tradeSection}
        ${collapseTrades ? style.hideTradeList : style.showTradeList}
        ${showTradeList ? style.showTradeList : style.hideTradeList}`}>
      <div
        className={`flex justify-content-between align-items-center ${style.tradeMonth}`}>
        <h4>{monthRange}</h4>
        <FiChevronRight
          className={`
            ${collapseTrades ? style.caretUp : style.caretDown}
            ${showTradeList ? style.caretDown : style.caretUp}`}
          onClick={() => {
            setShowTradeList(prev => !prev);
          }}
        />
      </div>
      <div
        className={`${style.tradeList}
         `}>
        <div
          className={`brand-color-bg brand-white-text ${style.tradeHeader} `}>
          <h4>Date</h4>
          <h4>Strategy</h4>
          <h4>Leverage</h4>
          <h4>Trade Size</h4>
          <h4>Profit/Loss</h4>
        </div>
        {renderTrades(tradeList)}
      </div>
    </section>
  );
}
