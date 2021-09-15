// Modules
import React, { useEffect, useState } from 'react';

// Components
import WideJournal from './WideJournal/wideJournal';
import TabletJournal from './TabletJournal/tabletJournal';
import MobileJournal from './MobileJournal/mobileJournal';
import { useHistory, useRouteMatch } from 'react-router-dom';

export default function Journal(props) {
  const { orientation, showSmallJournal, journal, trades } = props;
  const { isMobile, isTablet } = orientation;

  const history = useHistory();
  const { url } = useRouteMatch();

  const [chartData, setChartData] = useState({});

  // Handles setting the chart data
  useEffect(() => {
    let dateData = [];
    let profitData = [];

    if (trades) {
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
  }, [journal]);

  function openJournalHandler(journalID) {
    history.push(`${url}/journaltrades?journalID=${journalID}`);
  }

  // Render Appropriate View
  if (isMobile) {
    return (
      <MobileJournal
        journal={journal}
        openJournalHandler={openJournalHandler}
      />
    );
  } else if (isTablet) {
    return (
      <TabletJournal
        showSmallJournal={showSmallJournal}
        journal={journal}
        openJournalHandler={openJournalHandler}
        chartData={chartData}
      />
    );
  } else {
    return (
      <WideJournal
        showSmallJournal={showSmallJournal}
        journal={journal}
        openJournalHandler={openJournalHandler}
        chartData={chartData}
      />
    );
  }
}
