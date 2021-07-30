// Modules
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Styles
import style from './tradeDetails.module.css';

// Components
import { FiSettings, FiTrash2 } from 'react-icons/fi';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import TradeForm from './TradeForm/tradeForm';

export default function TradeDetails(props) {
  const { journalInfo } = props;
  const tradeID = new URLSearchParams(useLocation().search).get('tradeID');
  const journalName = new URLSearchParams(useLocation().search).get(
    'journalName'
  );

  const journal = journalInfo.find(
    journalItem => journalItem.name === journalName
  );

  const trade = journal.trades.find(trade => trade.tradeID == tradeID);

  const { strategy, tradeSize, tradeStatus } = trade;
  const { entryTime, exitTime, entryDate } = trade;
  const { exitDate, leverage, commission, comments, profitLoss } = trade;

  const formIntial = {
    tradeID,
    strategy: strategy || '',
    tradeSize: tradeSize || '',
    tradeStatus: tradeStatus || '',
    entryTime: entryTime || '',
    exitTime: exitTime || '',
    entryDate: entryDate || '',
    exitDate: exitDate || '',
    leverage: leverage || '',
    commission: commission || '',
    comments: comments || '',
    profitLoss: profitLoss || '',
  };

  const [formData, setformData] = useState(formIntial);
  const [editMode, seteditMode] = useState(false);

  // console.log('FormData: ', formData);

  function handleSubmit(evt) {
    evt.preventDefault();
    console.log('Form Submitted...');
    // Validate form here and determine which input values to send

    const formToSend = {};

    // console.log('FormData: ', formData);

    for (let elem in formData) {
      if (!(formData[elem] === formIntial[elem])) {
        // console.log(`${elem} is different from initial`);
        formToSend[elem] = formData[elem];
      }
    }

    // console.log("This is the form we're sending: ", formToSend);
    // Send the form to server for update by calling redux update action
  }

  return (
    <div className={`flex flex-col grey-text ${style.container}`}>
      <div
        className={` flex justify-content-between align-items-center ${style.header}`}>
        <h1>Trade Details</h1>
        <div className={`flex ${style.btnHolder}`}>
          <FiSettings
            className={`flex ${editMode && style.editBtn}`}
            onClick={() => {
              seteditMode(prev => !prev);
            }}
          />
          <FiTrash2 />
        </div>
      </div>
      <hr className={`${style.divider}`}></hr>
      <form
        action='/'
        className={`${style.formContainer}`}
        onSubmit={handleSubmit}
        id='tradeForm'>
        <TradeForm
          editMode={editMode}
          formData={formData}
          strategyList={journal.strategyList}
          tradeStatusList={['Won', 'Lost']}
          setformData={setformData}
        />
        {editMode && (
          <div
            className={`flex justify-content-between ${style.formBtnHolder}`}>
            <div className={`${style.formBtn}`}>
              <SmallButton btnText='Update Trade' btnType='submit' />
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
