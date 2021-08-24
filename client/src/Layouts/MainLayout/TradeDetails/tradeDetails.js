// Modules
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Styles
import style from './tradeDetails.module.css';

// Components
import { FiSettings, FiTrash2 } from 'react-icons/fi';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import TradeForm from './TradeForm/tradeForm';
import Modal from '../../../Components/Modals/modal';

export default function TradeDetails(props) {
  // Props
  const { getJournalTrades, journalTrades, strategies } = props;
  const { isLoggedIn, username, updateTrade } = props;
  const { isUpdated, resetDataUpdatedFlag, isDeleted } = props;
  const { resetDataDeletedFlag, deleteTrade } = props;

  // Variables
  const tradeID = new URLSearchParams(useLocation().search).get('tradeID');
  const journalID = new URLSearchParams(useLocation().search).get('journalID');
  const history = useHistory();

  const trade =
    journalTrades && journalTrades.trades.find(trade => trade._id == tradeID);
  // console.log('Journal Trades: ', journalTrades);
  // console.log('Trade Found: ', trade);

  const { strategy, tradesize, tradeStatus } = trade || {};
  const { entryTime, exitTime, entryDate } = trade || {};
  const { exitDate, leverage, commission, comment, pl } = trade || {};

  // console.log('Leverage: ', leverage);

  const formIntial = {
    tradeID,
    strategy: strategy || '',
    tradesize: tradesize || '',
    tradeStatus: tradeStatus || '',
    entryTime: entryTime || '',
    exitTime: exitTime || '',
    entryDate: (entryDate && entryDate.split()[0]) || '',
    exitDate: (exitDate && exitDate.split()[0]) || '',
    leverage: leverage || '',
    commission: commission || '',
    comment: comment || '',
    pl: pl || '',
  };

  // States
  const [formData, setFormData] = useState(formIntial);
  const [editMode, setEditMode] = useState(false);
  const [modal, setModal] = useState({ show: false });

  // console.log('Form Initial: ', formIntial);
  // console.log('FormData: ', formData);

  // Handles the fetching of trade details from server if not available
  useEffect(() => {
    if (!journalTrades) {
      // console.log('No trade found going to fetch from server');
      getJournalTrades(username, journalID);
    }

    setFormData(formIntial);
  }, [journalTrades]);

  // Handles trade update
  useEffect(() => {
    if (isUpdated) {
      resetDataUpdatedFlag();
      setModal({
        show: true,
        type: 'message',
        message: 'Trade has been updated',
        modalCloseHandler: () => {
          setEditMode(false);
        },
      });
    }
  }, [isUpdated]);

  // Handles trade deletion
  useEffect(() => {
    if (isDeleted) {
      resetDataDeletedFlag();
      setModal({
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

  function handleUpdate(evt) {
    evt.preventDefault();
    console.log('Form Submitted...');
    // Validate form here and determine which input values to send

    const fetchBody = {};

    // console.log('FormData: ', formData);

    for (let elem in formData) {
      if (!(formData[elem] === formIntial[elem])) {
        // console.log(`${elem} is different from initial`);
        fetchBody[elem] = formData[elem];
      }
    }

    fetchBody.tradeID = tradeID;

    console.log("This is the form we're sending: ", fetchBody);

    // Send the form to server for update by calling redux update action
    updateTrade(username, fetchBody);
  }

  // Handles deletion confirmation
  function handleDeleteClick() {
    setModal({
      show: true,
      type: 'confirm',
      message: 'Do you want to delete this trade?',
      actionHandler: () => {
        deleteTrade(username, { tradeID });
      },
      modalCloseHandler: () => {
        if (editMode) {
          setEditMode(false);
        }
      },
    });
  }

  return (
    <div className={`flex flex-col grey-text ${style.container}`}>
      {/* Modal */}
      <Modal
        isLoggedIn={isLoggedIn}
        modalState={modal}
        setModalState={setModal}
      />

      <div
        className={` flex justify-content-between align-items-center ${style.header}`}>
        <h1>Trade Details</h1>
        <div className={`flex ${style.btnHolder}`}>
          <FiSettings
            className={`${editMode && style.editBtn}`}
            onClick={() => {
              setEditMode(prev => !prev);
            }}
          />
          <FiTrash2
            onClick={!editMode && handleDeleteClick}
            className={`${editMode && style.btnDisabled}`}
          />
        </div>
      </div>
      <hr className={`${style.divider}`}></hr>
      <form
        className={`${style.formContainer}`}
        onSubmit={handleUpdate}
        id='tradeForm'>
        <TradeForm
          editMode={editMode}
          formData={formData}
          strategyList={strategies}
          tradeStatusList={['Won', 'Lost']}
          setformData={setFormData}
        />
        {editMode && (
          <div
            className={`flex justify-content-between ${style.formBtnHolder}`}>
            <div className={`${style.formBtn}`}>
              <SmallButton
                btnText='Update Trade'
                btnType='submit'
                clickHandler={handleUpdate}
              />
            </div>
            <div>
              <SmallButton btnText='Cancel Edit' />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
