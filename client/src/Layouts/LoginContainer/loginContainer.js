import React, { useState, useEffect } from 'react';

// Styles
import style from './loginContainer.module.css';

// Redux
import { connect } from 'react-redux';
import { loginUser } from '../../Redux/Actions/appActions';
import { resetErrorFlag } from '../../Redux/Actions/flagActions';
import Login from './Login/login';
import Logout from './Logout/logout';

function LoginContainer(props) {
  const {
    isError,
    error,
    loginUser,
    resetErrorFlag,
    logout,
    isLoggedIn,
    username,
  } = props;

  const initialFormData = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorFields, setErrorFields] = useState(initialFormData);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

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
      fetchBody = formData;
    } else {
      fetchBody = { username: formData.username, password: formData.password };
    }

    loginUser(fetchBody);
  }

  useEffect(() => {
    if (isError) {
      // get Error
      if (error.type === 'inputerror') {
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
      }else if(error.type === 'insertError'){
        // Show modal for insert error
      }

      resetErrorFlag();
    }
  }, [isError]);

  return (
    <div className={`flex ${style.loginContainer}`}>
      {/* <h2>Login</h2> */}
      <div
        className={`flex flex-col justify-content-center align-items-center ${style.logoHolder}`}>
        <h1 className={`logo ${style.logoText}`}>JournalMe</h1>
        <h3>Journal For The Professional Trader</h3>
      </div>
      <div
        className={`flex flex-col justify-content-center align-items-center ${style.formContainer}`}>
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
  );
}

function mapStateToProps(state) {
  const { error, isLoggedIn, username } = state.app;
  const { isError } = state.flags;
  return { isError, error, isLoggedIn, username };
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
    resetErrorFlag: () => dispatch(resetErrorFlag()),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
