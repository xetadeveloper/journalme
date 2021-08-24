import React from 'react';

import style from './tradeForm.module.css';

export default function TradeForm(props) {
  const { editMode, formData, setformData, strategyList, tradeStatusList } =
    props;

  const { strategy, tradesize, tradeStatus, entryTime } = formData;
  const { exitDate, leverage, commission, comment } = formData;
  const { pl, exitTime, entryDate } = formData;

  // console.log('Form Data: ', formData);
  // console.log('Strategy: ', strategy);
  // console.log('Strategy lISt: ', strategyList);

  function handleInputChange(evt) {
    setformData(prev => {
      return { ...prev, [evt.target.name]: evt.target.value };
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
            value={tradesize}
            name='tradesize'
            onChange={handleInputChange}
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
            value={commission}
            name='commission'
            onChange={handleInputChange}
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
          value={strategy}
          onChange={handleInputChange}>
          <option>Select Strategy</option>
          {strategyList && renderOptions(strategyList, strategy)}
        </select>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Trade Status</label>
        <select
          disabled={!editMode}
          className={`${style.formInput}`}
          type='text'
          name='tradeStatus'
          value={tradeStatus}
          onChange={handleInputChange}>
          <option>Win or Lost Trade?</option>
          {renderOptions(tradeStatusList, tradeStatus)}
        </select>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Entry Time</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='time'
          name='entryTime'
          value={entryTime}
          onChange={handleInputChange}
        />
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Exit Time</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='time'
          name='exitTime'
          value={exitTime}
          onChange={handleInputChange}
        />
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Entry Date</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='date'
          name='entryDate'
          value={entryDate.split('T')[0]}
          onChange={handleInputChange}
        />
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>Exit Date</label>
        <input
          disabled={!editMode}
          className={`${style.formInput}`}
          type='date'
          name='exitDate'
          value={exitDate.split('T')[0]}
          onChange={handleInputChange}
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
            value={leverage}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={`${style.formItem}`}>
        <label className={`${style.formLabel}`}>P/L</label>
        <div
          className={style.currencyField}
          className={`${style.currencyField} 
          ${!editMode && style.currencyFieldDisabled}`}>
          <span className={style.currency}>{pl > 0 ? '$' : '-$'}</span>
          <input
            disabled={!editMode}
            className={`${style.formInput}`}
            type='number'
            name='pl'
            value={Math.abs(pl)}
            onChange={handleInputChange}
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
          value={comment}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
