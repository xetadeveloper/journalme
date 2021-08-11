import {
  Journal,
  Preferences,
  Trade,
  User,
} from './server/Database/Models/models.js';
import mongoTypes from 'mongodb';
import { v4 as genUUID } from 'uuid';
import { appendPropertyName } from './server/Utility/utility.js';
import {
  dummyPreferences,
  dummyTrade,
  dummyUser,
} from './server/Database/dummyData.js';
const { Double, Int32, ObjectId } = mongoTypes;

let dummy = {
  journalID: genUUID(),
  journalName: 'Stroller Journal',
  journalDesc: 'Logging the stroller strategy trades',
  market: 'GBP/USD',
  startCapital: 500,
  totalProfit: 200,
  winningTrades: 10,
  losingTrades: 7,
  balance: 700,
  loseRate: 40,
  winRate: 60,
};

// let appended = appendPropertyName(dummy, 'journal.$');

// console.log(appended);

// console.log(ObjectId('611264db976aaf2aa850f2a9'));

// let trade = new Trade(dummyTrade);
// console.log('MOng Types Coneversions', trade.convertMongoTypes());

// console.log(new Date('2017-05-19').toDateString());

// let obj = { name: 'Ade', age: 25, tovalue: {} };

const dummyUpdate = {
  journalID: 'dae5a4bc-c641-4a6c-a0f1-848dfaeb9a07',
  userID: '6107d14427fb5a34e4bd9af0',
  tradesize: '600',
  tradeStatus: 'Lost',
  pl: '-450',
  comment: "Seems like PandL doesn't work well",
};

const pref = new Preferences(dummyPreferences);

new User(dummyUser).encryptPassword().then(user => {
  console.log('User: ', user);
});
