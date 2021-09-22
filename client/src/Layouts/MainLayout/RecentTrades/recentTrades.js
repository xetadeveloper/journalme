// Modules
import React, { useEffect, useState } from 'react';
import { monthsArray } from '../../../config';

// Styles
import style from './recentTrades.module.css';

// Components
import TradeSection from '../../../Components/TradeSection/tradeSection';
import { getRecentTrades } from '../../../Redux/Actions/appActions';
import { connect } from 'react-redux';

function RecentTrades(props) {
  const { recentTrades, username, orientation } = props;

  // Redux Props
  const { getRecentTrades } = props;

  // States
  const [collapseTrades, setCollapseTrades] = useState(false);

  // Effects
  useEffect(() => {
    if (!recentTrades) {
      getRecentTrades();
    }
  }, [recentTrades]);

  // Handles rendering the trades
  function createDateRanges(trades) {
    // console.log('Trades: ', trades);
    let tradeSections = monthsArray.map((month, index) => {
      let filtered = trades.filter(
        trade => new Date(trade.entryDate).getMonth() === index
      );

      if (filtered.length) {
        const year = new Date(filtered[0].entryDate).getFullYear();

        return (
          <TradeSection
            key={index}
            tradeList={filtered}
            monthRange={`${year} ${month}`}
            username={username}
            orientation={orientation}
          />
        );
      }
    });

    return tradeSections.length ? tradeSections : null;
  }

  return (
    <section className={`flex flex-col container ${style.container}`}>
      <header className={`${style.header}`}>
        <h2>Recent Trades</h2>
      </header>

      <section className={`${style.tradesHolder}`}>
        {!recentTrades || recentTrades === 'NA'
          ? 'You have no trades'
          : recentTrades.length
          ? createDateRanges(recentTrades)
          : 'You have no recent trades'}
      </section>
    </section>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    getRecentTrades: () =>
      dispatch(
        getRecentTrades({
          httpMiddleware: true,
          method: 'GET',
        })
      ),
  };
}

export default connect(null, mapDispatchToProps)(RecentTrades);
