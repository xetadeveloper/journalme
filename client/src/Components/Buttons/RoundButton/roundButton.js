import React from 'react';

// Styles
import style from './roundButton.module.css';

export default function RoundButton(props) {
  const { children, btnType, btnText, clickHandler } = props;

  return (
    <button
      type={btnType || 'button'}
      onClick={clickHandler}
      className={`flex align-items-center justify-content-center ${style.btnContainer}`}>
      {children || btnText || 'Click Me'}
    </button>
  );
}
