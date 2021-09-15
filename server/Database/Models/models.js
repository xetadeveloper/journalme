import mongoTypes from 'mongodb';
import { removeNull } from '../../Utility/utility.js';
import bcrypt from 'bcrypt';

const { Double, Int32, ObjectId } = mongoTypes;

// User Model
export class User {
  constructor(user) {
    this.username = '';
    this.password = '';
    this.email = '';
    this.firstname = '';
    this.lastname = '';

    if (user) {
      Object.assign(this, user);
    }
  }

  validateData() {
    let errArr = [];
    if (this.firstname && !typeof this.firstname === 'string') {
      errArr.push('firstname');
      // return false;
    }
    if (this.username && !typeof this.username === 'string') {
      errArr.push('username');
      // return false;
    }
    if (this.lastname && !typeof this.lastname === 'string') {
      errArr.push('lastname');
      // return false;
    }
    if (this.password && !typeof this.password === 'string') {
      errArr.push('password');
      // return false;
    } //Do better validation for the password
    if (this.email && !typeof this.email === 'string') {
      errArr.push('email');
      // return false;
    }

    if (errArr.length) {
      return errArr;
    }

    return true;
  }

  removeEmptyFields() {
    return removeNull.call(this);
  }

  async encryptPassword() {
    if (this.password) {
      const SALT_ROUNDS = 12;
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      console.log('Password : ', this.password);
      const hash = await bcrypt.hash(this.password, salt);

      this.password = hash;
    }

    return this;
  }
}

// Journal Model
export class Journal {
  constructor(journalData) {
    this.journalID = '';
    this.journalName = '';
    this.journalDesc = '';
    this.market = '';
    this.startCapital = '';
    this.totalProfit = 0;
    this.winningTrades = 0;
    this.losingTrades = 0;
    this.balance = 0;
    this.loseRate = 0;
    this.winRate = 0;

    if (journalData) {
      Object.assign(this, journalData);
    }
  }

  convertMongoTypes() {
    const mongoTypes = {
      journalID: this.journalID,
      journalName: this.journalName,
      journalDesc: this.journalDesc,
      market: this.market,
      startCapital: this.startCapital ? Double(this.startCapital) : Double(0),
      totalProfit: this.totalProfit ? Double(this.totalProfit) : Double(0),
      winningTrades: this.winningTrades ? Int32(this.winningTrades) : Int32(0),
      losingTrades: this.losingTrades ? Int32(this.losingTrades) : Int32(0),
      balance: this.balance ? Double(this.balance) : Double(0),
      loseRate: this.loseRate ? Double(this.loseRate) : Double(0),
      winRate: this.winRate ? Double(this.winRate) : Double(0),
    };

    for (let prop in mongoTypes) {
      if (
        !mongoTypes[prop] ||
        (typeof mongoTypes[prop] === 'object' &&
          Object.keys(mongoTypes[prop]).indexOf('value') > -1 &&
          !mongoTypes[prop].value)
      ) {
        // delete mongoTypes[prop];
      }
    }

    return mongoTypes;
  }

  removeEmptyFields() {
    let complete = removeNull.call(this);
    return complete;
  }
}

// Preferences Model
export class Preferences {
  constructor(preferences) {
    this.strategies = '';
    this.saveSession = '';
    this.currency = '';

    if (preferences) {
      Object.assign(this, preferences);
    }
  }

  removeEmptyFields() {
    return removeNull.call(this);
  }
}

// Trade Model
export class Trade {
  constructor(trade) {
    // console.log('Trade: ', trade);
    this.journalID = '';
    this.userID = '';
    this.tradesize = '';
    this.strategy = '';
    this.entryTime = '';
    this.exitTime = '';
    this.entryDate = '';
    this.exitDate = '';
    this.tradeStatus = '';
    this.leverage = '';
    this.commission = '';
    this.pl = '';
    this.comment = '';

    if (trade) {
      Object.assign(this, trade);
    }
  }

  removeEmptyFields() {
    return removeNull.call(this);
  }

  convertMongoTypes() {
    // console.log('userID: ', this.userID);
    // console.log('COmments: ', this.comment);
    const mongoTypes = {
      journalID: this.journalID,
      tradesize: Double(this.tradesize),
      strategy: this.strategy,
      entryTime: this.entryTime,
      exitTime: this.exitTime,
      userID: this.userID ? ObjectId(this.userID) : null,
      entryDate: this.entryDate ? new Date(this.entryDate) : null,
      exitDate: this.exitDate ? new Date(this.exitDate) : null,
      tradeStatus: this.tradeStatus,
      leverage: Int32(this.leverage),
      commission: Double(this.commission),
      pl: Double(this.pl),
      comment: this.comment,
    };

    for (let prop in mongoTypes) {
      if (
        !mongoTypes[prop] ||
        (typeof mongoTypes[prop] === 'object' &&
          Object.keys(mongoTypes[prop]).indexOf('value') > -1 &&
          !mongoTypes[prop].value)
      ) {
        delete mongoTypes[prop];
      }
    }

    return mongoTypes;
  }
}
