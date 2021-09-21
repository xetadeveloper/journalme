import React from 'react';

// Styles
import style from './wideJournal.module.css';
import SmallButton from '../../Buttons/SmallButton/smallButton';
import TradeChart from '../../TradeChart/tradeChart';

export default function WideJournal(props) {
  const { showSmallJournal, openJournalHandler, journal, chartData } = props;
  // console.log('Journal: ', journal);

  const { journalName, market, winningTrades, losingTrades } = journal;
  const { balance, journalID } = journal;

  return (
    <div
      className={`
          flex flex-col grey-bg 
          ${style.journal}          
          ${showSmallJournal && style.smallJournal}`}>
      {/* Journal Info */}
      <h3 className={`${style.nameDetail}`}>{journalName}</h3>
      <div className={`flex ${style.detailHolder}`}>
        <div
          className={`flex flex-col align-items-center ${style.journalInfo}`}>
          <div className={`flex flex-col ${style.journalDetails}`}>
            <h4 className={style.currencyDetail}>
              Market: <span>{market} </span>
            </h4>
          </div>
          <div className={`flex flex-col ${style.progressDetails}`}>
            <h4 className={style.detail}>
              No. Of Trades <span>{winningTrades + losingTrades}</span>
            </h4>
            <h4 className={style.detail}>
              No. Of Wins <span>{winningTrades}</span>
            </h4>
            <h4 className={style.detail}>
              No. Of Losses <span>{losingTrades}</span>
            </h4>
          </div>
        </div>

        {/* Chart Display */}
        {!showSmallJournal && (
          <div className={`${style.chart}`}>
            {/* Show chart here */}
            <TradeChart
              chartData={chartData}
              chartOptions={{
                panEnabled: true,
                chartTitle: {
                  chartName: 'Trades Analysis',
                  font: { size: 18, family: 'Arvo' },
                },
              }}
            />
          </div>
        )}

        {/* Journal Account Details */}
        <div
          className={`flex flex-col align-items-center ${style.journalAcct}`}>
          <h4 className={style.journalBalance}>
            Balance:
            <span className={`${balance >= 0 ? style.profit : style.loss}`}>
              {balance >= 0 ? `$${balance}` : `-$${Math.abs(balance)}`}
            </span>
          </h4>
          <div className={style.openJournalBtn}>
            <SmallButton
              btnType='button'
              btnText='Open Journal'
              clickHandler={() => {
                openJournalHandler(journalID);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
