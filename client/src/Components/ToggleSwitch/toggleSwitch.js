// Modules
import React from 'react';

// Styles
import style from './toggleSwitch.module.css';

export default function ToggleSwitch(props) {
  const { toggleOn, toggleHandler } = props;

  return (
    <div
      className={`flex ${style.toggleContainer}`}
      onClick={() => {
        toggleHandler(prevValue => !prevValue);
      }}>
      {/* Toggle Backgrounds */}
      <div
        className={`${style.bluebg} brand-color-bg ${
          toggleOn ? style.selected : style.notSelected
        }`}></div>
      <div
        className={`${style.whitebg} ${
          !toggleOn ? style.selected : style.notSelected
        }`}></div>

      {/* Toggle Button */}
      <div
        className={`${style.toggleBtn} ${
          toggleOn ? style.toggleBtnOn : style.toggleBtnOff
        }`}></div>
    </div>
  );
}
