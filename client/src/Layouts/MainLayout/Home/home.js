// Modules
import React, { useEffect, useState } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

// Styles
import style from './home.module.css';

// Components
import SearchBar from '../../../Components/SearchBar/searchBar';
import ToggleSwitch from '../../../Components/ToggleSwitch/toggleSwitch';
import Journal from '../../../Components/Journal/journal';
import Modal from '../../../Components/Modals/modal';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import { FiRefreshCcw } from 'react-icons/fi';

export default function Home(props) {
  const { orientation, journals, userTrades, handleGetUserInfo } = props;
  const { isMobile, isWideScreen } = orientation;
  // console.log('JournalInfo: ', journals);

  const { url } = useRouteMatch();
  const [showSmallJournal, setShowSmallJournal] = useState(false);
  const [filteredJournals, setFilteredJournals] = useState(false);
  const [modalState, setModalState] = useState({ show: false });

  // console.log('Filtered Journals: ', filteredJournals);

  useEffect(() => {
    if (isWideScreen) {
      setShowSmallJournal(false);
    }
  }, [isWideScreen]);

  function renderJournals(journals) {
    if (filteredJournals && filteredJournals.length) {
      return filteredJournals.map((journal, index) => {
        // Find the trades for the journals
        const trades = userTrades.filter(
          trade => trade.journalID === journal.journalID
        );

        return (
          <div key={index}>
            <Journal
              orientation={orientation}
              showSmallJournal={showSmallJournal}
              journal={journal}
              trades={trades}
            />
          </div>
        );
      });
    } else if (!filteredJournals) {
      return journals.map((journal, index) => {
        // Find the trades for the journals
        const trades =
          userTrades &&
          userTrades.filter(trade => trade.journalID === journal.journalID);

        return (
          <div key={index}>
            <Journal
              orientation={orientation}
              showSmallJournal={showSmallJournal}
              journal={journal}
              trades={trades}
            />
          </div>
        );
      });
    }
  }

  function searchHandler(evt) {
    const searchText = evt.target.value;

    if (!searchText.trim()) {
      setFilteredJournals(false);
      return;
    }

    const filtered = journals.filter(journal => {
      const found = journal.journalName
        .toLowerCase()
        .startsWith(searchText.toLowerCase());
      return found;
    });

    setFilteredJournals(filtered);
  }

  // handles the refresh
  function handleRefresh(evt) {
    handleGetUserInfo();
  }

  return (
    <section
      className={` flex flex-col justify-content-center ${style.container}`}>
      <Modal modalState={modalState} setModalState={setModalState} />

      {/* Search and Journal Style Switch */}
      <section
        className={`flex align-items-center justify-content-between ${style.topBar}`}>
        {!isMobile && !isWideScreen && (
          <div
            className={`flex align-items-center justify-content-between ${style.firstNavItem}`}>
            <div onClick={handleRefresh}>
              <FiRefreshCcw className={`${style.refresh}`} />
            </div>
            <div className={`${style.toggleHolder}`}>
              <h5>Hide Chart</h5>
              <div className={` ${style.toggleSwitch}`}>
                <ToggleSwitch
                  toggleOn={showSmallJournal}
                  toggleHandler={setShowSmallJournal}
                />
              </div>
            </div>
          </div>
        )}

        {!isMobile && !isWideScreen && (
          <NavLink
            to={`${url}/createJournal`}
            className={style.createJournalBtn}>
            <SmallButton btnText='Create Journal' />
          </NavLink>
        )}

        <div className={style.searchField}>
          <SearchBar
            searchHandler={searchHandler}
            searchText='Search Journals'
          />
        </div>
      </section>
      
      {/* Body of the home */}
      {journals && journals.length ? (
        <section
          className={`${style.journalsHolder} ${
            showSmallJournal && style.smallJournals
          }`}>
          {renderJournals(journals)}
        </section>
      ) : (
        'No Journal Available'
      )}
    </section>
  );
}
