// Modules
import React, { useEffect, useRef, useState } from 'react';
import { monthsArray } from '../../../config';
import { connect } from 'react-redux';
import {
  NavLink as div,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

// Hooks
import {
  useCreateDateRanges,
  useDeleteTrade,
} from '../../../Custom Hooks/customHooks';

// Styles
import style from './journalTrades.module.css';

// Components
import ToggleSwitch from '../../../Components/ToggleSwitch/toggleSwitch';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import Modal from '../../../Components/Modals/modal';
import { FiChevronRight, FiMenu, FiSearch } from 'react-icons/fi';
import PagePrompt from '../../../Components/PagePrompt/pagePrompt';
import { getJournalTrades } from '../../../Redux/Actions/appActions';
import RoundButton from '../../../Components/Buttons/RoundButton/roundButton';

function JournalTrades(props) {
  const { isLoggedIn, strategies, userInfo, journalTrades } = props;
  const { orientation } = props;
  const { journals, username, _id: userID } = userInfo || {};
  const { isMobile, isTablet, isWideScreen } = orientation;

  // Redux Props
  const { getJournalTrades } = props;

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

  // States
  const [formData, setFormData] = useState(initialFormData);
  const [menuState, setMenuState] = useState(false);
  const [deleteMultipleState, setDeleteMultipleState] = useState(false);
  const [modalState, setModalState] = useState({ show: false });
  const [filterState, setFilterState] = useState(false);

  // console.log('FormData: ', formData);
  const { search } = useLocation();
  const journalID = new URLSearchParams(search).get('journalID');
  const { url } = useRouteMatch();
  console.log('URL: ', url);
  console.log('Search: ', search);
  const history = useHistory();

  // console.log('ID: ', journalID);

  // Use the journalID to find journal or make sure no two journals have the same name
  const journal =
    journals &&
    journals.find(journalItem => journalItem.journalID === journalID);

  // console.log('Journal Found: ', journal);

  const { journalName, market, balance, totalProfit } = journal || {};
  const { trades, tradesNotFound } = journalTrades || {};

  const searchRef = useRef();

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

  // Hooks
  // This hook will filter all the date ranges and render a trade section for each range
  const createDate = useCreateDateRanges({
    collapseTrades,
    username,
    orientation,
    showDelete: deleteMultipleState,
    tradeDelete: trade => {
      deleteTrade(trade);
    },
  });

  const deleteTrade = useDeleteTrade(username, journalID, setModalState);

  // Used to filter trades on every render caused by the serach filters
  function searchTrades(evt) {
    setFormData(prev => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });

    // console.log('Checking Search Filters');

    let localFormData = { ...formData, [evt.target.name]: evt.target.value };
    // console.log('Local FormData: ', localFormData);
    // console.log('Form Data: ', formData);

    let filtered = trades.filter(trade => {
      // console.log('Trade: ', trade);
      let isMatchedTrade = true;

      // console.log('Trade Data Leverage: ', trade.leverage);
      // console.log('Form Data Leverage: ', localFormData.leverage);

      if (localFormData.profitLoss !== initialFormData.profitLoss) {
        if (localFormData.profitLoss === 'Profit' && !(Number(trade.pl) > 0)) {
          isMatchedTrade = false;
        } else if (
          localFormData.profitLoss === 'Loss' &&
          !(Number(trade.pl) < 0)
        ) {
          isMatchedTrade = false;
        }
      }

      if (
        localFormData.leverage !== initialFormData.leverage &&
        trade.leverage !== Number(localFormData.leverage)
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
      <Modal modalState={modalState} setModalState={setModalState} />
      <PagePrompt
        show={deleteMultipleState}
        message={`Cancel Trades Deletion?`}
      />

      {/* Scrolls to the search filters */}
      {!deleteMultipleState && (
        <div
          className={`${style.searchFab}`}
          onClick={() => {
            window.scrollTo({
              top: searchRef.current.offsetTop,
              behavior: 'smooth',
            });
            setFilterState(true);
          }}>
          <RoundButton>
            <FiSearch className={`icon ${style.searchIcon}`} />
          </RoundButton>
        </div>
      )}

      {/* Header */}
      <section
        className={`flex justify-content-between align-items-center  ${style.header}`}>
        <h2 className={`${style.journalName}`}>{journalName} Trades</h2>
        <h4>
          Market: <span>{market}</span>
        </h4>
        <h4>
          Balance: <span>{balance > 0 ? `$${balance}` : `-$${balance}`}</span>
        </h4>
        {!isMobile && !isTablet && (
          <h4>
            Total Profit:{' '}
            <span>
              {totalProfit > 0
                ? `$${totalProfit}`
                : `-$${Math.abs(totalProfit)}`}
            </span>
          </h4>
        )}
        {/* For dropdown to delete multiple trades or edit journal */}
        <FiMenu
          className={`icon ${style.menuIcon}`}
          onClick={() => {
            setMenuState(prev => !prev);
          }}
        />
        <ul
          className={`flex flex-col ${style.dropdown} 
          ${menuState ? style.showMenu : style.hideMenu}`}>
          <li>
            <div
              to={`${url.substr(
                0,
                url.lastIndexOf('/')
              )}/createJournal?editmode=true&journalID=${journalID}`}>
              View Journal Details
            </div>
          </li>
          <li
            onClick={() => {
              setDeleteMultipleState(prev => !prev);
            }}>
            {deleteMultipleState ? 'Cancel Delete' : 'Delete Multiple Trades'}
          </li>
        </ul>
      </section>

      {/* Search Filters */}
      <section className={`flex flex-col ${style.searchFilters}`}>
        <div
          className={`flex align-items-center justify-content-center ${style.searchHeader}`}>
          <h4 className={`${style.filterHeader}`} ref={searchRef}>
            Search Filters
          </h4>
          <FiChevronRight
            onClick={() => {
              setFilterState(prev => !prev);
            }}
            className={`icon ${style.searchDrop} ${
              filterState && style.iconDown
            }`}
          />
        </div>
        <div
          className={`flex justify-content-center ${style.filterHolder} ${
            filterState && style.showFilters
          }`}>
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
            <div className={`${style.dateHolder}`}>
              <div className={`${style.dateItem}`}>
                <label>From</label>
                <input
                  type='date'
                  onChange={searchTrades}
                  name='dateFrom'
                  value={formData.dateFrom}
                />
              </div>

              <div className={`${style.dateItem}`}>
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
            <div className={style.btn}>
              <SmallButton
                btnText='Analyze Trades'
                clickHandler={() => {
                  console.log('Analyzing trades');
                  history.push(`${url}/analyzetrades?journalID=${journalID}`);
                }}
              />
            </div>
          )}
          <div className={style.btn}>
            <SmallButton
              btnText='Reset Filters'
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
            modalState={{
              show: !tradesNotFound && !trades,
              type: 'loading',
              message: 'Fetching Trades',
            }}
          />

          {trades && trades.length
            ? createDate(filteredTrades.length ? filteredTrades : trades)
            : tradesNotFound
            ? 'No trades available for this journal'
            : ''}
        </div>
      </section>
    </section>
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

export default connect(null, mapDispatchToProps)(JournalTrades);
