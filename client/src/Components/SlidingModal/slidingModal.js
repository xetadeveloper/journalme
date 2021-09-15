// Modules
import React, { useRef, useState } from 'react';
import { FiAlertOctagon, FiX } from 'react-icons/fi';

// Styles
import style from './slidingModal.module.css';

export default function SlidingModal(props) {
  const { slidingState, modalIndex, slidingModals, setSlidingModals } = props;

  const [modalState, setModalState] = useState(slidingState);

  // console.log('Modal Props: ', props);
  // console.log('Sliding State: ', slidingState);
  // console.log('Modal State: ', modalState);
  const { show, modalCloseHandler, message } = modalState;

  // console.log(`Showing Modal ${modalIndex}: `, show);

  /**This closes the modal */
  function closeModal() {
    if (modalCloseHandler) {
      // This is for extra actions when closing the modal, for example cleanup
      modalCloseHandler();
    }

    // This filters out closed modals
    const newModals = [];

    slidingModals.forEach((modal, index) => {
      //   console.log('Index: ', index);
      //   console.log('Modal Index: ', modalIndex);
      if (!(index === modalIndex)) {
        // console.log('Modal to be pushed: ', modal);
        newModals.push(modal);
      }
    });

    // console.log('New Modals: ', newModals);

    // setModalState({ show: false, isMe: 'yes it is' });
    setSlidingModals(newModals);
    // console.log('Closing Modal');
  }

  return (
    <div
      className={`${style.container} ${show && style.slideIn} 
      ${!show && style.slideOut} 
      ${!show ? style.hideModal : style.showModal}`}>
      <div className={`flex ${style.cancelHolder}`}>
        <FiX className={`${style.cancelBtn}`} onClick={closeModal} />
      </div>
      <div
        className={`flex justify-content-center align-items-center ${style.messageBody}`}>
        <h2 className={`${style.headerText}`}>
          <FiAlertOctagon />
        </h2>
        <p className={`${style.errorMsg}`}>{message}</p>
      </div>
    </div>
  );
}
