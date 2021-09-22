// Modules
import React, { useEffect, useRef, useState } from 'react';

// Styles
import style from './profile.module.css';
import defaultUser from '../../../Images/user icon.png';
// import defaultUser from '../../../Images/pic1.jpg';

// Components
import SmallButton from '../../../Components/Buttons/SmallButton/smallButton';
import {
  FiLoader,
  FiPlusCircle,
  FiSettings,
  FiTrash,
  FiUserPlus,
} from 'react-icons/fi';
import Modal from '../../../Components/Modals/modal';
import PagePrompt from '../../../Components/PagePrompt/pagePrompt';
import { connect } from 'react-redux';
import { deleteUser, updateProfile } from '../../../Redux/Actions/appActions';
import {
  resetDataDeletedFlag,
  resetDataUpdatedFlag,
  resetProfilePicUpdated,
} from '../../../Redux/Actions/flagActions';

function Profile(props) {
  const { userInfo, isLoggedIn, orientation } = props;

  const { isMobile, isTablet, isWideScreen } = orientation;

  // Redux Props
  const { updateProfile, deleteUser, isDeleted, isUpdated } = props;
  const { resetDataUpdatedFlag, resetDataDeletedFlag, isError } = props;

  const { username, email, firstname, lastname, userPic } = userInfo || {};
  const { picURL } = userPic || {};

  // console.log('User Info: ', userInfo);

  const initialDetails = {
    username: username || '',
    email: email || '',
    firstname: firstname || '',
    lastname: lastname || '',
  };

  // console.log('initialDetails:', initialDetails);
  // States
  const [userDetails, setUserDetails] = useState(initialDetails);
  const [selectedImg, setSelectedImg] = useState({ isFile: false });
  const [userImg, setUserImg] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [modalState, setModalState] = useState({ show: false });
  const [isOperationOn, setIsOperationOn] = useState(false);

  const fileRef = useRef();

  // console.log('UserDetails: ', userDetails);
  // console.log('Selected Profile Image: ', selectedImg);
  // console.log('User Profile Image: ', picURL);

  // Effects
  // Handles refresh of page
  useEffect(() => {
    if (isLoggedIn && userInfo.firstname) {
      const details = {
        username: username,
        email: email,
        firstname: firstname,
        lastname: lastname,
      };

      // Object.assign(initialDetails, details);

      setUserDetails(details);
    }
  }, [isLoggedIn, userInfo]);

  // Handles toggling disabled mode between button
  useEffect(() => {
    if (isError && isOperationOn) {
      setIsOperationOn(false);
    }
  }, [isError]);

  // handles setting the profile picture
  useEffect(() => {
    if (picURL) {
      setUserImg(picURL);
    }
  }, [picURL]);

  // Resets the deleted flag
  useEffect(() => {
    if (isDeleted) {
      resetDataDeletedFlag();
    }
  }, [isDeleted]);

  // Resets the updated flag
  useEffect(() => {
    if (isUpdated) {
      setIsOperationOn(false);
      resetDataUpdatedFlag();
      if (editMode) {
        setEditMode(false);
      }

      setModalState({
        show: true,
        type: 'message',
        message: 'Profile Updated!',
      });
    }
  }, [isUpdated]);

  //Handles the input controlling
  function handleInputChange(evt) {
    setUserDetails(prev => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });
  }

  // Handles updating user info
  function handleInfoUpdate() {
    // setModalState({
    //   show: true,
    //   type: 'loading',
    //   message: 'Uploading Data',
    // });

    setIsOperationOn(true);

    console.log('Sending update info to server...');
    const profileForm = new FormData();

    if (selectedImg.isFile) {
      // DO user upload first else
      // console.log('Adding user image');
      profileForm.append(
        'userPic',
        selectedImg.fileObj,
        selectedImg.fileObj.name
      );
    }

    // Check only for values that have changed
    // console.log('InitialDetails: ', initialDetails);
    // console.log('USerDetails: ', userDetails);
    for (let prop in userDetails) {
      if (!(userDetails[prop] === initialDetails[prop])) {
        // console.log(`Appending ${prop}`);
        profileForm.append(prop, userDetails[prop]);
      }
    }

    // console.log('ProfileFormData: ');
    // profileForm.forEach((value, key) => {
    //   console.log('Form Key: ', key);
    //   console.log('Form Value: ', value);
    // });

    // Send update form to server
    updateProfile(username, profileForm);
  }

  // Handles the triggering of file input
  function triggerFileInput(evt) {
    fileRef.current.click();
  }

  // Handles the file onChange event
  function handlePictureChange(evt) {
    const file = evt.target.files[0];

    // console.log('File Selected: ', file);
    if (file) {
      setSelectedImg(prev => {
        return {
          ...prev,
          isFile: true,
          fileObj: file,
          rawFile: URL.createObjectURL(file),
        };
      });
    }
  }

  // For confirming if user wants to cancel editing
  function confirmEditCancel() {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Cancel Editing',
      actionHandler: () => {
        setEditMode(false);
        setModalState({ show: false });
      },
    });
  }

  // deletes the account
  function handleDeleteUser() {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Are you sure you want to delete your account?',
      actionHandler: () => {
        // delete account from server
        if (userPic && userPic.publicID) {
          deleteUser(username, { picPublicID: userPic.publicID });
        } else {
          deleteUser(username);
        }
      },
    });
  }

  return (
    <section
      className={`container ${style.container} 
      ${(isMobile || isTablet) && style.smallContainer}`}>
      <Modal
        isLoggedIn={isLoggedIn}
        modalState={modalState}
        setModalState={setModalState}
      />

      <PagePrompt show={editMode} message={`Cancel Profile Editing?`} />

      {/* Page Header */}
      <header className={`flex justify-content-between align-items-center`}>
        <h2 className={`${(isMobile || isTablet) && style.smallHeader}`}>
          User Profile
        </h2>
        <div className={`flex ${style.optionBtnGroup}`}>
          <FiSettings
            className={`${style.optionBtn} ${editMode && style.blueColor}`}
            onClick={() => {
              if (editMode) {
                confirmEditCancel();
                setUserDetails(initialDetails);
              } else {
                setEditMode(true);
              }
            }}
          />
          <FiTrash
            className={`${style.optionBtn}`}
            onClick={handleDeleteUser}
          />
        </div>
      </header>
      <div className='divider'></div>
      {/* User Details */}
      <section
        className={`flex flex-col align-items-center ${style.detailContainer}`}>
        {/* Profile Picture */}
        <div className={`${style.imageHolder}`}>
          {editMode && (
            <div
              className={`flex justify-content-center align-items-center ${style.updateImage}`}
              onClick={triggerFileInput}>
              <input
                type='file'
                name='profileImg'
                accept='image/*'
                className={style.fileChooser}
                onChange={handlePictureChange}
                ref={fileRef}
              />
              <FiPlusCircle />
            </div>
          )}
          <img
            src={
              selectedImg.isFile
                ? selectedImg.rawFile
                : userImg
                ? userImg
                : defaultUser
            }
            alt='display picture'
            className={`${style.profileImage}`}
          />
        </div>

        {/* Other Details */}
        <div
          className={`${style.detailsHolder} ${
            (isTablet || isMobile) && style.detailsHolderSmall
          }`}>
          <div className={`${style.detail}`}>
            <label className={`${style.formLabel} `}>Username</label>
            <input
              className={`${style.formInput} ${!editMode && style.noBorder}`}
              type='text'
              value={userDetails.username}
              name='username'
              placeholder='Username'
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>

          <div className={`${style.detail}`}>
            <label className={`${style.formLabel}`}>First Name</label>
            <input
              className={`${style.formInput} ${!editMode && style.noBorder}`}
              type='text'
              value={userDetails.firstname}
              name='firstname'
              placeholder='First Name'
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div className={`${style.detail}`}>
            <label className={`${style.formLabel}`}>Last Name</label>
            <input
              className={`${style.formInput} ${!editMode && style.noBorder}`}
              type='text'
              value={userDetails.lastname}
              name='lastname'
              placeholder='Lastname'
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div className={`${style.detail}`}>
            <label className={`${style.formLabel}`}>Email</label>
            <input
              className={`${style.formInput} ${!editMode && style.noBorder}`}
              type='email'
              value={userDetails.email}
              name='email'
              placeholder='Email'
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* Buttons */}
        <div
          className={`flex justify-content-between ${style.btnGroup} ${
            !editMode && style.hiddenItem
          }`}
          hidden={!editMode}>
          <div className={style.btn}>
            <SmallButton
              btnText='Update Profile'
              disabled={isOperationOn}
              clickHandler={handleInfoUpdate}>
              {isOperationOn && <FiLoader className={`icon iconRotate`} />}
            </SmallButton>
          </div>
          <div className={style.btn}>
            <SmallButton
              btnText='Cancel'
              disabled={isOperationOn}
              clickHandler={() => {
                setModalState({
                  show: true,
                  type: 'confirm',
                  message: 'Cancel Editing?',
                  actionHandler: () => {
                    setEditMode(false);
                    setModalState({
                      show: false,
                    });
                  },
                });
              }}
            />
          </div>
        </div>
      </section>
    </section>
  );
}

function mapStateToProps(state) {
  const { isUpdated, isDeleted, isError } = state.flags;

  return { isUpdated, isDeleted, isError };
}

function mapDispatchToProps(dispatch) {
  return {
    resetDataUpdatedFlag: () => dispatch(resetDataUpdatedFlag()),
    resetDataDeletedFlag: () => dispatch(resetDataDeletedFlag()),
    resetProfilePicUpdated: () => dispatch(resetProfilePicUpdated()),

    deleteUser: (username, fetchBody) =>
      dispatch(
        deleteUser({
          username,
          fetchBody,
          httpMiddleware: true,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ),

    updateProfile: (username, fetchBody) =>
      dispatch(
        updateProfile({
          username,
          fetchBody,
          profileMiddleware: true,
          method: 'POST',
        })
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
