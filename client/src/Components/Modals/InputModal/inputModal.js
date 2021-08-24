//Modules
import { FiX } from 'react-icons/fi';
import React from 'react';

//Styles
import style from '../modalStyle.module.css';

export default function InputModal(props) {
  let iconLib = props.iconLib;
  const { modalState, closeModal } = props;

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
      <h2 className={`${style['modal-text']}`}>{modalState.message}</h2>
      <input
        type='text'
        placeholder='Enter your text here'
        className={`${style['modal-input']}`}
      />
      <button
        className={`${style['modal-btn']} ${style['modal-btn-lg']}`}
        onClick={modalState.actionHandler}>
        Submit
      </button>
    </div>
  );
}
