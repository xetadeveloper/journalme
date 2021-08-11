import express from 'express';
import { getDBInstance } from '../../Database/mongoDB.js';
import {
  dbOperationError,
  emptyRequestBodyError,
  serverErrorFound,
} from '../../Utility/errorHandling.js';
import { User } from '../../Database/Models/models.js';
import { errorTypes } from '../../config.js';
import mongoTypes from 'mongodb';
import { dummyUserUpdate } from '../../Database/dummyData.js';
const { ObjectID } = mongoTypes;

const router = express.Router({ mergeParams: true });

// Updating a user's profile
router.post('/updateUser', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyUserUpdate;

  console.log('Updating User...', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { user } = req.params;

  const userDetails = new User(data).removeEmptyFields();

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
                res.status(500).json({
                  app: {
                    isLoggedIn: true,
                    error: {
                      type: errorTypes.updateerror,
                      message:
                        'User profile cannot be updated. Contact Support',
                    },
                  },
                  flags: { isError: true },
                });
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
          serverErrorFound(res, err, 'Error getting DB instance');
        });
    })
    .catch(err => {
      serverErrorFound(
        res,
        err,
        'Error in password encryption. Contact Support'
      );
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
                res.status(500).json({
                  app: {
                    isLoggedIn: true,
                    error: {
                      type: errorTypes.deleteerror,
                      message: 'User was not deleted. Contact Support',
                    },
                  },
                  flags: { isError: true },
                });
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
          dbOperationError(res, err, 'Error deleting trades for user. Contact Support');
        });
    })
    .catch(err => {
      serverErrorFound(res, err, 'Error getting DB instance');
    });
});

export default router;
