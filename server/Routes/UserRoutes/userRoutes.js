import express from 'express';
import mongoTypes from 'mongodb';
import { getDBInstance } from '../../Database/mongoDB.js';
import { v4 as genUUID } from 'uuid';
import {
  dbOperationError,
  emptyRequestBodyError,
  emptyRequestQueryError,
  executionError,
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
const { deleteerror, updateerror, inserterror, notfounderror } = errorTypes;
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

  // Either two queries are run for user info and user trades or a lookup is used, find out which is faster
  getDBInstance()
    .then(db => {
      const userCollection = db.collection('users');

      const pipeline = [
        { $match: { username: user } },
        { $project: { password: 0 } },
        {
          $lookup: {
            from: 'trades',
            localField: '_id',
            foreignField: 'userID',
            as: 'userTrades',
          },
        },
      ];
      try {
        const aggCursor = userCollection.aggregate(pipeline);

        aggCursor.toArray((err, result) => {
          if (err) {
            console.log('Error: ', err);
            dbOperationError(res, err, 'Error in finding user info');
            return;
          }

          if (result[0]) {
            console.log('User found');
            res.status(200).json({
              app: {
                isLoggedIn: true,
                userInfo: result[0],
                userTrades: result[0].userTrades,
              },
            });
          } else {
            executionError(
              res,
              500,
              notfounderror,
              'Could not find user info in DB. Contact Support'
            );
          }
        });
      } catch (err) {
        dbOperationError(res, err, 'Error in finding user info');
        console.log('Error in method: ', err);
      }
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

  data.balance = data.startCapital;

  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');
      const journal = new Journal(data).convertMongoTypes({ createMode: true });
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
                  type: inserterror,
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

  if (data.oldStartCapital) {
    data.balance =
      Number(data.oldBalance) -
      Number(data.oldStartCapital) +
      Number(data.startCapital);
  }

  const journal = new Journal(data)
    .removeEmptyFields()
    .convertMongoTypes({ createMode: false });

  const propJournal = appendPropertyName({ ...journal }, 'journals.$');

  console.log('Journal Data: ', journal);
  console.log('Prop Journal: ', propJournal);
  // console.log('User: ', user);
  console.log('JournalID: ', journal.journalID);

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
                  type: updateerror,
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
          // console.log('User: ', user);
          // console.log('JournalID: ', journalID);
          usersCollection
            .findOneAndUpdate(
              { username: user },
              { $pull: { journals: { journalID: journalID } } },
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
                      type: deleteerror,
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
              },
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
                  type: notfounderror,
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

  const { tradeID, prevPlValue } = data;
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

            // Update Journal if PL has changed
            if (trade.pl) {
              // Update the journal
              const usersCollection = db.collection('users');
              const username = req.session.username;

              // GEt journal details
              usersCollection
                .findOne(
                  { username: username },
                  { projection: { journals: 1 } }
                )
                .then(result => {
                  if (result) {
                    console.log('Journals: ', result.journals);
                    const tradeJournal = result.journals.find(
                      journal => journal.journalID === trade.journalID
                    );

                    const { totalProfit, balance, loseRate, startCapital } =
                      tradeJournal;
                    const { winningTrades, losingTrades, winRate } =
                      tradeJournal;

                    const journalUpdate = {
                      totalProfit,
                      balance,
                      loseRate,
                      winRate,
                      winningTrades,
                      losingTrades,
                    };

                    console.log('Updated Trade: ', trade);
                    const plValue = Number(trade.pl.value);

                    if (prevPlValue < 0 && plValue > 0) {
                      // Profit
                      journalUpdate.winningTrades =
                        journalUpdate.winningTrades + 1;

                      journalUpdate.losingTrades =
                        journalUpdate.losingTrades - 1;
                    } else if (prevPlValue > 0 && plValue < 0) {
                      journalUpdate.losingTrades =
                        journalUpdate.losingTrades + 1;

                      journalUpdate.winningTrades =
                        journalUpdate.winningTrades - 1;
                    }

                    journalUpdate.winRate =
                      (journalUpdate.winningTrades /
                        (journalUpdate.winningTrades +
                          journalUpdate.losingTrades)) *
                      100;

                    journalUpdate.loseRate =
                      (journalUpdate.losingTrades /
                        (journalUpdate.winningTrades +
                          journalUpdate.losingTrades)) *
                      100;

                    journalUpdate.balance =
                      journalUpdate.balance - prevPlValue + plValue;

                    journalUpdate.totalProfit =
                      journalUpdate.totalProfit - prevPlValue + plValue;

                    const tempJournal = new Journal(journalUpdate)
                      .removeEmptyFields()
                      .convertMongoTypes({ createMode: false });

                    const journalUpdateDetails = appendPropertyName(
                      tempJournal,
                      'journals.$'
                    );

                    console.log(
                      'JournalUpdate Details: ',
                      journalUpdateDetails
                    );

                    usersCollection
                      .findOneAndUpdate(
                        {
                          username: username,
                          'journals.journalID': trade.journalID,
                        },
                        { $set: journalUpdateDetails },
                        { projection: { password: 0 }, returnOriginal: false }
                      )
                      .then(result => {
                        if (result.lastErrorObject.updatedExisting) {
                          res.status(201).json({
                            app: {
                              userInfo: result.value,
                            },
                            flags: { isUpdated: true },
                          });
                        } else {
                          executionError(
                            res,
                            500,
                            updateerror,
                            'Could not update journal. Contact Support'
                          );
                        }
                      })
                      .catch(err => {
                        dbOperationError(res, err, err.stack);
                      });
                  } else {
                    executionError(
                      res,
                      500,
                      notfounderror,
                      'Unable to find journal related to trade. Contact Support'
                    );
                  }
                })
                .catch(err => {
                  dbOperationError(res, err, err.stack);
                });
            } else {
              res.status(200).json({
                flags: { isUpdated: true },
              });
            }
          } else {
            res.status(500).json({
              app: {
                error: {
                  type: updateerror,
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

  const trade = new Trade(data).removeEmptyFields();

  console.log('Trade to be deleted: ', trade);

  getDBInstance()
    .then(db => {
      const tradesCollection = db.collection('trades');

      tradesCollection
        .deleteOne({ _id: ObjectID(trade._id) })
        .then(result => {
          console.log('Result: ', result.deletedCount);

          if (result.deletedCount) {
            // Update journal information
            const usersCollection = db.collection('users');
            const username = req.session.username;

            usersCollection
              .findOne({ username: username }, { projection: { journals: 1 } })
              .then(result => {
                if (result) {
                  console.log('Journals: ', result.journals);
                  const tradeJournal = result.journals.find(
                    journal => journal.journalID === trade.journalID
                  );

                  const { totalProfit, balance, loseRate } = tradeJournal;
                  const { winningTrades, losingTrades, winRate } = tradeJournal;

                  const journalUpdate = {
                    totalProfit,
                    balance,
                    loseRate,
                    winRate,
                    winningTrades,
                    losingTrades,
                  };

                  console.log('Deleted Trade: ', trade);
                  const plValue = Number(trade.pl);

                  if (plValue > 0) {
                    // Profit
                    journalUpdate.winningTrades =
                      journalUpdate.winningTrades - 1;
                  } else {
                    journalUpdate.losingTrades = journalUpdate.losingTrades - 1;
                  }

                  journalUpdate.winRate =
                    (journalUpdate.winningTrades /
                      (journalUpdate.winningTrades +
                        journalUpdate.losingTrades)) *
                    100;

                  journalUpdate.loseRate =
                    (journalUpdate.losingTrades /
                      (journalUpdate.winningTrades +
                        journalUpdate.losingTrades)) *
                    100;

                  journalUpdate.balance = journalUpdate.balance - plValue;

                  journalUpdate.totalProfit =
                    journalUpdate.totalProfit - plValue;

                  const tempJournal = new Journal(journalUpdate)
                    .removeEmptyFields()
                    .convertMongoTypes({ createMode: false });

                  const journalUpdateDetails = appendPropertyName(
                    tempJournal,
                    'journals.$'
                  );

                  console.log('JournalUpdate Details: ', journalUpdateDetails);

                  usersCollection
                    .findOneAndUpdate(
                      {
                        username: username,
                        'journals.journalID': trade.journalID,
                      },
                      { $set: journalUpdateDetails },
                      { projection: { password: 0 }, returnOriginal: false }
                    )
                    .then(result => {
                      if (result.lastErrorObject.updatedExisting) {
                        res.status(200).json({
                          app: {
                            userInfo: result.value,
                          },
                          flags: { isDeleted: true },
                        });
                      } else {
                        executionError(
                          res,
                          500,
                          updateerror,
                          'Could not update journal. Contact Support'
                        );
                      }
                    })
                    .catch(err => {
                      dbOperationError(res, err, err.stack);
                    });
                } else {
                  executionError(
                    res,
                    500,
                    notfounderror,
                    'Unable to find journal related to trade. Contact Support'
                  );
                }
              })
              .catch(err => {
                dbOperationError(res, err, err.stack);
              });
          } else {
            res.status(500).json({
              app: {
                error: {
                  type: deleteerror,
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

      if (!trade.comment) {
        trade.comment = 'N/A';
      }

      trade.userID = req.session.userID;

      console.log('Trade to be inserted: ', trade);
      tradesCollection
        .insertOne(trade)
        .then(result => {
          // console.log('Insert Result: ', result);
          if (result.insertedCount) {
            console.log('Trade Inserted...');
            const insertedTrade = result.ops;
            // Update journal information
            const usersCollection = db.collection('users');
            const username = req.session.username;

            usersCollection
              .findOne({ username: username }, { projection: { journals: 1 } })
              .then(result => {
                if (result) {
                  // console.log('Journals: ', result.journals);
                  const tradeJournal = result.journals.find(
                    journal => journal.journalID === trade.journalID
                  );

                  const { totalProfit, balance, loseRate, startCapital } =
                    tradeJournal;
                  const { winningTrades, losingTrades, winRate } = tradeJournal;

                  const journalUpdate = {
                    totalProfit,
                    balance,
                    loseRate,
                    winRate,
                    winningTrades,
                    losingTrades,
                  };

                  console.log('Inserted Trade: ', trade);
                  const plValue = Number(trade.pl.value);
                  console.log('PLValue: ', plValue);

                  if (plValue > 0) {
                    // Profit
                    journalUpdate.winningTrades =
                      journalUpdate.winningTrades + 1;
                  } else {
                    journalUpdate.losingTrades = journalUpdate.losingTrades + 1;
                  }

                  journalUpdate.winRate =
                    (journalUpdate.winningTrades /
                      (journalUpdate.winningTrades +
                        journalUpdate.losingTrades)) *
                    100;
                  journalUpdate.loseRate =
                    (journalUpdate.losingTrades /
                      (journalUpdate.winningTrades +
                        journalUpdate.losingTrades)) *
                    100;

                  journalUpdate.balance = journalUpdate.balance + plValue;

                  journalUpdate.totalProfit =
                    journalUpdate.totalProfit + plValue;

                  const tempJournal = new Journal(journalUpdate)
                    .removeEmptyFields()
                    .convertMongoTypes({ createMode: false });

                  const journalUpdateDetails = appendPropertyName(
                    tempJournal,
                    'journals.$'
                  );

                  console.log('JournalUpdate Details: ', journalUpdateDetails);

                  usersCollection
                    .findOneAndUpdate(
                      {
                        username: username,
                        'journals.journalID': trade.journalID,
                      },
                      { $set: journalUpdateDetails },
                      { projection: { password: 0 }, returnOriginal: false }
                    )
                    .then(result => {
                      if (result.lastErrorObject.updatedExisting) {
                        res.status(201).json({
                          app: {
                            newTrade: insertedTrade,
                            userInfo: result.value,
                          },
                          flags: { isCreated: true },
                        });
                      } else {
                        executionError(
                          res,
                          500,
                          updateerror,
                          'Could not update journal. Contact Support'
                        );
                      }
                    })
                    .catch(err => {
                      dbOperationError(res, err, err.stack);
                    });
                } else {
                  executionError(
                    res,
                    500,
                    notfounderror,
                    'Unable to find journal related to trade. Contact Support'
                  );
                }
              })
              .catch(err => {
                dbOperationError(res, err, err.stack);
              });
          } else {
            res.status(500).json({
              app: {
                error: {
                  type: inserterror,
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
router.get('/recentTrades', async (req, res) => {
  console.log('Getting Recent Trades....');

  const { userID } = req.session;

  getDBInstance()
    .then(db => {
      const tradeCollection = db.collection('trades');

      tradeCollection
        .find({ userID: ObjectID(userID) }, { limit: 10 })
        .toArray((err, result) => {
          if (err) {
            dbOperationError(res, err, err.stack);
            return;
          }

          // console.log('Result: ', result);

          if (result) {
            // Return trades to client
            res.status(200).json({
              app: { recentTrades: result.length ? result : 'NA' },
            });
          } else {
            // Send error when result is undefined
            executionError(
              res,
              500,
              notfounderror,
              'There was an error in recent trades search. Contact Support'
            );
          }
        });
    })
    .catch(err => {
      serverErrorFound(res, err, err.stack);
    });
});

//========== Preferences ========//
router.use('/preferences', prefRoutes);

//========== Profie ========//
router.use('/profile', profileRoutes);

export default router;
