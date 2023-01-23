// Modules
import React, { useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

// Styles
import style from '../loginContainer.module.css';

export default function Login(props) {
    const { handleSubmit, handleInputChange, errorFields, resetForm } = props;
    const { showSignUpForm, setShowSignUpForm, isLoggedIn, username } = props;

    const history = useHistory();

    const [isOperationOn, setIsOperationOn] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            history.push(`/journal/${username}`);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isOperationOn) {
            for (let field of Object.keys(errorFields)) {
                if (errorFields[field]) {
                    setIsOperationOn(false);
                }
            }
        }
    }, [errorFields, isOperationOn]);

    function getBtnText() {
        if (isOperationOn) {
            return <FiLoader className={`icon iconRotate ${style.rollIcon}`} />;
        } else {
            if (showSignUpForm) {
                return 'Sign Up';
            } else {
                return 'Login';
            }
        }
    }

    return (
        <form
            className={`grey-text flex flex-col  ${style.form}`}
            autoComplete='true'>
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
                        name='firstname'
                        onChange={handleInputChange}
                        className={`${style.formInput} ${
                            errorFields.firstname && style.error
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
                        name='lastname'
                        onChange={handleInputChange}
                        className={`${style.formInput} ${
                            errorFields.lastname && style.error
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
                        className={`${style.formInput} ${
                            errorFields.email && style.error
                        }`}
                    />
                </div>
            )}
            <button
                type='submit'
                className={`${style.formBtn}`}
                onClick={evt => {
                    setIsOperationOn(true);
                    handleSubmit(evt);
                }}>
                {getBtnText()}
            </button>
            <h6
                className={`${style.switchForm}`}
                onClick={() => {
                    resetForm();
                    setShowSignUpForm(prev => !prev);
                }}>
                {showSignUpForm
                    ? 'Have an account? Login'
                    : 'No Account? Sign Up Instead'}
            </h6>
        </form>
    );
}
