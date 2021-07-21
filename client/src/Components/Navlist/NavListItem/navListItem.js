// Modules
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Styles
import style from './navListItem.module.css';
import { FiChevronRight } from 'react-icons/fi';

export default function NavListItem(props) {
  const { linkName, linkPath, accordion, accordionList } = props;

  const [showAccordion, setShowAccordion] = useState(false);

  function renderAccordionList(list) {
    return list.map((link, index) => {
      // console.log(link);
      const { linkName, linkPath } = link;

      return (
        <li key={index} className={`${style.accLinkHolder}`}>
          <NavLink to={linkPath} className={`${style.navlink}`}>
            {linkName}
          </NavLink>
        </li>
      );
    });
  }

  return (
    <li className={`${style.linkContainer} ${style.border}`}>
      {accordion ? (
        <div className={`flex flex-col align-items-center`}>
          <div
            className={`${style.navlink}`}
            onClick={() => {
              setShowAccordion(prev => !prev);
            }}>
            {linkName}
            {accordion && (
              <FiChevronRight
                className={`${style.caretIcon} ${
                  accordion && showAccordion
                    ? style.caretIconDown
                    : style.caretIconUp
                }`}
              />
            )}
          </div>
          <ul
            className={`${style.accordionLink} 
              ${showAccordion ? style.showAccordion : style.hideAccordion}`}>
            {renderAccordionList(accordionList)}
          </ul>
        </div>
      ) : (
        <NavLink to={linkPath} className={`${style.navlink}`}>
          {linkName}
        </NavLink>
      )}
    </li>
  );
}
