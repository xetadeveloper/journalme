// Modules
import React, { useEffect, useState } from 'react';
import { monthsArray } from '../../../config';
import { useLocation } from 'react-router-dom';

// Styles
import style from './journalTrades.module.css';

// Components
import TradeSection from '../../../Components/TradeSection/tradeSection';
import ToggleSwitch from '../../../Components/ToggleSwitch/toggleSwitch';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import Modal from '../../../Components/Modals/modal';

export default function JournalTrades(props) {
  const { journals, isLoggedIn, username, strategies } = props;
  const { getJournalTrades, userID, journalTrades } = props;

  const [collapseTrades, setCollapseTrades] = useState(false);
  const [filteredTrades, setFilteredTrades] = useState([]);

  // console.log('Journals: ', journals);

  const initialFormData = {
    profitLoss: 'Select Option',
    leverage: '',
    strategy: 'Select Strategy',
    dateFrom: '',
    dateTo: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  // console.log('FormData: ', formData);
  const { search } = useLocation();
  const journalID = new URLSearchParams(search).get('journalID');

  // Use the journalID to find journal or make sure no two journals have the same name
  const journal =
    journals &&
    journals.find(journalItem => journalItem.journalID === journalID);

  // console.log('Journal Found: ', journal);

  const { journalName, market } = journal || {};
  const { trades, tradesNotFound } = journalTrades || {};

  useEffect(() => {
    if (isLoggedIn) {
      if (journals) {
        // console.log('There are journals in the store');
        if (journal) {
          // console.log('A journal was found');
          // console.log('Going to fetch trades from server');
          getJournalTrades(username, journalID);
        } else {
          // console.log('Journal was not found');
        }
      }
    }
  }, [isLoggedIn, journals, journal, username, userID, journalID]);

  // This function will filter all the date ranges and render a trade section for each range
  function createDateRanges(trades) {
    console.log('Trades: ', trades);
    let tradeSections = monthsArray.map((month, index) => {
      let filtered = trades.filter(
        trade => new Date(trade.entryDate).getMonth() === index
      );

      if (filtered.length) {
        const year = new Date(filtered[0].entryDate).getFullYear();

        // Change the way the dates are represented
        return (
          <TradeSection
            key={index}
            tradeList={filtered}
            monthRange={`${year} ${month}`}
            collapseTrades={collapseTrades}
            journalID={journalID}
          />
        );
      }
    });

    return tradeSections.length ? tradeSections : null;
  }

  // Used to filter trades on every render caused by the serach filters
  function searchTrades(evt) {
    setFormData(prev => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });

    // console.log('Checking Search Filters');
    const { trades } = journal;

    let localFormData = { ...formData, [evt.target.name]: evt.target.value };
    // console.log('Local FormData: ', localFormData);

    let filtered = trades.filter(trade => {
      let isMatchedTrade = true;

      // console.log('Trade Data Leverage: ', trade.leverage);
      // console.log('Form Data Leverage: ', localFormData.leverage);

      if (localFormData.profitLoss !== initialFormData.profitLoss) {
        if (
          localFormData.profitLoss === 'Profit' &&
          !(Number(trade.profitLoss) > 0)
        ) {
          isMatchedTrade = false;
        } else if (
          localFormData.profitLoss === 'Loss' &&
          !(Number(trade.profitLoss) < 0)
        ) {
          isMatchedTrade = false;
        }
      }
      if (
        localFormData.leverage !== initialFormData.leverage &&
        trade.leverage !== localFormData.leverage
      ) {
        isMatchedTrade = false;
      }
      if (
        localFormData.strategy !== initialFormData.strategy &&
        trade.strategy !== localFormData.strategy
      ) {
        isMatchedTrade = false;
      }
      if (localFormData.dateFrom !== initialFormData.dateFrom) {
        const entryDate = new Date(trade.entryDate);
        const matchDate = new Date(localFormData.dateFrom);
        if (entryDate <= matchDate) isMatchedTrade = false;
      }
      if (
        localFormData.dateTo !== initialFormData.dateTo &&
        trade.dateTo !== localFormData.dateTo
      ) {
        const entryDate = new Date(trade.entryDate);
        const matchDate = new Date(localFormData.dateTo);
        if (entryDate >= matchDate) isMatchedTrade = false;
      }

      return isMatchedTrade;
    });

    // console.log('Filtered Trades: ', filtered);

    setFilteredTrades(filtered.length ? filtered : ['No Trade']);
  }

  function renderOptions(optionList) {
    return optionList.map((option, index) => (
      <option key={index}>{option}</option>
    ));
  }

  return (
    <section className={`flex flex-col ${style.container}`}>
      <form hidden id='filterForm'></form>
      {/* Header */}
      <section
        className={`flex justify-content-between align-items-center  ${style.header}`}>
        <h2>{journalName} Trades</h2>
        <h4>
          Market: <span>{market}</span>
        </h4>
      </section>

      {/* Search Filters */}
      <section className={`flex flex-col ${style.searchFilters}`}>
        <h4 className={`${style.filterHeader}`}>Search Filters</h4>
        <div className={`flex justify-content-center ${style.filterHolder}`}>
          <div className={`${style.filterItem}`}>
            <h5>Profit/Loss</h5>
            <select
              onChange={searchTrades}
              name='profitLoss'
              defaultValue={formData.profitLoss}>
              <option>Select Option</option>
              {renderOptions(['Profit', 'Loss'])}
            </select>
          </div>

          <div className={`${style.filterItem}`}>
            <h5>Leverage</h5>
            <input
              type='number'
              placeholder='0'
              step='5'
              onChange={searchTrades}
              name='leverage'
              value={formData.leverage}
            />
          </div>

          <div className={`${style.filterItem}`}>
            <h5>Strategy</h5>
            <select
              onChange={searchTrades}
              name='strategy'
              value={formData.strategy}>
              <option>Select Strategy</option>
              {strategies && renderOptions(strategies)}
            </select>
          </div>

          <div className={`${style.filterItem}`}>
            <h5>Date Range</h5>
            <div>
              <div>
                <label>From</label>
                <input
                  type='date'
                  onChange={searchTrades}
                  name='dateFrom'
                  value={formData.dateFrom}
                />
              </div>

              <div>
                <label>To</label>
                <input
                  type='date'
                  onChange={searchTrades}
                  name='dateTo'
                  value={formData.dateTo}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Records List */}
      <section className={`flex flex-col ${style.tradeListHolder}`}>
        <div
          className={`flex align-items-center justify-content-between ${style.options}`}>
          <div className={`flex align-items-center ${style.showAllTrades}`}>
            <h5>Collapse Trades</h5>
            <div className={style.toggleHolder}>
              <ToggleSwitch
                toggleOn={collapseTrades}
                toggleHandler={() => {
                  setCollapseTrades(prev => !prev);
                }}
              />
            </div>
          </div>
          {trades && trades.length && (
            <div>
              <SmallButton
                btnText='Analyze Trades'
                clickHandler={() => {
                  console.log('Analyzing trades');
                }}
              />
            </div>
          )}
          <div>
            <SmallButton
              btnText='Reset Search Filters'
              clickHandler={() => {
                setFormData(initialFormData);
                setFilteredTrades([]);
              }}
            />
          </div>
        </div>
        <div>
          {filteredTrades[0] === 'No Trade' && <h4>No Trade Found</h4>}

          <Modal
            isLoggedIn={isLoggedIn}
            modalState={{
              show: !tradesNotFound && !trades,
              type: 'loading',
              message: 'Fetching Trades',
            }}
          />

          {trades && trades.length
            ? createDateRanges(filteredTrades.length ? filteredTrades : trades)
            : tradesNotFound
            ? 'No trades available for this journal'
            : ''}
        </div>
      </section>
    </section>
  );
}
