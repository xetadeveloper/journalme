// Modules
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

// Components
import ListItem from '../../../Components/ListItem/listItem';
import Modal from '../../../Components/Modals/modal';
import { showError, updatePassword } from '../../../Redux/Actions/appActions';
import { resetDataUpdatedFlag } from '../../../Redux/Actions/flagActions';

// Styles
import style from './preferences.module.css';

function Preferences(props) {
  const { username, orientation } = props;

  // Redux Props
  const { resetDataUpdatedFlag, showError, isUpdated, updatePassword } = props;

  const { url } = useRouteMatch();

  // States
  const [modalState, setModalState] = useState({ show: false });

  // Effects
  // Hanldes succesful updates
  useEffect(() => {
    if (isUpdated) {
      setModalState({
        show: true,
        type: 'message',
        message: 'Password Updated!',
      });

      resetDataUpdatedFlag();
    }
  }, [isUpdated]);

  // Handles password change
  function changePassword(error) {
    setModalState({
      show: true,
      type: 'input',
      inputData: [
        {
          inputName: 'oldPassword',
          inputMsg: 'Enter Old Password',
          inputType: 'password',
          placeholder: 'Enter old password',
        },
        {
          inputName: 'newPassword',
          inputMsg: 'Enter New Password',
          inputType: 'password',
          placeholder: 'Enter new password',
        },
        {
          inputName: 'confirmPassword',
          inputMsg: 'Confirm New Password',
          inputType: 'password',
          placeholder: 'Confirm new password',
        },
      ],
      error,
      actionHandler: (evt, formData) => {
        // forward data to server
        const { newPassword, confirmPassword } = formData;

        if (newPassword != confirmPassword) {
          // console.log('Password do not match');
          const error = {
            type: 'inputerror',
            message: "Passwords Don't Match",
            errorFields: [
              {
                field: 'newPassword',
                message: "Passwords Don't Match",
              },
              {
                field: 'confirmPassword',
                message: "Passwords Don't Match",
              },
            ],
          };
          showError(error);
          changePassword(error);
        } else {
          // console.log('Passwords match');
          setModalState({ show: false });
          // send the data to server
          updatePassword(username, formData);
        }
      },
    });
  }

  // Shows confirm Modal
  function confirmPasswordChange() {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Change Password?',
      actionHandler: () => {
        changePassword();
      },
    });
  }

  return (
    <div className={`flex flex-col container ${style.container}`}>
      <Modal modalState={modalState} setModalState={setModalState} />

      <div className={`${style.header}`}>
        <h2>Preferences</h2>
      </div>

      <div className={`flex flex-col ${style.listHolder}`}>
        <ListItem url={`${url}/profile`} itemName='User Profile' />
        <ListItem
          url={`${url}/journalpreferences`}
          itemName='Journal Preferences'
        />
        <ListItem url={`${url}/themes`} itemName='Themes' />
        <ListItem
          url={`${url}`}
          itemName='Change Password'
          clickHandler={confirmPasswordChange}
        />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  // const { journalTrades } = state.app;
  const { isUpdated } = state.flags;

  return { isUpdated };
}

function mapDispatchToProps(dispatch) {
  return {
    resetDataUpdatedFlag: () => dispatch(resetDataUpdatedFlag()),

    showError: error => dispatch(showError(error)),

    updatePassword: (username, fetchBody) =>
      dispatch(
        updatePassword({
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

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
