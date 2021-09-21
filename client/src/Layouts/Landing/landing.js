// Modules
import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  observeElement,
  useSessionReset,
} from '../../Custom Hooks/customHooks';

// Styles
import style from './landing.module.css';

// Components
import Footer from '../../Components/Footer/footer';
import StandardNavbar from '../../Components/StandardNavbar/standardNavbar';
import { FiBarChart2, FiEdit3, FiMonitor } from 'react-icons/fi';

export default function LandingPage() {
  const { changeNavbar, userInfo, isLoggedIn } = useSessionReset();
  const [isInfoCard, setIsInfoCard] = useState(false);
  const [isTradingStyle, setIsTradingStyle] = useState(false);

  // Refs
  const infoCard = useRef();
  const tradingStyle = useRef();

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-150px 0px',
    };

    //Observing the infoCard Element
    observeElement(
      infoCard.current,
      () => {
        setIsInfoCard(true);
      },
      observerOptions,
      true
    );

    //Observing the tradingStyle Element
    observeElement(
      tradingStyle.current,
      () => {
        setIsTradingStyle(true);
      },
      observerOptions,
      true
    );
  }, [isLoggedIn]);

  return (
    <section>
      {/* Navbar */}
      <StandardNavbar
        changeNavbar={changeNavbar}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
      />

      {/* Header */}
      <header className={`flex flex-col ${style.content}`}>
        <section
          className={`flex flex-col justify-content-center align-items-center ${style.container} ${style.hero}`}>
          <div
            className={`flex flex-col justify-content-center align-items-center ${style.contentHeader}`}>
            <h1 className={`logo ${style.textHeader}`}>Journal With Style</h1>
            <h3>With A Trading Journal Just For You</h3>
          </div>

          <NavLink to='/login' className={`${style.cta} ${style.journalBtn}`}>
            Let's Journal Now
          </NavLink>
        </section>
      </header>

      {/* Body */}
      <main className={`${style.mainContent}`}>
        {/* Info Cards */}
        <section
          className={`flex ${style.container} ${style.cardHolder}`}
          ref={infoCard}
          data-name='cardHolder'>
          <section
            className={`flex flex-col justify-content-between 
            ${style.cardInfo} ${style.cardInfoLeft} 
            ${isInfoCard && style.slideInLeft} 
            `}>
            <h3 className={`${style.cardHeader}`}>Log Your Trades</h3>
            <div className={`${style.cardBody}`}>
              <FiEdit3 className={`${style.cardIcon}`} />
            </div>
            <p className={`${style.cardFooter}`}>
              Write down your trades as soon as they happen
            </p>
          </section>
          <section
            className={`flex flex-col justify-content-between 
            ${style.cardInfo} ${isInfoCard && style.noCardAnim}`}>
            <h3 className={`${style.cardHeader}`}>View On Any Device</h3>
            <div className={`${style.cardBody}`}>
              <FiMonitor className={`${style.cardIcon}`} />
            </div>
            <p className={`${style.cardFooter}`}>
              An internet connection and a browser is all you need
            </p>
          </section>
          <section
            className={`flex flex-col justify-content-between 
            ${style.cardInfo} ${style.cardInfoRight} 
            ${isInfoCard && style.slideInRight} 
            `}>
            <h3 className={`${style.cardHeader}`}>Analyze Your Trades</h3>
            <div className={`${style.cardBody}`}>
              <FiBarChart2 className={`${style.cardIcon}`} />
            </div>
            <p className={`${style.cardFooter}`}>
              Watch your growth with data visualizations of your trades
            </p>
          </section>
        </section>

        {/* Trading In Style */}
        {/* For animations, when the page comes into view then the 'Trade In Style' and 'our approach' will slide in from the right */}
        <section
          className={`flex align-items-center ${style.tradingStyle}`}
          data-name='tradingStyle'
          ref={tradingStyle}>
          <div className={` ${style.tradingInfo}`}>
            <div
              className={` flex justify-content-between align-items-center ${style.container} ${style.styleHolder}`}>
              <h1
                className={`${style.styleHeader} 
                ${isTradingStyle && style.slideInLeft}`}>
                Trade In Style
              </h1>
              <div
                className={`flex flex-col justify-content-center ${style.tradingDetails}`}>
                <h1>Our Approach</h1>
                <ul
                  className={`flex  flex-col ${style.pointsList} 
                  ${isTradingStyle && style.slideInRight}`}>
                  <li className={style.points}>
                    We encourage trading each market with a different account
                    having different journals
                  </li>
                  <li className={style.points}>
                    Each account's growth is monitored as you trade
                  </li>
                  <li className={style.points}>
                    Analyze better what went wrong or right using comments on
                    each trade
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Blog */}
        {/* Feature articles from the blog later */}
        {/* <section hidden={true} className={`${style.blogHolder}`}>
          <section className={`flex ${style.container} ${style.blog}`}>
            <div className={`${style.blogInfo}`}>
              <h1>Enjoy our trading tips we release weekly, and forecasts (Maybe)</h1>
            </div>
            <div className={`flex justify-content-center align-items-center ${style.blogBtnHolder}`}>
              <NavLink to='#' className={`${style.cta} ${style.ctaAlt}`}>
                Check Out Our Blog
              </NavLink>
            </div>
          </section>
        </section> 
        */}

        {/* CTA */}
        {/* Animations: When page comes into view the cta button will flash blue just once */}
        <section hidden className={`${style.signupHolder}`}>
          <section
            className={`flex justify-content-center align-items-center ${style.container} ${style.signup}`}>
            <div
              className={`flex flex-col justify-content-center align-items-center ${style.signUpInfo}`}>
              <h1>Ready To Journal?</h1>
              <NavLink to='/login' className={`${style.cta} ${style.ctaAlt}`}>
                Journal With Us Today
              </NavLink>
            </div>
          </section>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </section>
  );
}
