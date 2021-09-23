import React, { useEffect, useRef, useState } from 'react';
import {
  observeElement,
  useSendMail,
  useReopenSession,
} from '../../Custom Hooks/customHooks';

// Styles
import style from './contactUs.module.css';

// Components
import Footer from '../../Components/Footer/footer';
import StandardNavbar from '../../Components/StandardNavbar/standardNavbar';
import { FaArrowAltCircleDown, FaArrowAltCircleRight } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';

export default function ContactUs() {
  const { changeNavbar, userInfo, isLoggedIn } = useReopenSession();

  const sendEmail = useSendMail();

  const initialData = {
    email: '',
    message: '',
  };
  const [formData, setformData] = useState(initialData);
  const [isArrow, setIsArrow] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  // refs
  const arrowRef = useRef();

  useEffect(() => {
    const observerOptions = {
      rootMargin: '-250px 0px',
    };

    //Observing the main body Element
    observeElement(
      arrowRef.current,
      () => {
        setIsArrow(true);
      },
      observerOptions,
      true
    );
  }, [isLoggedIn]);

  function handleInputChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;

    setformData(prev => {
      return { ...prev, [name]: value };
    });
  }

  // Handles the sending of the contact us mail
  function handleSubmit() {
    // Submit the form
    sendEmail(formData);
    setIsEmailSent(true);
  }

  return (
    <section className={`${style.contactus}`}>
      <StandardNavbar
        changeNavbar={changeNavbar}
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
        linkColor='blackLink'
      />

      <header className={`${style.headerContainer}`}>
        <section
          className={`flex flex-col justify-content-center align-items-center ${style.container} ${style.headerBody}`}>
          <h1 className={`${style.heading}`}>We Want To Hear From You</h1>
          <h4>Lets's build a great community together</h4>
        </section>
      </header>

      <main className={`${style.mainContainer}`}>
        <div className={`${style.divider}`}></div>
        <section
          className={`flex ${style.container} ${style.contactHolder}`}
          ref={arrowRef}>
          <div
            className={`flex flex-col justify-content-center align-items-center ${style.textHolder}`}>
            <h2>Have Complaints?</h2>
            <div
              className={`flex flex-col justify-content-center align-items-center`}>
              <h4 className={`${style.textDetail} ${isArrow && style.unblur}`}>
                Let Us Know
              </h4>
              <FaArrowAltCircleRight
                className={`${style.arrowIcon} ${style.rightIcon} 
                ${isArrow && style.slideInLeft}`}
              />
              <FaArrowAltCircleDown
                className={`${style.arrowIcon} ${style.downIcon} 
                ${isArrow && style.slideInDown}`}
              />
            </div>
          </div>

          {/* Email Form */}
          <div
            className={`flex justify-content-center align-items-center ${style.formContainer}`}>
            {isEmailSent ? (
              <div
                className={`flex flex-col justify-content-center align-items-center ${style.formSent} `}>
                <h2>We'll Be In Touch</h2>
                <FiCheckCircle className={`${style.checkCircle}`} />
              </div>
            ) : (
              <div
                className={`flex flex-col ${style.formHolder} 
              ${isArrow && !isEmailSent && style.unblurWithDelay}`}>
                <div className={`${style.formItem}`}>
                  <label className={`${style.formLabel}`}>Email</label>
                  <input
                    type='email'
                    className={`${style.formInput}`}
                    placeholder='Your Email Address'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={`${style.formItem}`}>
                  <label className={`${style.formLabel}`}>Message</label>
                  <textarea
                    className={`${style.formInput}`}
                    placeholder='What do you want to tell us?'
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                  />
                </div>
                <button
                  type='button'
                  className={`${style.submitBtn}`}
                  onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </section>
  );
}
