//Modules
import { FiX } from 'react-icons/fi';
import React, { useState } from 'react';

//Styles
import style from '../modalStyle.module.css';

export default function InputModal(props) {
  let iconLib = props.iconLib;
  const { modalState, closeModal } = props;
  const { message, actionHandler, inputData, error, submitBtnText } =
    modalState;

  const initialForm = {};

  inputData.forEach(inputItem => {
    initialForm[inputItem.inputName] = {
      required: inputItem.required,
      value: inputItem.defaultOption || '',
      placeholderOption: inputItem.placeholderOption,
    };
  });

  const [formData, setFormData] = useState(initialForm);

  // console.log('Form Data: ', formData);

  function handleInputChange(evt) {
    setFormData(prev => {
      const inputName = evt.target.name;
      const inputValue = evt.target.value;
      return {
        ...prev,
        [inputName]: { ...prev[inputName], value: inputValue },
      };
    });
  }

  // Renders the inputs
  function renderSelect() {
    return inputData.map((inputItem, index) => {
      const { inputMsg, inputName, defaultOption } = inputItem;
      const { optionList, placeholderOption } = inputItem;

      return (
        <div
          className={`flex flex-col align-items-center justify-content-center ${style.modalInputHolder}`}>
          <h2 className={`${style.modalInputText}`}>{inputMsg}</h2>
          <select
            type='select'
            className={`${style['modal-input']} 
            ${
              error &&
              error.errorFields.find(errorInput => {
                return errorInput.field === inputName;
              })
                ? style.redBorder
                : ''
            }`}
            name={inputName}
            value={formData[inputName].value}
            onChange={handleInputChange}>
            <option>{placeholderOption}</option>
            {optionList.map((optionItem, index) => {
              return <option key={index}>{optionItem}</option>;
            })}
          </select>
        </div>
      );
    });
  }

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
      {renderSelect()}
      <button
        className={`${style['modal-btn']} ${style['modal-btn-lg']}`}
        onClick={evt => {
          actionHandler(evt, formData);
        }}>
        {submitBtnText || 'Submit'}
      </button>
    </div>
  );
}
