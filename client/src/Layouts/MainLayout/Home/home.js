// Modules
import React, { useEffect, useState } from 'react';

// Styles
import style from './home.module.css';

// Components
import SearchBar from '../../../Components/SearchBar/searchBar';
import ToggleSwitch from '../../../Components/ToggleSwitch/toggleSwitch';
import Journal from '../../../Components/Journal/journal';

export default function Home(props) {
  const { isMobile, isWideScreen, isTablet, journalInfo } = props;

  // console.log('JournalInfo: ', journalInfo);

  const [showSmallJournal, setShowSmallJournal] = useState(false);
  const [filteredJournals, setFilteredJournals] = useState([]);

  // console.log('Filtered Journals: ', filteredJournals);

  useEffect(() => {
    if (isWideScreen) {
      setShowSmallJournal(false);
    }
  }, [isWideScreen]);

  function renderJournals(journals) {
    if (filteredJournals.length) {
      return filteredJournals.map((journal, index) => (
        <div key={index}>
          <Journal
            isMobile={isMobile}
            isWideScreen={isWideScreen}
            isTablet={isTablet}
            showSmallJournal={showSmallJournal}
            journal={journal}
          />
        </div>
      ));
    } else {
      return journals.map((journal, index) => (
        <div key={index}>
          <Journal
            isMobile={isMobile}
            isWideScreen={isWideScreen}
            isTablet={isTablet}
            showSmallJournal={showSmallJournal}
            journal={journal}
          />
        </div>
      ));
    }
  }

  function searchHandler(evt) {
    const searchText = evt.target.value;

    const filtered = journalInfo.filter(
      journal =>
        journal.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
    );

    setFilteredJournals(filtered);
  }

  return (
    <section
      className={` flex flex-col justify-content-center ${style.container}`}>
      {/* {isWideScreen && 'What a Wide Screen!'} */}
      {
        /* Search and Theme Switch */
        !isMobile && !isWideScreen && (
          <section
            className={`flex align-items-center justify-content-between ${style.topBar}`}>
            <div
              className={`flex align-items-center justify-content-between ${style.toggleHolder}`}>
              Hide Chart
              <div className={` ${style.toggleSwitch}`}>
                <ToggleSwitch
                  toggleOn={showSmallJournal}
                  toggleHandler={setShowSmallJournal}
                />
              </div>
            </div>
            <SearchBar
              searchHandler={searchHandler}
              searchText='Search Journals'
            />
          </section>
        )
      }

      {/* Body of the home */}
      <section
        className={`${style.journalsHolder} ${
          showSmallJournal && style.smallJournals
        }`}>
        {renderJournals(journalInfo)}
      </section>
    </section>
  );
}
