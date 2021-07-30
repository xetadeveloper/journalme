// Modules
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Styles
import style from '../loginContainer.module.css';

export default function Login(props) {
  const { handleSubmit, handleInputChange, errorFields } = props;
  const { showSignUpForm, setShowSignUpForm, isLoggedIn, user } = props;

  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      history.push(`/journal/${user}`);
    }
  });

  return (
    <form
      className={`grey-text flex flex-col  ${style.form}`}
      autoComplete='on'
      onSubmit={handleSubmit}>
      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Username</label>
        <input
          type='text'
          required={true}
          placeholder='Username'
          name='username'
          onChange={handleInputChange}
          className={`${style.formInput}
             ${errorFields.username && style.error}`}
        />
      </div>
      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Password</label>
        <input
          type='password'
          required={true}
          placeholder='Password'
          name='password'
          onChange={handleInputChange}
          className={`${style.formInput} ${
            errorFields.password && style.error
          }`}
        />
      </div>
      {showSignUpForm && (
        <div className={`${style.formItem}`}>
          <label className={`${style.formLabel}`}>First Name</label>
          <input
            type='text'
            placeholder='First Name'
            name='firstName'
            onChange={handleInputChange}
            className={`${style.formInput} ${
              errorFields.firstName && style.error
            }`}
          />
        </div>
      )}
      {showSignUpForm && (
        <div className={`${style.formItem}`}>
          <label className={`${style.formLabel}`}>Last Name</label>
          <input
            type='text'
            placeholder='Last Name'
            name='lastName'
            onChange={handleInputChange}
            className={`${style.formInput} ${
              errorFields.lastName && style.error
            }`}
          />
        </div>
      )}
      {showSignUpForm && (
        <div className={`${style.formItem}`}>
          <label className={`${style.formLabel}`}>Email</label>
          <input
            type='text'
            placeholder='Email'
            name='email'
            onChange={handleInputChange}
            className={`${style.formInput} ${errorFields.email && style.error}`}
          />
        </div>
      )}
      <button type='submit' className={`${style.formBtn}`}>
        {showSignUpForm ? 'Sign Up' : 'Login'}
      </button>
      <h6
        className={`${style.switchForm}`}
        onClick={() => {
          setShowSignUpForm(prev => !prev);
        }}>
        {showSignUpForm
          ? 'Have an account? Login'
          : 'No Account? Sign Up Instead'}
      </h6>
    </form>
  );
}
