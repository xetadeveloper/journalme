// Modules
import { Router } from 'express';
import { User } from '../Database/Models/models.js';
import { getDBInstance } from '../Database/mongoDB.js';
import bcrypt from 'bcrypt';
import {
  dbOperationError,
  emptyRequestBodyError,
  serverErrorFound,
} from '../Utility/errorHandling.js';

import userRoutes from './UserRoutes/userRoutes.js';

// Middleware
import { isLoggedIn } from '../Middlewares/middleware.js';

const router = Router();

const SALT_ROUNDS = 10;

// User log in
router.post('/login', async (req, res) => {
  // Check database for user
  console.log('Logging User In: ', req.body);

  if (!Object.entries(req.body).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { username, password, saveLogin } = req.body;
  // console.log('Session: ', req.session);

  // Check for user
  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');

      // Find user
      usersCollection
        .findOne({ username: username })
        .then(user => {
          if (user) {
            // Compare Passwords
            bcrypt
              .compare(password, user.password)
              .then(compareResult => {
                if (compareResult) {
                  console.log('User Found');

                  delete user.password;

                  // If user request to remember session
                  if (saveLogin) {
                    console.log('Save login enabled');
                    console.log(
                      'user preferences: ',
                      user.preferences.saveSession
                    );
                    if (!user.preferences.saveSession) {
                      console.log('Changing user preferences to save session');
                      // run an update for save session if it is false
                      usersCollection
                        .updateOne(
                          { username: user.username },
                          { $set: { 'preferences.saveSession': true } }
                        )
                        .then(result => {
                          // console.log('Result: ', result);
                          if (result.modifiedCount > 0) {
                            console.log('Session option updated...');
                            req.session.userID = user._id;
                            req.session.username = user.username;

                            user.preferences.saveSession = true;

                            res.status(200).json({
                              app: {
                                isLoggedIn: true,
                                userInfo: user,
                              },
                            });
                          } else {
                            console.log('Could not update save session data');
                            res.status(500).json({
                              error: {
                                type: 'updateerror',
                                message: 'Could not update save session data',
                              },
                            });
                          }
                        })
                        .catch(err => {
                          dbOperationError(
                            res,
                            err,
                            'Error updating user preferences'
                          );
                        });
                    } else {
                      console.log(
                        'User preferences was already set to save session'
                      );
                      req.session.userID = user._id;
                      req.session.username = user.username;
                      res.status(200).json({
                        app: {
                          isLoggedIn: true,
                          userInfo: user,
                        },
                      });
                    }
                  } else {
                    // Save session
                    console.log('Save login disabled');
                    req.session.cookie.expires = false;
                    req.session.userID = user._id;
                    req.session.username = user.username;

                    res.status(200).json({
                      app: {
                        isLoggedIn: true,
                        userInfo: user,
                      },
                    });
                  }
                }
              })
              .catch(err => {
                serverErrorFound(
                  res,
                  err,
                  'Error comparing passwords in login'
                );
              });
          } else {
            res.status(200).json({
              app: {
                error: {
                  type: 'inputerror',
                  errorFields: [
                    {
                      field: 'username',
                      message: `User with username ${username} does not exist`,
                    },
                  ],
                },
              },
              flags: {
                isError: true,
              },
            });
          }
        })
        .catch(err => {
          dbOperationError(res, err, err.stack);
        });
    })
    .catch(err => {
      serverErrorFound(res, err, 'Error getting DB instance');
    });
});

// For registering new users
router.post('/signup', async (req, res) => {
  // Check database for user
  console.log('Registering User: ', req.body);

  if (!Object.entries(req.body).length) {
    emptyRequestBodyError(res);
    return;
  }

  const { username, password, email, firstname, lastname } = req.body;

  // Check for existing email
  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');

      usersCollection
        .findOne({ email: email })
        .then(emailResult => {
          // console.log('Result: ', emailResult);
          if (emailResult) {
            console.log('User with email exists already...');
            res.status(400).json({
              app: {
                error: {
                  type: 'inputerror',
                  errorFields: [
                    {
                      field: 'username',
                      message:
                        'User with this email exists already, log in instead',
                    },
                  ],
                },
              },
              flags: {
                isError: true,
              },
            });
          } else {
            // Check for existing username
            usersCollection
              .findOne({ username: username })
              .then(usernameResult => {
                if (usernameResult) {
                  console.log('Username already taken...');
                  res.status(400).json({
                    app: {
                      error: {
                        type: 'inputerror',
                        errorFields: [
                          {
                            field: 'username',
                            message: 'Username already taken',
                          },
                        ],
                      },
                    },
                    flags: {
                      isError: true,
                    },
                  });
                } else {
                  // hash password
                  // console.log('User is about to be created...');
                  const userDetails = new User(req.body).removeEmptyFields();

                  userDetails.preferences = {
                    strategies: [],
                    currency: 'USD',
                    saveSession: false,
                  };

                  userDetails.journals = [];

                  userDetails.encryptPassword().then(user => {
                    // Create User
                    usersCollection
                      .insertOne(user)
                      .then(result => {
                        // console.log('Insert Result: ', result);
                        if (result.insertedCount > 0) {
                          delete result.ops[0].password;
                          
                          console.log('User created successfully...');
                          req.session.userID = result.ops[0]._id;
                          req.session.username = username;
                          res.status(201).json({
                            app: {
                              success: true,
                              isLoggedIn: true,
                              userInfo: result.ops[0],
                            },
                          });
                        } else {
                          res.status(500).json({
                            app: {
                              error: {
                                type: 'inserterror',
                                message:
                                  'User was not created. Contact Support',
                              },
                            },
                            flags: { isError: true },
                          });
                        }
                      })
                      .catch(err => {
                        dbOperationError(res, err, 'Error inserting user data');
                      });
                  });
                }
              })
              .catch(err => {
                dbOperationError(res, err, 'Error searching for username');
              });
          }
        })
        .catch(err => {
          dbOperationError(res, err, 'Error searching for email');
        });
    })
    .catch(err => {
      serverErrorFound(res, err, 'Error getting DB instance');
    });
});

// For Logging users out
router.post('/logout', async (req, res) => {
  console.log('Logging Out');

  getDBInstance()
    .then(db => {
      const usersCollection = db.collection('users');

      usersCollection
        .updateOne(
          { _id: req.session.userID },
          { $set: { 'preferences.saveSession': false } }
        )
        .then(() => {
          req.session.destroy();
          res.status(200).json({ app: { isLoggedIn: false } });
        })
        .catch(err => {
          dbOperationError(res, err, err.stack);
        });
    })
    .catch(err => {
      serverErrorFound(res, err, 'Error getting DB instance in logout');
    });
});

//For user routes
router.use('/:user', isLoggedIn, userRoutes);

export { router as postRoutes };

// (req, res, next) => {
//   req.user = req.params.user;
//   console.log('Here  here');
//   next();
// },
