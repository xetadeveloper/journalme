// Modules
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Styles
import style from './tradeAnalysis.module.css';

// Components
import TradeChart from '../../../Components/TradeChart/tradeChart';
import { getJournalTrades } from '../../../Redux/Actions/appActions';
import { connect } from 'react-redux';

function TradeAnalysis(props) {
  const { userInfo, orientation, journalTrades } = props;

  // Redux Props
  const { getJournalTrades } = props;

  const { trades, tradesNotFound } = journalTrades || {};
  const { username, journals } = userInfo;

  //   console.log('Journal Trades: ', journalTrades);

  const { search } = useLocation();
  const journalID = new URLSearchParams(search).get('journalID');
  const journal =
    journals && journals.find(journal => journal.journalID === journalID);
  const { winningTrades, losingTrades, winRate, loseRate, journalName } =
    journal || {};

  const [chartData, setChartData] = useState({});

  // This retrieves trades from the database
  useEffect(() => {
    if (!journalTrades) {
      // Fetch trades
      getJournalTrades(username, journalID);
    }
  }, [journalTrades]);

  // This sets the chart data
  useEffect(() => {
    let dateData = [];
    let profitData = [];

    if (journalTrades && !journalTrades.tradesNotFound) {
      dateData = trades.map(trade => trade.entryDate);
      profitData = trades.map(trade => trade.pl);
    }

    // Chart Data
    const data = {
      labels: dateData,
      datasets: [
        {
          label: 'Profit',
          data: profitData.map(value => (value >= 0 ? value : null)),
          backgroundColor: 'green',
          borderWidth: 2,
          borderColor: 'green',
          borderRadius: 3,
        },
        {
          label: 'Loss',
          data: profitData.map(value => (value < 0 ? value : null)),
          backgroundColor: 'red',
          borderWidth: 2,
          borderColor: 'red',
          borderRadius: 3,
        },
      ],
    };

    setChartData(data);
  }, [journalTrades]);

  return (
    <div className={`${style.container}`}>
      <section
        className={`flex flex-col justify-content-center align-items-center ${style.chartContainer}`}>
        <TradeChart
          chartData={chartData}
          chartOptions={{
            wheelEnabled: true,
            panEnabled: true,
            pinchEnabled: true,
            showControls: true,
            chartTitle: {
              chartName: `${journalName} Analysis`,
              font: { size: 23, family: 'Arvo' },
            },
          }}
        />
      </section>
      <hr></hr>
      <div
        className={`flex flex-col justify-content-center align-items-center ${style.analysis}`}>
        <h2>Journal Trades Analysis</h2>
        <h4 className={`flex ${style.itemHolder}`}>
          <span className={`${style.analysisHeader}`}>No of Trades:</span>
          {winningTrades + losingTrades}
        </h4>
        <div className={`${style.analysisItem}`}>
          <h4 className={`flex ${style.itemHolder}`}>
            <span className={`${style.analysisHeader}`}>Winning Trades:</span>
            {winningTrades}
          </h4>
          <h4 className={`flex ${style.itemHolder}`}>
            <span className={`${style.analysisHeader}`}>Losing Trades:</span>
            {losingTrades}
          </h4>
          <h4 className={`flex ${style.itemHolder}`}>
            <span className={`${style.analysisHeader}`}>Win Rate:</span>
            {Math.round(winRate)}%
          </h4>
          <h4 className={`flex ${style.itemHolder}`}>
            <span className={`${style.analysisHeader}`}>Lose Rate:</span>
            {Math.round(loseRate)}%
          </h4>
        </div>
      </div>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    getJournalTrades: (username, journalID) =>
      dispatch(
        getJournalTrades({
          username,
          journalID,
          httpMiddleware: true,
          method: 'GET',
        })
      ),
  };
}

export default connect(null, mapDispatchToProps)(TradeAnalysis);
