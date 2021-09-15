// Modules
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

// Styles
import style from './tradeDetails.module.css';

// Components
import { FiSettings, FiTrash2 } from 'react-icons/fi';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import TradeForm from './TradeForm/tradeForm';
import Modal from '../../../Components/Modals/modal';
import { useDeleteTrade } from '../../../Custom Hooks/customHooks';
import PagePrompt from '../../../Components/PagePrompt/pagePrompt';
import { connect } from 'react-redux';
import {
  resetDataCreatedFlag,
  resetDataUpdatedFlag,
} from '../../../Redux/Actions/flagActions';
import {
  createTrade,
  getJournalTrades,
  showError,
  updateTrade,
} from '../../../Redux/Actions/appActions';

function TradeDetails(props) {
  // Props
  const { journalTrades, strategies, username, orientation } = props;

  // Redux props
  const { createTrade, getJournalTrades } = props;
  const { updateTrade, isUpdated, resetDataUpdatedFlag } = props;
  const { resetDataCreatedFlag, isCreated, showError } = props;

  // Variables
  const tradeID = new URLSearchParams(useLocation().search).get('tradeID');
  const journalID = new URLSearchParams(useLocation().search).get('journalID');
  const createMode = new URLSearchParams(useLocation().search).get(
    'createMode'
  );
  const history = useHistory();
  const { url } = useRouteMatch();
  const homeURL = url.substr(0, url.lastIndexOf('/'));

  // console.log('JournalID: ', journalID);
  // console.log('Create Mode: ', createMode);
  const trade =
    journalTrades && journalTrades.trades.find(trade => trade._id == tradeID);
  // console.log('Journal Trades: ', journalTrades);
  // console.log('Trade Found: ', trade);

  const { strategy, tradesize, tradeStatus } = trade || {};
  const { entryTime, exitTime, entryDate } = trade || {};
  const { exitDate, leverage, commission, comment, pl } = trade || {};

  const formInitial = {
    tradeID: { required: true, value: tradeID },
    strategy: { required: true, value: strategy || '' },
    tradesize: { required: true, value: tradesize || '' },
    tradeStatus: { required: true, value: tradeStatus || '' },
    entryTime: { required: true, value: entryTime || '' },
    exitTime: { required: true, value: exitTime || '' },
    entryDate: {
      required: true,
      value: (entryDate && entryDate.split()[0]) || '',
    },
    exitDate: {
      required: true,
      value: (exitDate && exitDate.split()[0]) || '',
    },
    leverage: { required: true, value: leverage || '' },
    commission: { required: true, value: commission || '' },
    comment: { required: false, value: comment || '' },
    pl: { required: true, value: pl || '' },
  };

  if (createMode) {
    // When creating a new trade we remove tradeID field form the formData
    delete formInitial.tradeID;
  }

  // States
  const [formData, setFormData] = useState(formInitial);
  const [editMode, setEditMode] = useState(createMode || false);
  const [modalState, setModalState] = useState({ show: false });

  // console.log('Form Initial: ', formIntial);
  // console.log('FormData: ', formData);
  // console.log('Edit mode: ', editMode);

  // Hooks
  const deleteTrade = useDeleteTrade(username, journalID, setModalState);

  // Effects
  // Handles the fetching of trade details from server if not available
  useEffect(() => {
    if (!createMode && !journalTrades) {
      // console.log('No trade found going to fetch from server');
      getJournalTrades(username, journalID);
    }

    setFormData(formInitial);
  }, [journalTrades, createMode]);

  // Handles trade creation
  useEffect(() => {
    if (isCreated) {
      resetDataCreatedFlag();

      if (editMode) {
        setEditMode(false);
      }

      setModalState({
        show: true,
        type: 'message',
        message: 'Trade has been created!',
        modalCloseHandler: () => {
          history.push(homeURL);
        },
      });
    }
  }, [isCreated]);

  // Handles trade update
  useEffect(() => {
    if (isUpdated) {
      resetDataUpdatedFlag();
      setModalState({
        show: true,
        type: 'message',
        message: 'Trade has been updated',
        modalCloseHandler: () => {
          setEditMode(false);
        },
      });
    }
  }, [isUpdated]);

  function handleUpdate(evt) {
    evt.preventDefault();
    // console.log('Form Submitted...');
    // Validate form here and determine which input values to send

    const fetchBody = {};

    // console.log('FormData: ', formData);

    for (let elem in formData) {
      if (!(formData[elem].value === formInitial[elem].value)) {
        // console.log(`${elem} is different from initial`);
        fetchBody[elem] = formData[elem].value;
      }
    }

    fetchBody.tradeID = tradeID;
    fetchBody.journalID = journalID;
    fetchBody.prevPlValue = pl;

    // Handles the tradeStatus effect on the pl
    if (fetchBody.tradeStatus) {
      // If trade status changed
      if (fetchBody.tradeStatus === 'Lost') {
        if (fetchBody.pl) {
          fetchBody.pl = 0 - fetchBody.pl;
        } else {
          if (pl > 0) {
            // If pl was positive, make sure it's negative
            fetchBody.pl = 0 - pl;
          }
        }
      } else if (fetchBody.tradeStatus === 'Won') {
        if (fetchBody.pl) {
          fetchBody.pl = Math.abs(fetchBody.pl);
        } else {
          if (pl < 0) {
            fetchBody.pl = Math.abs(pl);
          }
        }
      }
    } else if (!fetchBody.tradeStatus && fetchBody.pl) {
      // If pl changed without tradestatus changing
      if (tradeStatus === 'Lost') {
        if (fetchBody.pl > 0) {
          fetchBody.pl = 0 - fetchBody.pl;
        }
      } else if (tradeStatus === 'Won') {
        if (fetchBody.pl > 0) {
          // If changed pl was positive, make sure it's negative
          fetchBody.pl = Math.abs(fetchBody.pl);
        }
      }
    }

    console.log("This is the form we're sending: ", fetchBody);

    // Send the form to server for update by calling redux update action
    updateTrade(username, fetchBody);
  }

  // Handles deletion confirmation
  function handleDeleteClick() {
    deleteTrade(trade, () => {
      if (editMode) {
        setEditMode(false);
      }
    });
  }

  // Handles trade creation
  function handleCreate(evt) {
    evt.preventDefault();
    let sendData = true;

    const tradeData = {};

    console.log('Data to be sent: ', formData);

    for (let prop in formData) {
      if (formData[prop].required && !formData[prop].value) {
        const error = {
          type: 'inputerror',
          message: 'One or more required inputs have not been filled',
          errorFields: [
            {
              field: prop,
            },
          ],
        };
        showError(error);
        sendData = false;
        break;
      } else {
        tradeData[prop] = formData[prop].value;
      }
    }

    if (sendData) {
      console.log('Journal ID: ', journalID);
      tradeData.journalID = journalID;
      if (tradeData.tradeStatus === 'Lost') {
        tradeData.pl = 0 - tradeData.pl;
      }

      console.log('Sending form: ', tradeData);
      createTrade(username, tradeData);
    }
  }

  // For confirming if user wants to cancel editing
  function confirmEditCancel() {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Cancel Editing',
      actionHandler: () => {
        setEditMode(false);
        setModalState({ show: false });
      },
    });
  }

  return (
    <div className={`flex flex-col grey-text ${style.container}`}>
      {/* Modal */}
      <Modal modalState={modalState} setModalState={setModalState} />
      <PagePrompt show={editMode} message='Cancel Trade Editing?' />

      <div
        className={` flex justify-content-between align-items-center ${style.header}`}>
        <h1 className={`${style.headerText}`}>
          {createMode ? 'New Trade' : 'Trade Details'}
        </h1>

        {!createMode && (
          <div className={`flex ${style.btnHolder}`}>
            <FiSettings
              className={`${editMode && style.editBtn}`}
              onClick={() => {
                if (editMode) {
                  confirmEditCancel();
                  setFormData(formInitial);
                } else {
                  setEditMode(true);
                }
              }}
            />
            <FiTrash2
              onClick={!editMode ? handleDeleteClick : undefined}
              className={`${editMode && style.btnDisabled}`}
            />
          </div>
        )}
      </div>
      <hr className={`${style.divider}`}></hr>
      <form className={`${style.formContainer}`} id='tradeForm'>
        <TradeForm
          editMode={editMode}
          formData={formData}
          strategyList={strategies}
          tradeStatusList={['Won', 'Lost']}
          setformData={setFormData}
          createMode={createMode}
        />
        {editMode && (
          <div
            className={`flex justify-content-between ${style.formBtnHolder}`}>
            <div className={`${style.formBtn}`}>
              <SmallButton
                btnText={createMode ? 'Create Trade' : 'Update Trade'}
                btnType='submit'
                clickHandler={createMode ? handleCreate : handleUpdate}
              />
            </div>
            <div className={`${style.formBtn}`}>
              <SmallButton btnText='Cancel' />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function mapStateToProps(state) {
  // const { journalTrades } = state.app;
  const { isUpdated, isCreated } = state.flags;

  return { isUpdated, isCreated };
}

function mapDispatchToProps(dispatch) {
  return {
    resetDataUpdatedFlag: () => dispatch(resetDataUpdatedFlag()),

    resetDataCreatedFlag: () => dispatch(resetDataCreatedFlag()),

    showError: error => dispatch(showError(error)),

    createTrade: (username, fetchBody) =>
      dispatch(
        createTrade({
          username,
          fetchBody,
          httpMiddleware: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),

    getJournalTrades: (username, journalID) =>
      dispatch(
        getJournalTrades({
          username,
          journalID,
          httpMiddleware: true,
          method: 'GET',
        })
      ),

    updateTrade: (username, fetchBody) =>
      dispatch(
        updateTrade({
          username,
          fetchBody,
          httpMiddleware: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TradeDetails);
