//Modules
import React from 'react';
import { FiX } from 'react-icons/fi';

//Styles
import style from '../modalStyle.module.css';

export default function ConfirmModal(props) {
  const { modalState, closeModal } = props;
  const { message, actionHandler } = modalState;

  return (
    <div
      className={`
                flex
                flex-col
				align-items-center justify-content-center 
                ${style['modal-body']}
                ${style['modal-skin']}
            `}>
      <button className={`${style['modal-close-btn']}`} onClick={closeModal}>
        <FiX />
      </button>
      <h2 className={`${style['modal-text']}`}>{message}</h2>
      <div className={`flex flex-space-between ${style['modal-btn-holder']}`}>
        <button className={`${style['modal-btn']}`} onClick={actionHandler}>
          Yes
        </button>
        <button className={`${style['modal-btn']}`} onClick={closeModal}>
          No
        </button>
      </div>
    </div>
  );
}
