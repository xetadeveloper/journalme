import React, { useState } from 'react';
import { FaArrowAltCircleDown, FaArrowAltCircleRight } from 'react-icons/fa';
import StandardNavbar from '../../Components/StandardNavbar/standardNavbar';
import { useReopenSession } from '../../Custom Hooks/customHooks';

import style from './blog.module.css';

export default function Blog() {
  const { changeNavbar, userInfo, isLoggedIn } = useReopenSession();

  const initialData = {
    email: '',
  };

  const [formData, setFormData] = useState(initialData);

  function handleInputChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;

    setFormData(prev => {
      return { ...prev, [name]: value };
    });
  }

  return (
    <section className={`${style.blogPage}`}>
      <div className={`${style.imgBlur}`}>
        <StandardNavbar
          changeNavbar={changeNavbar}
          isLoggedIn={isLoggedIn}
          userInfo={userInfo}
        />

        <main
          className={`flex justify-content-center align-items-center ${style.container} ${style.blogHolder}`}>
          {/* Text */}
          <section
            className={`flex flex-col justify-content-center align-items-center ${style.textHolder}`}>
            <h1>Our Trading Blog Will Soon Be Up</h1>
            <p>Drop your email to be notified when it's up</p>
            <FaArrowAltCircleRight
              className={`${style.icon} ${style.rightIcon}`}
            />
            <FaArrowAltCircleDown
              className={`${style.icon} ${style.downIcon}`}
            />
          </section>

          {/* Email Form */}
          <section
            className={`flex justify-content-center align-items-center ${style.formContainer}`}>
            <div className={`flex flex-col ${style.formHolder}`}>
              <div className={`${style.formItem}`}>
                <label className={`${style.formLabel}`}>Email</label>
                <input
                  type='email'
                  className={`${style.formInput}`}
                  placeholder='Let us inform you'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type='button' className={`${style.submitBtn}`}>
                Submit
              </button>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
}
