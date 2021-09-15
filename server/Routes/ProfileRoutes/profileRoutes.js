import express from 'express';
import { getDBInstance } from '../../Database/mongoDB.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import {
  dbOperationError,
  emptyRequestBodyError,
  executionError,
  serverErrorFound,
} from '../../Utility/errorHandling.js';
import { User } from '../../Database/Models/models.js';
import { errorTypes, saltRounds, appMode } from '../../config.js';
import mongoTypes from 'mongodb';
import { dummyUserUpdate } from '../../Database/dummyData.js';
import formidable from 'formidable';
const { ObjectID } = mongoTypes;
const { deleteerror, updateerror, inputerror, notfounderror } = errorTypes;

const router = express.Router({ mergeParams: true });
cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.apiKey,
  api_secret: process.env.apiSecret,
  // secure: false,
});

// Updating a user's profile
router.post('/updateUser', async (req, res) => {
  const data = appMode !== 'prod' && dummyUserUpdate; //Fix this for dummy test

  const form = formidable({ multiples: true });

  form.parse(req, (err, data, files) => {
    if (err) {
      console.log('Error: ', err);
      executionError(
        res,
        500,
        updateerror,
        'User profile cannot be updated. Contact Support'
      );
      // log error 'Unable to parse image in formidable
      return;
    }

    if (!Object.entries(data).length && !Object.entries(files).length) {
      emptyRequestBodyError(res);
      return;
    }

    console.log('Updating User: ');
    console.log('Fields: ', data);
    console.log('Files: ', files);

    const { user } = req.params;
    const userDetails = new User(data).removeEmptyFields();

    if (files.userPic) {
      // Upload file here to cloudinary, if it doesn't work then return error
      console.log('Uploading profile picture....');
      cloudinary.uploader.upload(
        files.userPic.path,
        {
          overwrite: true,
          folder: 'journalMe/profilePics',
          public_id: `${user}'s picture`,
          resource_type: 'image',
          eager: [{ width: 300, height: 300, crop: 'fit' }],
        },
        (err, result) => {
          if (err) {
            console.log('Error in upload: ', err);
            executionError(
              res,
              500,
              updateerror,
              'User profile cannot be updated. Contact Support'
            );
            // log 'Unable to upload image
          } else {
            // add the url to the details
            console.log('Upload Result: ', result);

            userDetails.userPic = {
              picURL: result.url,
              publicID: result.public_id,
            };

            console.log('User Details to upload: ', userDetails);

            uploadToDB(res, userDetails, user);
          }
        }
      );
    } else {
      uploadToDB(res, userDetails, user);
    }
  });
});

// Deleting a user's account
router.post('/deleteUser', async (req, res) => {
  console.log('Deleting User...');

  const { user } = req.params;
  const { userID } = req.session;

  getDBInstance()
    .then(db => {
      // Delete all trades for this user
      const tradesCollection = db.collection('trades');

      tradesCollection
        .deleteMany({ userID: ObjectID(userID) })
        .then(tradeDelete => {
          // console.log('Result: ', tradeDelete);
          console.log('All trades deleted sucessfully');

          // Delete the User
          const usersCollection = db.collection('users');
          usersCollection
            .deleteOne({ username: user, _id: ObjectID(userID) })
            .then(result => {
              if (result.deletedCount) {
                console.log('User Deletion Successful....');

                req.session.destroy();
                res.status(200).json({
                  app: { isLoggedIn: false },
                  flags: { isDeleted: true },
                });
              } else {
                console.log('User Deletion Failed....');
                executionError(
                  res,
                  500,
                  deleteerror,
                  'User was not deleted. Contact Support'
                );
              }
            })
            .catch(err => {
              dbOperationError(
                res,
                err,
                'Error deleting user. Contact Support'
              );
            });
        })
        .catch(err => {
          dbOperationError(
            res,
            err,
            'Error deleting trades for user. Contact Support'
          );
        });
    })
    .catch(err => {
      serverErrorFound(res, err, 'Error getting DB instance');
    });
});

// Updating a user's password
router.post('/updatePassword', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyUserUpdate;

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  console.log('Updating Password: ', data);

  const { newPassword, oldPassword, confirmPassword } = data;
  const { user } = req.params;

  if (newPassword === confirmPassword) {
    getDBInstance()
      .then(db => {
        const usersCollection = db.collection('users');

        usersCollection
          .findOne({ username: user }, { projection: { password: 1 } })
          .then(result => {
            console.log('Search Result: ', result);
            if (result) {
              const { password } = result;

              bcrypt.compare(oldPassword, password).then(compareResult => {
                if (compareResult) {
                  // Update the password
                  bcrypt
                    .hash(newPassword, saltRounds)
                    .then(hash => {
                      usersCollection
                        .updateOne(
                          { username: user },
                          { $set: { password: hash } }
                        )
                        .then(result => {
                          if (result.modifiedCount) {
                            console.log('Password Updated...');

                            res.status(201).json({
                              flags: { isUpdated: true },
                            });
                          } else {
                            executionError(
                              res,
                              500,
                              updateerror,
                              'Data was not updated'
                            );
                          }
                        })
                        .catch(err => {
                          dbOperationError(res, err, err.stack);
                        });
                    })
                    .catch(err => {
                      serverErrorFound(
                        res,
                        err,
                        `Error Occured In Updating Password: ${err.stack}`
                      );
                    });
                } else {
                  executionError(
                    res,
                    500,
                    updateerror,
                    'Old Password Is Incorrect'
                  );
                }
              });
            } else {
              executionError(
                res,
                500,
                notfounderror,
                'User could not be found. Contact Support'
              );
            }
          });
      })
      .catch(err => {
        serverErrorFound(res, err, err.stack);
      });
  } else {
    console.log('New Passwords do not match...');
    executionError(res, 400, updateerror, 'New Passwords Do Not Match');
  }
});

// Handles uploading the userdetails to the database
function uploadToDB(res, userDetails, user) {
  userDetails
    .encryptPassword()
    .then(userInfo => {
      getDBInstance()
        .then(db => {
          const usersCollection = db.collection('users');
          console.log('Updating user with details: ', userInfo);

          usersCollection
            .findOneAndUpdate(
              { username: user },
              { $set: userInfo },
              { returnOriginal: false, projection: { password: 0 } }
            )
            .then(result => {
              console.log('Result: ', result);

              if (result.lastErrorObject.updatedExisting) {
                console.log('Update Successful...');
                res.status(200).json({
                  app: { userInfo: result.value },
                  flags: { isUpdated: true },
                });
              } else {
                console.log('Update Failed...');
                executionError(
                  res,
                  500,
                  updateerror,
                  'User profile cannot be updated. Contact Support'
                );
              }
            })
            .catch(err => {
              dbOperationError(
                res,
                err,
                'Error updating user. Contact Support'
              );
            });
        })
        .catch(err => {
          serverErrorFound(
            res,
            err,
            `Error getting DB instance. Contact Support`
          );
        });
    })
    .catch(err => {
      serverErrorFound(
        res,
        err,
        'Error in password encryption. Contact Support'
      );
    });
}

export default router;
