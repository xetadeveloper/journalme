// Modules
import React from 'react';

// Components
import chartImage from '../../Images/Chart@1x.png';
import WideJournal from './WideJournal/wideJournal';
import TabletJournal from './TabletJournal/tabletJournal';
import MobileJournal from './MobileJournal/mobileJournal';
import { useHistory, useRouteMatch } from 'react-router-dom';

export default function Journal(props) {
  const { isMobile, isWideScreen, isTablet, showSmallJournal, journal } = props;


  const history = useHistory();
  const { url } = useRouteMatch();

  function openJournalHandler(journalID) {
    history.push(`${url}/journaltrades?journalID=${journalID}`);
  }

  // Render Appropriate View
  if (isMobile) {
    return (
      <MobileJournal
        chartImage={chartImage}
        showSmallJournal={showSmallJournal}
        journal={journal}
        openJournalHandler={openJournalHandler}
      />
    );
  } else if (isTablet) {
    return (
      <TabletJournal
        chartImage={chartImage}
        showSmallJournal={showSmallJournal}
        journal={journal}
        openJournalHandler={openJournalHandler}
      />
    );
  } else {
    return (
      <WideJournal
        chartImage={chartImage}
        showSmallJournal={showSmallJournal}
        journal={journal}
        openJournalHandler={openJournalHandler}
      />
    );
  }
}
