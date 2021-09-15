import { useDispatch, useSelector } from 'react-redux';
import { deleteTrade } from '../Redux/Actions/appActions';
import { monthsArray } from '../config';
import TradeSection from '../Components/TradeSection/tradeSection';
import { useEffect } from 'react';
import { resetDataDeletedFlag } from '../Redux/Actions/flagActions';
import { useHistory } from 'react-router-dom';

// Hook for deleteing trades
export function useDeleteTrade(username, journalID, setModalState) {
  const dispatch = useDispatch();
  const isDeleted = useSelector(state => state.flags.isDeleted);
  const history = useHistory();

  useEffect(() => {
    if (isDeleted) {
      dispatch(resetDataDeletedFlag());
      setModalState({
        show: true,
        type: 'message',
        message: 'Trade has been deleted',
        modalCloseHandler: () => {
          // go back to journalTrades
          history.push(
            `/journal/${username}/journaltrades?journalID=${journalID}`
          );
        },
      });
    }
  }, [isDeleted]);

  return function (trade, modalCloseHandler) {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Do you want to delete this trade?',
      actionHandler: () => {
        dispatch(
          deleteTrade({
            username,
            fetchBody: trade,
            httpMiddleware: true,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      },
      modalCloseHandler,
    });
  };
}

export function useCreateDateRanges(props) {
  return function (trades) {
    // console.log('Trades: ', trades);
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
            {...props}
          />
        );
      }
    });

    return tradeSections.length ? tradeSections : null;
  };
}
