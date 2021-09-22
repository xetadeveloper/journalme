import React, { useEffect, useRef, useState } from 'react';
import {
  observeElement,
  useReopenSession,
} from '../../Custom Hooks/customHooks';

// Styles
import style from './about.module.css';

// Components
import StandardNavbar from '../../Components/StandardNavbar/standardNavbar';
import Footer from '../../Components/Footer/footer';

export default function About() {
  const { changeNavbar, userInfo, isLoggedIn } = useReopenSession();

  const [isAboutShown, setIsAboutShown] = useState(false);
  const aboutBody = useRef();

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-150px 0px',
    };

    //Observing the main body Element
    observeElement(
      aboutBody.current,
      () => {
        setIsAboutShown(true);
      },
      observerOptions,
      true
    );
  }, [isLoggedIn]);

  return (
    <section>
      <StandardNavbar
        changeNavbar={changeNavbar}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        linkColor='blackLink'
      />

      <header className={`${style.headerContainer}`}>
        <section
          className={`flex flex-col justify-content-center align-items-center container ${style.headerBody}`}>
          <h1>About</h1>
          <h2>JournalMe</h2>
        </section>
      </header>

      <main>
        <div
          ref={aboutBody}
          className={`flex justify-content-center align-items-center
           ${style.container} ${style.bodyHolder} 
           ${isAboutShown && style.animBody}`}>
          <div className={`flex align-items-center ${style.text}`}>
            <h2 className={` ${style.textHeader}`}>
              Why JournalMe Was Created?
            </h2>
            <p className={`${style.textBody}`}>
              JournalMe was created as a tool to help traders monitor their
              progress as they trade, and provide statistics on their trading
              history
            </p>
          </div>
          <div className={`flex align-items-center ${style.text}`}>
            <h2 className={` ${style.textHeader}`}>How Does JournalMe Help?</h2>
            <p className={`${style.textBody}`}>
              <ul className={`flex flex-col ${style.textList}`}>
                <li>
                  JournalMe uses the trades you log in to provide you a platform
                  to view your trades history
                </li>
                <li>
                  Create comments on those trades to help you remember why you
                  took that trade
                </li>
                <li>
                  Display your growth using graphical illustrations such as
                  charts
                </li>
              </ul>
            </p>
          </div>
          <div className={`flex align-items-center ${style.text}`}>
            <h2 className={` ${style.textHeader}`}>
              What JournalMe Encourages?
            </h2>
            <p className={`${style.textBody}`}>
              JournalMe advocates for trading each instrument with a seperate
              acccount, which helps you know which particular instrument is
              ruining your account. Using the comments on your trades you will
              aslo know why
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}
