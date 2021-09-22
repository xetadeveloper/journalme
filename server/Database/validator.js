import { usersDummyData, tradesDummyData } from './dummyData.js';

const usersSchema = {
  name: 'users',
  dummyData: usersDummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'firstname', 'lastname', 'email', 'password'],
      properties: {
        username: {
          bsonType: 'string',
          description: 'Must be present and a string',
        },
        password: {
          bsonType: 'string',
          description: 'Must be present and a string',
        },
        firstname: {
          bsonType: 'string',
          description: 'Must be present and a string',
        },
        lastname: {
          bsonType: 'string',
          description: 'Must be present and a string',
        },
        email: {
          bsonType: 'string',
          description: 'Must be present and a string',
        },
        userPic: {
          bsonType: 'object',
          properties: {
            picURL: {
              type: 'string',
              description: 'Should be an enum of currency symbols',
            },
            publicID: {
              type: 'string',
              description: 'Must be a string',
            },
          },
        },
        preferences: {
          bsonType: 'object',
          properties: {
            strategies: {
              bsonType: 'array',
              items: {
                bsonType: 'string',
                description: 'Must be an array of string',
              },
            },
            currency: {
              type: 'string',
              description: 'Should be an enum of currency symbols',
            },
            saveSession: {
              bsonType: 'bool',
              description: "To save the user's session or not",
            },
          },
        },
        journals: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['journalID', 'journalName', 'market', 'startCapital'],
            properties: {
              journalID: {
                bsonType: 'string',
                description: 'ID of the journal',
              },
              journalName: {
                bsonType: 'string',
                description: 'Name of the journal',
              },
              journalDesc: {
                bsonType: 'string',
                description: 'additional description of journal',
              },
              market: {
                bsonType: 'string',
                description: 'The market the journal is meant for',
              },
              startCapital: {
                bsonType: 'double',
                description: 'Starting capital for that market',
              },
              totalProfit: {
                bsonType: 'double',
                description: 'Overall Profit/Loss',
              },
              winningTrades: {
                bsonType: 'int',
                description: 'No of winning trades',
              },
              losingTrades: {
                bsonType: 'int',
                description: 'No of losing trades',
              },
              balance: {
                bsonType: 'double',
                description: 'Account balance after trades',
              },
              loseRate: {
                bsonType: 'double',
                description: 'Trades lose rate',
              },
              winRate: {
                bsonType: 'double',
                description: 'Trades Win rate',
              },
            },
          },
        },
      },
    },
  },
};

const tradesSchema = {
  name: 'trades',
  dummyData: tradesDummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'journalID',
        'userID',
        'tradesize',
        'strategy',
        'entryTime',
        'exitTime',
        'entryDate',
        'exitDate',
        'tradeStatus',
        'leverage',
        'commission',
        'pl',
        'comment',
      ],
      properties: {
        journalID: {
          bsonType: 'string',
        },
        userID: {
          bsonType: 'objectId',
        },
        tradesize: {
          bsonType: 'double',
        },
        strategy: {
          bsonType: 'string',
        },
        entryTime: {
          bsonType: 'string',
        },
        exitTime: {
          bsonType: 'string',
        },
        entryDate: {
          bsonType: 'date',
        },
        exitDate: {
          bsonType: 'date',
        },
        tradeStatus: {
          enum: ['Won', 'Lost'],
        },
        leverage: {
          bsonType: 'int',
        },
        commission: {
          bsonType: 'double',
        },
        pl: {
          bsonType: 'double',
        },
        comment: {
          bsonType: 'string',
        },
      },
    },
  },
};

export const validationLevel = 'strict';
export const validationAction = 'error';
export const DBCollections = [usersSchema, tradesSchema];
