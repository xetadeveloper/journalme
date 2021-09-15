// Modules
import React, { useEffect, useState } from 'react';
import { FiPlus, FiSettings, FiTrash } from 'react-icons/fi';
import { connect } from 'react-redux';
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import Modal from '../../../Components/Modals/modal';
import PagePrompt from '../../../Components/PagePrompt/pagePrompt';
import { updatePreferences } from '../../../Redux/Actions/appActions';
import { resetDataUpdatedFlag } from '../../../Redux/Actions/flagActions';

// Styles
import style from './journalPreferences.module.css';

function JournalPreferences(props) {
  const { userInfo , orientation} = props;

  // Redux Props
  const { resetDataUpdatedFlag, updatePreferences, isUpdated } = props;

  const { preferences, username } = userInfo || {};
  const { strategies, currency, saveSession } = preferences || {};

  // console.log('User Info: ', userInfo);
  // console.log('Currency: ', currency);

  const initialFormState = {
    saveSession:
      saveSession === true ? 'Yes' : saveSession === false ? 'No' : '',
    currency: currency || '',
  };

  const [strategyList, setStrategyList] = useState(strategies || []);
  const [modalState, setModalState] = useState({ show: false });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // console.log('Form Data: ', formData);
  // console.log('List: ', strategyList);

  // For resetting the strategies when refreshing page
  useEffect(() => {
    if (strategies && strategies.length) {
      setStrategyList(strategies);
      setFormData(initialFormState);
    }
  }, [strategies]);

  // Handles successful update
  useEffect(() => {
    if (isUpdated) {
      setModalState({
        show: true,
        type: 'message',
        message: 'Preferences have been updated!',
      });
      resetDataUpdatedFlag();
      setEditMode(false);
    }
  }, [isUpdated]);

  // For rendering options
  function renderOptions(optionList) {
    return optionList.map((optionData, index) => {
      return <option key={index}>{optionData}</option>;
    });
  }

  // handles the deletion of a strategy
  function handleDeleteStrategy(stratIndex) {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Delete this strategy?',
      actionHandler: () => {
        setStrategyList(prev =>
          prev.filter((val, arrIndex) => arrIndex != stratIndex)
        );

        setModalState({ show: false });
      },
    });
  }

  // For rendering list items
  function renderListItems(list) {
    return (
      strategyList.length &&
      strategyList.map((listItem, index) => {
        return (
          <li
            key={index}
            className={`flex justify-content-between align-items-center ${style.listItem}`}>
            {listItem}
            {editMode && (
              <FiTrash
                className={`${style.listItemTrash}`}
                onClick={() => {
                  handleDeleteStrategy(index);
                }}
              />
            )}
          </li>
        );
      })
    );
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

  // For adding a strategy
  function addStrategy() {
    setModalState({
      show: true,
      type: 'input',
      inputData: [
        {
          inputMsg: 'Strategy Name',
          inputName: 'strategyName',
          inputType: 'text',
          placeholder: 'Enter the strategy name ',
        },
      ],
      actionHandler: (evt, formData) => {
        console.log('Form Data: ', formData);

        // Add strategy name to list
        setStrategyList(prev => {
          return [...prev, formData.strategyName];
        });

        setModalState({ show: false });
      },
    });
  }

  // Handles input change
  function handleInputChange(evt) {
    setFormData(prev => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });
  }

  // Handles the updating of preferences
  function handlePreferencesUpdate() {
    const prefData = {};

    // Change saveSession to true or false
    formData.saveSession = formData.saveSession === 'Yes' ? true : false;
    formData.strategies = strategyList; // Add strategy list to form

    // Check only for values that have changed
    for (let prop in formData) {
      if (!(formData[prop] === initialFormState[prop])) {
        prefData[prop] = formData[prop];
      }
    }

    // Send data
    console.log('Pref data: ', prefData);
    updatePreferences(username, prefData);
  }

  return (
    <section className={`${style.container}`}>
      <Modal modalState={modalState} setModalState={setModalState} />
      <PagePrompt
        show={editMode}
        message={`Cancel Journal Preferences Editing?`}
      />

      <header className={`flex justify-content-between align-items-center`}>
        <h2>Journal Preferences</h2>
        <FiSettings
          className={`${style.icon} ${editMode && style.blueIcon}`}
          onClick={() => {
            if (editMode) {
              confirmEditCancel();
            } else {
              setEditMode(true);
            }
          }}
        />
      </header>
      <hr></hr>
      <div
        className={`flex justify-content-center align-items-center ${style.strategyHolder}`}>
        <ul className={`flex flex-col ${style.strategyList}`}>
          {strategies && renderListItems(strategies)}
          {editMode && (
            <li
              className={`flex justify-content-center align-items-center ${style.listItem} ${style.listItemAdd}`}
              onClick={addStrategy}>
              <FiPlus />
            </li>
          )}
        </ul>
      </div>
      <div
        className={`flex justify-content-center align-items-center ${style.optionsHolder}`}>
        <div className={`flex flex-col ${style.optionItem}`}>
          <h4>Currency</h4>
          <select
            value={formData.currency}
            name='currency'
            onChange={handleInputChange}
            disabled={!editMode}>
            <option>Select Currency</option>
            {strategies && renderOptions(['USD', 'GBP', 'EUR'])}
          </select>
        </div>
        <div className={`flex flex-col ${style.optionItem}`}>
          <h4>Remember Me</h4>
          <select
            value={formData.saveSession}
            name='saveSession'
            onChange={handleInputChange}
            disabled={!editMode}>
            <option>Select One</option>
            {strategies && renderOptions(['Yes', 'No'])}
          </select>
        </div>
      </div>
      {editMode && (
        <div className={`flex justify-content-between ${style.btnGroup}`}>
          <div>
            <SmallButton
              btnText='Update Preferences'
              clickHandler={handlePreferencesUpdate}
            />
          </div>
          <div>
            <SmallButton
              btnText='Cancel Edit'
              clickHandler={confirmEditCancel}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function mapStateToProps(state) {
  const { isUpdated } = state.flags;
  return { isUpdated };
}

function mapDispatchToProps(dispatch) {
  return {
    resetDataUpdatedFlag: () => dispatch(resetDataUpdatedFlag()),

    updatePreferences: (username, fetchBody) =>
      dispatch(
        updatePreferences({
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

export default connect(mapStateToProps, mapDispatchToProps)(JournalPreferences);
