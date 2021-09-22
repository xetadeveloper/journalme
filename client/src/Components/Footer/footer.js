// Modules
import React from 'react';

// Styles
import style from './footer.module.css';

// Components
import { FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className={`${style.footerContainer}`}>
      <section
        className={`flex flex-col align-items-center justify-content-center ${style.container} ${style.footerBody}`}>
        <div className={`flex ${style.footerList}`}>
          <section
            className={`justify-content-center align-items-center ${style.footerItem}`}>
            <h4 className={`${style.itemHeader}`}>Any Complaints?</h4>
            <NavLink to='/contactus' className={`${style.ctaAlt}`}>
              Reach Out To Us
            </NavLink>
          </section>
          <section
            className={`justify-content-center align-items-center ${style.footerItem}`}>
            <h4 className={`${style.itemHeader}`}>What Are We About?</h4>
            <NavLink to='/about' className={`${style.ctaAlt}`}>
              Find Out More
            </NavLink>
          </section>
          <section
            className={`justify-content-center align-items-center ${style.footerItem}`}>
            <h4 className={`${style.itemHeader}`}>Want Trading Tips?</h4>
            <NavLink to='/blog' className={`${style.ctaAlt}`}>
              Visit Our Blog
            </NavLink>
          </section>
          <section
            className={`justify-content-center align-items-center ${style.footerItem}`}>
            <h4 className={`${style.itemHeader}`}>Add Your MetaTrader?</h4>
            <NavLink to='/blog' className={`${style.ctaAlt}`}>
              MetaTrader
            </NavLink>
          </section>
        </div>

        <div className={`flex ${style.socials}`}>
          <NavLink to='#' className={`${style.socialItem}`}>
            <FiLinkedin />
          </NavLink>
          <NavLink to='#' className={`${style.socialItem}`}>
            <FiTwitter />
          </NavLink>
          <NavLink to='#' className={`${style.socialItem}`}>
            <FaWhatsapp />
          </NavLink>
          <NavLink to='#' className={`${style.socialItem}`}>
            <FiMail />
          </NavLink>
        </div>

        <div className={`${style.copyLogo}`}>
          <h4>&#169; 2021 JournalMe</h4>
          <h4>Site by XetaDev</h4>
        </div>
      </section>
    </footer>
  );
}
