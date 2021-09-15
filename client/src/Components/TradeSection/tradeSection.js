// Modules
import React, { useState } from 'react';

// Styles
import style from './tradeSection.module.css';

// Components
import { FiChevronRight } from 'react-icons/fi';
import TradeItem from './TradeItem/tradeItem';

export default function TradeSection(props) {
  const { monthRange, tradeList, collapseTrades, username, showDelete } = props;
  const { tradeDelete, orientation } = props;

  const { isMobile, isTablet } = orientation;

  // Statws
  const [showTradeList, setShowTradeList] = useState(false);

  function renderTrades(tradeList) {
    return tradeList.map((trade, index) => (
      <TradeItem
        key={index}
        trade={trade}
        username={username}
        showDelete={showDelete}
        tradeDelete={tradeDelete}
        orientation={orientation}
      />
    ));
  }

  return (
    <section
      className={`${style.tradeSection}
        ${
          collapseTrades !== undefined
            ? collapseTrades
              ? style.hideTradeList
              : style.showTradeList
            : ''
        }
        ${showTradeList ? style.showTradeList : style.hideTradeList}`}>
      <div
        className={`flex justify-content-between align-items-center ${style.tradeMonth}`}>
        <h4>{monthRange}</h4>
        <FiChevronRight
          className={`
            ${
              collapseTrades !== undefined
                ? collapseTrades === true
                  ? style.caretUp
                  : style.caretDown
                : ''
            }
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
          className={`brand-color-bg brand-white-text ${style.tradeHeader} 
          ${showDelete && style.tradeDelete} `}>
          <h4>Date</h4>
          {!isMobile && !isTablet && <h4>Strategy</h4>}
          {!isMobile && !isTablet && <h4>Leverage</h4>}
          <h4>Trade Size</h4>
          <h4>Profit/Loss</h4>
        </div>
        {renderTrades(tradeList)}
      </div>
    </section>
  );
}
