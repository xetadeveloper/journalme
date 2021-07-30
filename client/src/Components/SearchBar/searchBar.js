// Modules
import React from 'react';

// Styles
import style from './searchBar.module.css';

// Components
import { FiSearch } from 'react-icons/fi';

export default function SearchBar(props) {
  const { searchHandler, searchText } = props;

  return (
    <form
      className={`flex align-items-center justify-content-center ${style.searchContainer}`}>
      <input
        type='text'
        placeholder={searchText || 'Search'}
        className={`grey-text ${style.textBox}`}
        onChange={searchHandler}
      />
      <button className={style.searchBtn}>
        <FiSearch className={`grey-text ${style.searchIcon}`} />
      </button>
    </form>
  );
}
