import React, { useState, useEffect } from 'react';

// Styles
import style from './loginContainer.module.css';

// Redux
import { connect } from 'react-redux';
import { loginUser, signupUser } from '../../Redux/Actions/appActions';
import { resetErrorFlag } from '../../Redux/Actions/flagActions';
import { errorTypes } from '../../config';
import { reopenLastSession } from '../../Redux/Actions/httpActions';
import { resetSessionRestored } from '../../Redux/Actions/flagActions';
import { useHistory } from 'react-router-dom';

// Components
import Login from './Login/login';
import Logout from './Logout/logout';
import RoundButton from '../../Components/Buttons/RoundButton/roundButton';
import { FiLogIn, FiLogOut, FiX } from 'react-icons/fi';

function LoginContainer(props) {
  const { isError, error, loginUser, signupUser, reopenLastSession } = props;
  const { resetErrorFlag, logout, isLoggedIn, userInfo } = props;
  const { resetSessionRestored, isSessionRestored } = props;

  const { username } = userInfo;

  const initialFormData = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
  };
  const history = useHistory();

  // States
  const [formData, setFormData] = useState(initialFormData);
  const [errorFields, setErrorFields] = useState(initialFormData);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

  // Handles reopeoning last session
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('Reopeoning last session in login');
      reopenLastSession();
    }
  }, [isLoggedIn, reopenLastSession]);

  // Handles flag actions
  useEffect(() => {
    if (isSessionRestored) {
      console.log('Session Restored In Login  ..');
      resetSessionRestored();
      history.push(`/journal/${userInfo.username}`);
    }
  }, [isSessionRestored, history, userInfo.username, resetSessionRestored]);

  // handles input errors
  useEffect(() => {
    if (isError) {
      console.log('Error: ', error);
      if (error.type === errorTypes.notfounderror) {
        // Login error
        const localErrorField = { ...errorFields };
        for (let field in errorFields) {
          console.log('Field: ', field);
          error.forEach(errorField => {
            console.log('Error Field: ', errorField.field);
            if (field === errorField.field) {
              localErrorField[field] = errorField;
            }
          });
        }

        setErrorFields(localErrorField);
      } else if (error.type === errorTypes.duplicateusererror) {
        // Show modal for signup error
      }

      resetErrorFlag();
    }
  }, [isError]);

  function handleInputChange(evt) {
    setFormData(prev => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    console.log('Form to be submitted...');
    // Reset Error Fields
    setErrorFields(initialFormData);

    let fetchBody;

    if (showSignUpForm) {
      // Signing user up
      fetchBody = formData;
      signupUser(fetchBody);
    } else {
      //Logging User In
      fetchBody = { username: formData.username, password: formData.password };
      loginUser(fetchBody);
    }
  }

  return (
    <div className={`flex ${style.loginContainer}`}>
      <div className={`flex ${style.container}`}>
        <div
          className={`flex flex-col justify-content-center align-items-center ${style.logoHolder}`}>
          <h1 className={`logo ${style.logoText}`}>JournalMe</h1>
          <h3>Journal For The Professional Trader</h3>
          <div className={`${style.loginButtonHolder}`}>
            <div
              className={`${style.loginButton}`}
              onClick={() => {
                setShowMobileForm(prev => !prev);
              }}>
              <RoundButton>
                {logout ? (
                  <FiLogOut className={`${style.loginIcon}`} />
                ) : (
                  <FiLogIn className={`${style.loginIcon}`} />
                )}
              </RoundButton>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col justify-content-center align-items-center 
        ${style.formContainer} ${showMobileForm && style.showForm}`}>
          <FiX
            className={`icon ${style.closeForm}`}
            onClick={() => {
              setShowMobileForm(false);
            }}
          />
          {
            /* Add autocomplete to form */
            logout ? (
              <Logout user={username} />
            ) : (
              <Login
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                errorFields={errorFields}
                showSignUpForm={showSignUpForm}
                setShowSignUpForm={setShowSignUpForm}
                isLoggedIn={isLoggedIn}
                username={username}
              />
            )
          }
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { error, isLoggedIn, userInfo } = state.app;
  const { isError, isSessionRestored } = state.flags;
  // console.log('App State: ', state.app);
  return { isError, error, isLoggedIn, userInfo, isSessionRestored };
}

function mapDispatchToProps(dispatch) {
  return {
    loginUser: fetchBody =>
      dispatch(
        loginUser({
          httpMiddleware: true,
          method: 'POST',
          fetchBody,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),
    signupUser: fetchBody =>
      dispatch(
        signupUser({
          httpMiddleware: true,
          method: 'POST',
          fetchBody,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),
    reopenLastSession: () =>
      dispatch(reopenLastSession({ httpMiddleware: true, method: 'GET' })),
    resetErrorFlag: () => dispatch(resetErrorFlag()),
    resetSessionRestored: () => dispatch(resetSessionRestored()),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
