import express from 'express';
import mongoTypes from 'mongodb';
import { getDBInstance } from '../../Database/mongoDB.js';
import { v4 as genUUID } from 'uuid';
import {
  dbOperationError,
  emptyRequestBodyError,
  emptyRequestQueryError,
  serverErrorFound,
} from '../../Utility/errorHandling.js';
import { Journal, Trade } from '../../Database/Models/models.js';
import { appendPropertyName } from '../../Utility/utility.js';
import { appMode, errorTypes } from '../../config.js';
import {
  dummyJournal,
  dummyJournalDelete,
  dummyJournalUpdate,
  dummyTrade,
  dummyTradeDelete,
  dummyTradeQuery,
  dummyTradeUpdate,
} from '../../Database/dummyData.js';
import prefRoutes from '../PreferencesRoutes/preferencesRoutes.js';
import profileRoutes from '../ProfileRoutes/profileRoutes.js';

const { ObjectID } = mongoTypes;
const router = express.Router({ mergeParams: true });

const queryOptions = {
  returnOriginal: false,
  projection: { password: 0 },
};

//========== Journals ========//
// Get all Journals
router.get('/journals', async (req, res) => {
  console.log('get all user info for journals: ', req.params);

  const { user } = req.params;
  console.log('User: ', user);

  getDBInstance()
    .then(db => {
      const userCollection = db.collection('users');

      userCollection
        .findOne({ username: user }, { projection: { password: 0 } })
        .then(result => {
          // console.log('Search result: ', result);
          if (result) {
            console.log('User found');
            res.status(200).json({
              app: { isLoggedIn: true, userInfo: result },
            });
          } else {
            console.log('User not found');
            res.status(500).json({
              app: {
                isLoggedIn: true,
                userInfo: null,
                error: {
                  type: errorTypes.notfounderror,
                  message:
                    'Error retrieving user info from database. Contact Support',
                },
              },
              flags: { isError: true },
            });
          }
        })
        .catch(err => {
          dbOperationError(res, err, 'Error in finding user info');
        });
    })
    .catch(err => {
      serverErrorFound(res, err, 'Error getting DB instance');
    });
});

// Create Journals
router.post('/createJournal', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyJournal;

  console.log('Creating journal: ', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { user } = req.params;

  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');
      const journal = new Journal(data).convertMongoTypes();
      journal.journalID = genUUID();

      console.log('Journal to be inserted: ', journal);
      usersCollection
        .findOneAndUpdate(
          { username: user },
          { $push: { journals: journal } },
          queryOptions
        )
        .then(updateResult => {
          console.log('Result: ', updateResult);
          if (updateResult.lastErrorObject.updatedExisting) {
            console.log('Journal Updated...');
            res.status(201).json({
              app: { userInfo: updateResult.value },
              flags: { isUpdated: true },
            });
          } else {
            res.status(500).json({
              app: {
                error: {
                  type: errorTypes.inserterror,
                  message:
                    'Error in creating journal. Journal was not inserted',
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
            `Error creating journal: ${err.message}. \nContact Support`
          );
        });
    })
    .catch(err => {
      serverErrorFound(res, err, `Error getting DB instance: ${err.message}`);
    });
});

// Update Journal
router.post('/updateJournal', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyJournalUpdate;

  console.log('Updating Journal: ', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { user } = req.params;

  const journal = new Journal(data).removeEmptyFields().convertMongoTypes();

  const propJournal = appendPropertyName({ ...journal }, 'journals.$');

  // console.log('Prop Journal: ', propJournal);
  // console.log('User: ', user);
  // console.log('JournalID: ', journal.journalID);

  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');

      usersCollection
        .findOneAndUpdate(
          { username: user, 'journals.journalID': journal.journalID },
          { $set: propJournal },
          queryOptions
        )
        .then(returned => {
          console.log('Update Result: ', returned);

          if (returned.lastErrorObject.updatedExisting) {
            console.log('Update successful...');
            res.status(201).json({
              app: { userInfo: returned.value },
              flags: { isUpdated: true },
            });
          } else {
            console.log('Update failed...');
            res.status(500).json({
              app: {
                userInfo: returned.value,
                isLoggedIn: true,
                error: {
                  type: errorTypes.updateerror,
                  message: 'Journal was not updated. Contact Support',
                },
              },
              flags: { isUpdated: false, isError: true },
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

// Delete Journal
router.post('/deleteJournal', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyJournalDelete;

  console.log('Deleting Journal: ', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  getDBInstance()
    .then(db => {
      const { journalID } = data;

      const tradesCollection = db.collection('trades');

      tradesCollection
        .deleteMany({ journalID: journalID })
        .then(deleteResult => {
          console.log('All trades deleted sucessfully');
          const usersCollection = db.collection('users');

          const { user } = req.params;
          console.log('Deleting Journal...');

          usersCollection
            .findOneAndUpdate(
              { username: user },
              { $pull: { journal: { journalID: journalID } } },
              queryOptions
            )
            .then(returned => {
              console.log('Returned Delete: ', returned);

              if (returned.lastErrorObject.updatedExisting) {
                res.status(200).json({
                  app: { userInfo: returned.value },
                  flags: { isDeleted: true },
                });
              } else {
                console.log('Journal not deleted...');
                res.status(500).json({
                  app: {
                    isLoggedIn: true,
                    error: {
                      type: errorTypes.deleteerror,
                      message: 'Journal cannot be deleted. Contact Support',
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
                'Error deleting journal. Contact Support'
              );
            });
        })
        .catch(err => {
          dbOperationError(
            res,
            err,
            'Error deleting trades for journal. Contact Support'
          );
        });
    })
    .catch(err => {
      serverErrorFound(res, err, 'Error getting DB instance');
    });
});

//========== Trades ========//
// Get all trades for a journal
router.get('/trades', async (req, res) => {
  const data = appMode === 'prod' ? req.query : dummyTradeQuery;

  console.log('Getting all trades: ', data);

  if (!Object.entries(data).length) {
    emptyRequestQueryError(res);
    return;
  }
  const { userID } = req.session;

  const { journalID } = data;

  console.log('UserId: ', userID);
  getDBInstance()
    .then(db => {
      const tradesCollection = db.collection('trades');

      tradesCollection
        .find({ userID: ObjectID(userID), journalID: journalID })
        .toArray((err, result) => {
          if (err) {
            dbOperationError(res, err, err.stack);
            return;
          }

          console.log('Result: ', result);
          if (result && result.length) {
            console.log('Trades Found...');
            res.status(200).json({
              app: { journalTrades: { journalID: journalID, trades: result } },
            });
          } else {
            console.log('Trades not found...');
            res.status(500).json({
              app: {
                journalTrades: {
                  journalID: journalID,
                  trades: null,
                  tradesNotFound: true,
                },
                error: {
                  type: errorTypes.notfounderror,
                  message:
                    'Error occured on server. Trades could not be found, contact support',
                },
              },
              flags: { isError: true },
            });
          }
        });
    })
    .catch(err => {
      serverErrorFound(res, err, err, stack);
    });
});

// Get a specific trade
router.get('/oneTrade', async (req, res) => {
  const data = appMode === 'prod' ? req.query : dummyTradeQuery;

  console.log('Getting specific trade: ', data);

  if (!Object.entries(data).length) {
    emptyRequestQueryError(res);
    return;
  }

  const { tradeID } = data;

  getDBInstance()
    .then(db => {
      const tradesCollection = db.collection('trades');

      tradesCollection
        .findOne({ _id: tradeID })
        .then(result => {
          console.log('Result: ', result);
          if (result) {
            console.log('Trade Found...');
            res.status(200).json({
              app: { currentTrade: result },
            });
          } else {
            console.log('Trade not found...');
            res.status(500).json({
              app: {
                currentTrade: null,
                error: {
                  type: errorTypes.notfounderror,
                  message:
                    'Error occured on server. Trade could not be found, contact support',
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
      serverErrorFound(res, err, err, stack);
    });
});

// Update Trade
router.post('/updateTrade', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyTradeUpdate;

  console.log('Updating trade: ', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { tradeID } = data;
  delete data.tradeID;
  const trade = new Trade(data).removeEmptyFields().convertMongoTypes();

  console.log('Updating Converted Trade: ', trade);

  getDBInstance()
    .then(db => {
      const tradesCollection = db.collection('trades');

      tradesCollection
        .updateOne({ _id: ObjectID(tradeID) }, { $set: trade })
        .then(result => {
          // console.log('Result: ', result);

          if (result.modifiedCount) {
            console.log('Trade updated...');
            res.status(200).json({
              flags: { isUpdated: true },
            });
          } else {
            res.status(500).json({
              app: {
                error: {
                  type: errorTypes.updateerror,
                  message: 'Error in updating trade. Contact Support',
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
      serverErrorFound(res, err, err, stack);
    });
});

// Delete Trade
router.post('/deleteTrade', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyTradeDelete;

  console.log('Deleting Trade: ', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { tradeID } = data;

  getDBInstance()
    .then(db => {
      const tradesCollection = db.collection('trades');

      tradesCollection
        .deleteOne({ _id: ObjectID(tradeID) })
        .then(result => {
          console.log('Result: ', result.deletedCount);

          if (result.deletedCount) {
            res.status(200).json({
              flags: { isDeleted: true },
            });
          } else {
            res.status(500).json({
              app: {
                error: {
                  type: errorTypes.deleteerror,
                  message: 'Error in deleting trade. Contact Support',
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
      serverErrorFound(res, err, err, stack);
    });
});

// Insert Trade
router.post('/createTrade', async (req, res) => {
  const data = appMode === 'prod' ? req.body : dummyTrade;

  console.log('Creating Trade: ', data);

  if (!Object.entries(data).length) {
    emptyRequestBodyError(res);
    return;
  }

  getDBInstance()
    .then(db => {
      const tradesCollection = db.collection('trades');

      const trade = new Trade(data).removeEmptyFields().convertMongoTypes();

      console.log('Trade to be inserted: ', trade);
      tradesCollection
        .insertOne(trade)
        .then(result => {
          // console.log('Insert Result: ', result);
          if (result.insertedCount > 0) {
            // console.log('Trade Inserted...');
            res.status(201).json({
              app: { newTrade: result.ops },
              flags: { isCreated: true },
            });
          } else {
            res.status(500).json({
              app: {
                error: {
                  type: errorTypes.inserterror,
                  message: 'Error in creating trade. Trade was not inserted',
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
            `Error creating trade: ${err.message}. \nContact Support`
          );
        });
    })
    .catch(err => {
      serverErrorFound(res, err, `Error getting DB instance: ${err.message}`);
    });
});

// Get 10 recent trades

//========== Preferences ========//
router.use('/preferences', prefRoutes);

//========== Profie ========//
router.use('/profile', profileRoutes);

export default router;
