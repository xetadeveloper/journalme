import React from 'react';

// Styles
import style from './wideJournal.module.css';
import SmallButton from '../../Buttons/SmallButton/smallButton';

export default function WideJournal(props) {
  const { showSmallJournal, chartImage, openJournalHandler, journal } = props;
  // console.log('Journal: ', journal);

  const {
    journalName,
    market,
    winningTrades,
    losingTrades,
    balance,
    journalID,
  } = journal;

  return (
    <div
      className={`
          flex flex-col grey-bg 
          ${style.journal}          
          ${showSmallJournal && style.smallJournal}`}>
      {/* Journal Info */}
      <h3 className={`${style.nameDetail}`}>{journalName}</h3>
      <div className={`flex`}>
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
            <img src={chartImage} className={style.chartImg} />
          </div>
        )}

        {/* Journal Account Details */}
        <div
          className={`flex flex-col align-items-center ${style.journalAcct}`}>
          <h4 className={style.journalBalance}>Balance: ${balance}</h4>
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
