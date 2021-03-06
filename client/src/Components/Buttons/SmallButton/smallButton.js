import React from 'react';

// Styles
import style from './smallButton.module.css';

export default function SmallButton(props) {
  const { children, btnType, btnText, clickHandler, disabled } = props;

  return (
    <button
      type={btnType || 'button'}
      disabled={disabled}
      onClick={clickHandler}
      className={`flex align-items-center justify-content-center ${style.btnContainer}`}>
      {children || btnText || 'Click Me'}
    </button>
  );
}
