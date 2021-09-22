// Modules
import React, { useEffect, useState } from 'react';
import { FiLoader, FiSettings, FiTrash2 } from 'react-icons/fi';
import { connect } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import Modal from '../../../Components/Modals/modal';
import PagePrompt from '../../../Components/PagePrompt/pagePrompt';

// Hooks
import {
  createJournal,
  deleteJournal,
  updateJournal,
} from '../../../Redux/Actions/appActions';
import {
  resetDataDeletedFlag,
  resetDataUpdatedFlag,
} from '../../../Redux/Actions/flagActions';

// Styles
import style from './createJournal.module.css';

function CreateJournal(props) {
  const { userInfo } = props;
  const { username, journals } = userInfo;

  // Redux Props
  const { isUpdated, isDeleted, resetDataDeletedFlag } = props;
  const { createJournal, resetDataUpdatedFlag } = props;
  const { deleteJournal, updateJournal, isError } = props;

  const history = useHistory();
  const { url } = useRouteMatch();
  const parentURL = url.substr(0, url.lastIndexOf('/'));
  const { search } = useLocation();
  const editMode = new URLSearchParams(search).get('editmode');
  const journalID = new URLSearchParams(search).get('journalID');

  // Get journal data
  const journal =
    journals && journals.find(journal => journal.journalID === journalID);

  const { journalName, journalDesc, market, startCapital } = journal || {};

  // console.log('Journal: ', journal);

  let initialForm = {
    journalName: journalName || '',
    journalDesc: journalDesc || '',
    market: market || '',
    startCapital: startCapital || '',
  };

  // States
  const [formData, setFormData] = useState(initialForm);
  const [modalState, setModalState] = useState({ show: false });
  const [editJournal, setEditJournal] = useState(editMode ? false : true);
  const [isOperationOn, setIsOperationOn] = useState(false);

  // console.log('Is operation on?: ', isOperationOn);
  // Effects
  // Handles succesful updates
  useEffect(() => {
    if (isUpdated) {
      setModalState({
        show: true,
        type: 'message',
        message: `${
          editMode ? 'Journal Updated!' : 'Journal Has Been Created!'
        }`,
        modalCloseHandler: () => {
          if (editMode) {
            setModalState({ show: false });
            setEditJournal(false);
          } else {
            history.push(parentURL);
          }
        },
      });

      setIsOperationOn(false);
      setEditJournal(false);
      resetDataUpdatedFlag();
    }
  }, [isUpdated]);

  // Handles toggling disabled mode between button
  useEffect(() => {
    if (isError && isOperationOn) {
      setIsOperationOn(false);
    }
  }, [isError]);

  // Handles successful journal deletion
  useEffect(() => {
    if (isDeleted) {
      resetDataDeletedFlag();
      setModalState({
        show: true,
        type: 'message',
        message: 'Journal Deleted!',
        modalCloseHandler: () => {
          history.push(parentURL);
        },
      });
    }
  }, [isDeleted]);

  // Handles retrieval of journal info
  useEffect(() => {
    if (editMode) {
      setFormData({
        journalName: journalName || '',
        journalDesc: journalDesc || '',
        market: market || '',
        startCapital: startCapital || '',
      });
    }
  }, [editMode, journals]);

  // console.log('Form Data: ', formData);

  // Handles input change
  function handleInputChange(evt) {
    const inputName = evt.target.name;
    const inputValue = evt.target.value;

    setFormData(prev => {
      return { ...prev, [inputName]: inputValue };
    });
  }

  // Sends journal to server to be created
  function addJournal(evt) {
    evt.preventDefault();
    setIsOperationOn(true);
    formData.market = formData.market.toUpperCase();

    // console.log('Form to send: ', formData);
    createJournal(username, formData);
  }

  function cancelCreate() {
    setModalState({
      show: true,
      type: 'confirm',
      message: `Cancel journal ${editMode ? 'editing' : 'creation'}?`,
      actionHandler: () => {
        editMode ? setEditJournal(false) : history.push(parentURL);
        setModalState({ show: false });
      },
    });
  }

  // Handles journal deletion
  function handleDelete() {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Do you want to delete this journal?',
      actionHandler: () => {
        // Delete the journal
        formData.journalID = journalID;
        // console.log('Deleting journal: ', formData);
        deleteJournal(username, formData);
      },
    });
  }

  // Handles journal updating
  function updateHandler(evt) {
    evt.preventDefault();
    setIsOperationOn(true);
    // Update Journal
    let fetchBody = {};

    const journal =
      journals && journals.find(journal => journal.journalID === journalID);

    const { journalName, journalDesc, market, startCapital, balance } =
      journal || {};

    // console.log('Balance: ', balance);

    const initialData = { journalName, journalDesc, market, startCapital };

    for (let prop in formData) {
      if (!(formData[prop] === initialData[prop])) {
        // console.log(`${prop} is different from initial`);
        fetchBody[prop] = formData[prop];
      }
    }

    fetchBody.journalID = journalID;
    if (fetchBody.market) {
      fetchBody.market = fetchBody.market.toUpperCase();
    }

    if (fetchBody.startCapital) {
      fetchBody.oldStartCapital = initialData.startCapital;
      fetchBody.oldBalance = balance;
    }
    // console.log('Initial Form Data: ', initialData);

    // console.log('Data to be updated: ', fetchBody);

    updateJournal(username, fetchBody);
  }

  // For confirming if user wants to cancel editing
  function confirmEditCancel() {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Cancel Editing',
      actionHandler: () => {
        setEditJournal(false);
        if (journals) {
          setFormData({
            journalName,
            journalDesc,
            market,
            startCapital,
          });
        }
        setModalState({ show: false });
      },
    });
  }

  return (
    <section className={`container ${style.container}`}>
      <Modal modalState={modalState} setModalState={setModalState} />
      <PagePrompt
        show={editJournal}
        message={`Cancel Journal ${editMode ? 'Editing' : 'Creation'}?`}
      />

      {/* Header */}
      <header
        className={`flex justify-content-between align-items-center ${style.pageHeader}`}>
        <h2>{editMode ? `${formData.journalName}` : 'Create Journal'}</h2>
        {editMode && (
          <div className={`flex ${style.btnHolder}`}>
            <FiSettings
              className={`icon ${editJournal && style.editBtn}`}
              onClick={() => {
                if (editJournal) {
                  confirmEditCancel();
                } else {
                  setEditJournal(true);
                }
              }}
            />
            <FiTrash2
              onClick={!editJournal ? handleDelete : undefined}
              className={`icon ${editJournal && style.btnDisabled}`}
            />
          </div>
        )}
      </header>

      {/* <hr></hr> */}
      <div className={`${style.divider}`}></div>

      {/* Form */}
      <form>
        <div className={`${style.formHolder}`}>
          <div className={`${style.inputHolder}`}>
            <label className={`${style.formLabel}`}>Journal Name</label>
            <input
              type='text'
              placeholder='Enter Journal Name'
              name='journalName'
              value={formData.journalName}
              onChange={handleInputChange}
              disabled={!editJournal}
              className={`${style.formInput} 
              ${!editJournal && style.disabledInput}`}
              required
            />
          </div>
          <div className={`${style.inputHolder}`}>
            <label className={`${style.formLabel}`}>Journal Description</label>
            <input
              type='text'
              placeholder="What's this journal about?"
              name='journalDesc'
              value={formData.journalDesc}
              onChange={handleInputChange}
              disabled={!editJournal}
              className={`${style.formInput} 
              ${!editJournal && style.disabledInput}`}
            />
          </div>
          <div className={`${style.inputHolder}`}>
            <label className={`${style.formLabel}`}>Market</label>
            <input
              type='text'
              placeholder='What market is this journal for?'
              name='market'
              value={formData.market}
              onChange={handleInputChange}
              disabled={!editJournal}
              className={`${style.formInput} 
              ${formData.market && style.market}
              ${!editJournal && style.disabledInput}`}
              required
            />
          </div>
          <div className={`${style.inputHolder}`}>
            <label className={`${style.formLabel}`}>Starting Capital</label>
            <div
              className={`${style.doubleItemInput} 
              ${!editJournal && style.disabledInput}`}>
              <h3 className={`${style.textLabel}`}>$</h3>
              <input
                type='number'
                placeholder="What's your starting capital?"
                name='startCapital'
                value={formData.startCapital}
                onChange={handleInputChange}
                disabled={!editJournal}
                className={`${style.formInput} `}
                required
              />
            </div>
          </div>
        </div>

        {/* Buttons holder */}
        {editJournal && (
          <div className={`flex justify-content-between ${style.btnGroup}`}>
            <div className={`${style.btn}`}>
              <SmallButton
                btnText={editMode ? 'Update Journal' : 'Create Journal'}
                clickHandler={editMode ? updateHandler : addJournal}
                disabled={isOperationOn}>
                {isOperationOn && <FiLoader className={`icon iconRotate`} />}
              </SmallButton>
            </div>
            <div className={`${style.btn}`}>
              <SmallButton
                btnText='Cancel'
                disabled={isOperationOn}
                clickHandler={cancelCreate}
              />
            </div>
          </div>
        )}
      </form>
    </section>
  );
}

function mapStateToProps(state) {
  const { isUpdated, isDeleted, isError } = state.flags;
  return { isUpdated, isDeleted, isError };
}

function mapDispatchToProps(dispatch) {
  return {
    resetDataUpdatedFlag: () => dispatch(resetDataUpdatedFlag()),

    resetDataDeletedFlag: () => dispatch(resetDataDeletedFlag()),

    createJournal: (username, fetchBody) =>
      dispatch(
        createJournal({
          username,
          fetchBody,
          httpMiddleware: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),

    deleteJournal: (username, fetchBody) =>
      dispatch(
        deleteJournal({
          username,
          fetchBody,
          httpMiddleware: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),

    updateJournal: (username, fetchBody) =>
      dispatch(
        updateJournal({
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateJournal);
