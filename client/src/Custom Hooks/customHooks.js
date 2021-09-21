import { useDispatch, useSelector } from 'react-redux';
import { deleteTrade, sendContactUsEmail } from '../Redux/Actions/appActions';
import { monthsArray } from '../config';
import TradeSection from '../Components/TradeSection/tradeSection';
import { useEffect, useState } from 'react';
import {
  resetDataDeletedFlag,
  resetSessionRestored,
} from '../Redux/Actions/flagActions';
import { useHistory } from 'react-router-dom';
import { reopenLastSession } from '../Redux/Actions/httpActions';

// Hook for deleting trades
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

// Hook used to create date ranges with Trade Section and Trade Item Components
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

// Hook for restoring user session
export function useSessionReset() {
  const dispatch = useDispatch();

  const [changeNavbar, setChangeNavbar] = useState(false);

  // Redux States
  const isLoggedIn = useSelector(state => state.app.isLoggedIn);
  const userInfo = useSelector(state => state.app.userInfo);
  const isSessionRestored = useSelector(state => state.flags.isSessionRestored);

  const history = useHistory();

  useEffect(() => {
    window.addEventListener('scroll', checkScroll);
    return () => {
      window.removeEventListener('scroll', checkScroll);
    };
  });

  // Handles the reopening of last saved session
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('Restoring session');
      dispatch(reopenLastSession({ httpMiddleware: true, method: 'GET' }));
    }
  }, [isLoggedIn, reopenLastSession]);

  // Handles reset rflag actions
  useEffect(() => {
    if (isSessionRestored) {
      console.log('Session Restored ...');
      dispatch(resetSessionRestored());
    }
  }, [isSessionRestored, history, userInfo.username, resetSessionRestored]);

  // Checks of the [age has scrolled past a place
  function checkScroll() {
    const navPosition = 50;

    // console.log('Scroll level: ', window.scrollY);
    if (window.scrollY >= navPosition) {
      setChangeNavbar(true);
    } else if (window.scrollY < navPosition) {
      setChangeNavbar(false);
    }
  }

  return {
    changeNavbar: changeNavbar,
    isLoggedIn: isLoggedIn,
    userInfo: userInfo,
  };
}

// Hook for observing elements and specifying animations
export function observeElement(
  element,
  elementHandler,
  observerOptions = {},
  once
) {
  // const [isVisible, setIsVisible] = useState(false);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        elementHandler();

        if (once) {
          observer.unobserve(element);
        }
      }
    });
  }, observerOptions);

  observer.observe(element);

  return { observer };
}

// Hook for sending mails
export function useSendMail() {
  const dispatch = useDispatch();
  return function (mail) {
    // Dispatch the send mail option
    dispatch(
      sendContactUsEmail({
        fetchBody: mail,
        httpMiddleware: true,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  };
}
