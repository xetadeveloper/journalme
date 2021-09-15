import React from 'react';

import style from './tradeForm.module.css';

export default function TradeForm(props) {
  const { editMode, formData, setformData, strategyList } = props;
  const { tradeStatusList, createMode } = props;

  const { strategy, tradesize, tradeStatus, entryTime } = formData;
  const { exitDate, leverage, commission, comment } = formData;
  const { pl, exitTime, entryDate } = formData;

  // console.log('Form Data: ', formData);
  // console.log('Strategy: ', strategy);
  // console.log('Strategy lISt: ', strategyList);

  function handleInputChange(evt) {
    setformData(prev => {
      const inputName = evt.target.name;
      const inputValue = evt.target.value;
      return {
        ...prev,
        [inputName]: { ...prev[inputName], value: inputValue },
      };
    });
  }

  function renderOptions(optionList, defaultOption) {
    return optionList.map((option, index) => (
      <option key={index}>{option}</option>
    ));
  }

  return (
    <div className={`${style.formInputHolder}`}>
      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Trade Size</label>
        <div
          className={`${style.currencyField} 
          ${!editMode && style.currencyFieldDisabled}`}>
          <span className={style.currency}>$</span>
          <input
            disabled={!editMode}
            className={`${style.formInput}`}
            type='number'
            value={tradesize.value}
            name='tradesize'
            onChange={handleInputChange}
            required={createMode}
          />
        </div>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Commission</label>
        <div
          className={`${style.currencyField} 
          ${!editMode && style.currencyFieldDisabled}`}>
          <span className={style.currency}>$</span>
          <input
            disabled={!editMode}
            className={`${style.formInput}`}
            type='number'
            value={commission.value}
            name='commission'
            onChange={handleInputChange}
            required={createMode}
          />
        </div>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Strategy</label>
        <select
          disabled={!editMode}
          className={`${style.formInput}`}
          type='text'
          name='strategy'
          value={strategy.value}
          onChange={handleInputChange}
          required={createMode}>
          <option>Select Strategy</option>
          {strategyList && renderOptions(strategyList, strategy.value)}
        </select>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Trade Status</label>
        <select
          disabled={!editMode}
          className={`${style.formInput}`}
          type='text'
          name='tradeStatus'
          value={tradeStatus.value}
          onChange={handleInputChange}
          required={createMode}>
          <option>Win or Lost Trade?</option>
          {renderOptions(tradeStatusList, tradeStatus.value)}
        </select>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Entry Time</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='time'
          name='entryTime'
          value={entryTime.value}
          onChange={handleInputChange}
          required={createMode}
        />
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Exit Time</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='time'
          name='exitTime'
          value={exitTime.value}
          onChange={handleInputChange}
          required={createMode}
        />
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Entry Date</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='date'
          name='entryDate'
          value={entryDate.value.split('T')[0]}
          onChange={handleInputChange}
          required={createMode}
        />
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Exit Date</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='date'
          name='exitDate'
          value={exitDate.value.split('T')[0]}
          onChange={handleInputChange}
          required={createMode}
        />
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Leverage</label>
        <div
          className={`${style.currencyField} 
          ${!editMode && style.currencyFieldDisabled}`}>
          <span className={style.currency}>x</span>
          <input
            disabled={!editMode}
            className={`${style.formInput}`}
            type='text'
            name='leverage'
            value={leverage.value}
            onChange={handleInputChange}
            required={createMode}
          />
        </div>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>P/L</label>
        <div
          className={style.currencyField}
          className={`${style.currencyField} 
          ${!editMode && style.currencyFieldDisabled}`}>
          <span className={style.currency}>
            {!formData.tradeStatus.value || formData.tradeStatus.value === 'Won'
              ? '$'
              : '-$'}
          </span>
          <input
            disabled={!editMode}
            className={`${style.formInput}`}
            type='number'
            name='pl'
            value={pl.value ? Math.abs(pl.value) : undefined}
            onChange={handleInputChange}
            required={createMode}
          />
        </div>
      </div>

      <div className={`${style.formItem} ${style.comments}`}>
        <label disabled={!editMode} className={`${style.formLabel}`}>
          Comments
        </label>
        <textarea
          className={`${style.formInput} `}
          readOnly={!editMode}
          name='comment'
          value={comment.value}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
