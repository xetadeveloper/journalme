import express from 'express';
import mongoTypes from 'mongodb';
import { getDBInstance } from '../../Database/mongoDB.js';
import { v4 as genUUID } from 'uuid';
import {
  dbOperationError,
  emptyRequestBodyError,
  serverErrorFound,
} from '../../Utility/errorHandling.js';
import { Journal, Preferences, Trade } from '../../Database/Models/models.js';
import { appendPropertyName } from '../../Utility/utility.js';
import { appMode, errorTypes } from '../../config.js';
import {
  dummyDeleteStrategy,
  dummyPreferences,
} from '../../Database/dummyData.js';

const router = express.Router({ mergeParams: true });

const queryOptions = {
  returnOriginal: false,
  projection: { password: 0 },
};

//========== Preferences ========//

// Update Preferences
router.post('/updatePreferences', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyPreferences;

  console.log('Updating Preferences: ', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { user } = req.params;

  const pref = new Preferences(data).removeEmptyFields();

  const propPref = appendPropertyName(
    { ...pref.getSingleFields() },
    'preferences'
  );

  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');

      const queryOperation =
        pref.strategy && pref.strategy.length
          ? {
              $addToSet: { 'preferences.strategies': { $each: pref.strategy } },
              $set: propPref,
            }
          : { $set: propPref };

      usersCollection
        .findOneAndUpdate({ username: user }, queryOperation, queryOptions)
        .then(result => {
          if (result.updatedExisting) {
            console.log('Update successful...');
            res.status(200).json({
              app: {
                userInfo: result,
              },
              flags: { isUpdated: true },
            });
          } else {
            console.log('Update failed...');
            res.status(500).json({
              app: {
                error: {
                  type: errorTypes.updateerror,
                  message: 'Stragey update failed. Contact Support',
                },
              },
              flags: { isError: true },
            });
          }
        })
        .catch(err => {
          dbOperationError(res, err, err.stack);
        });
    })
    .catch(err => {
      serverErrorFound(res, err, err.stack);
    });
});

//========== Strategies ========//
// Delete strategy
router.post('/deleteStrategy', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyDeleteStrategy;

  console.log('Deleting Strategy...', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { strategyName } = data;
  const { user } = req.params;

  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');

      usersCollection
        .findOneAndUpdate(
          { username: user },
          { $pull: { 'preferences.strategies': strategyName } },
          { returnOriginal: false, projection: { password: 0 } }
        )
        .then(result => {
          console.log('Result: ', result);
          if (result.lastErrorObject.updatedExisting) {
            console.log('Update Sucessful...');
            res.status(200).json({
              app: {
                userInfo: result.value,
              },
              flags: { isDeleted: true },
            });
          } else {
            console.log('Update Failed...');
            res.status(500).json({
              app: {
                error: {
                  type: errorTypes.deleteerror,
                  message: 'Strategy deletion failed. Contact Support',
                },
              },
              flags: { isError: true },
            });
          }
        })
        .catch(err => {
          dbOperationError(res, err, err.stack);
        });
    })
    .catch(err => {
      serverErrorFound(res, err, err.stack);
    });
});

export default router;
