import { Journal } from './Models/models.js';

// Can't pass in dummy data yet cause of the referential stuff
export const usersDummyData = [{}, {}];
export const tradesDummyData = [{}, {}];

export const dummyUser = {
  username: 'linda',
  password: 'linda',
  firstname: 'Linda',
  lastname: 'Powell',
  email: 'linda@gmail.com',
};

export const dummyUserUpdate = {
  firstname: 'Linda',
  lastname: 'Powell',
  email: 'linda@gmail.com',
};
// const formData = new For();
// create a form data for the dummy
// dummyUserUpdate =

export const dummyJournal = {
  journalID: 'dae5a4bc-c641-4a6c-a0f1-848dfaeb9a07',
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

export const dummyMail = {
  email: 'jared@gmail.com',
  message:
    "Hi, I'm Jared, I'll like to know more about your services. \nEmail me sometime yeah",
};

export const dummyJournalUpdate = {
  journalID: 'f1dba1ed-9503-4262-b23a-4727d44ad740',
  journalName: 'Stroller Journals Test',
  journalDesc: 'Logging the stroller strategy trades',
  market: 'AUD/NZD',
  startCapital: 900,
  balance: 12000,
};

export const dummyJournalDelete = {
  journalID: 'c1430a27-049f-46b1-9fcf-7dc001c9c70b',
};

export const dummyTradeQuery = {
  userID: '6107d14427fb5a34e4bd9af0',
  journalID: 'dae5a4bc-c641-4a6c-a0f1-848dfaeb9a07',
};

export const dummyTrade = {
  journalID: '2f580c4c-7586-4218-97bd-26ef5a197a3e',
  userID: '6113c06d2f4ff227d4fafce3',
  tradesize: '200',
  strategy: 'End Day',
  entryTime: '05:30',
  exitTime: '07:20',
  entryDate: '2021-10-25',
  exitDate: '2021-10-26',
  tradeStatus: 'Win',
  leverage: '200',
  commission: '0.03',
  pl: '300',
  comment: 'Felt like it was a good trade',
};

export const dummyTradeDelete = {
  tradeID: '6112a1d1d2dcc930240847d0',
};

export const dummyTradeUpdate = {
  tradeID: '6113c41c0d4e51011429b28f',
  journalID: '2f580c4c-7586-4218-97bd-26ef5a197a3e',
  userID: '6107d14427fb5a34e4bd9af0',
  tradesize: '600',
  tradeStatus: 'Lost',
  pl: '-450',
  comment: "Seems like PandL doesn't work well",
};

export const dummyStrategies = ['End Day', 'Monthly Setup', 'Asian Night'];

export const dummyPreferences = {
  strategy: dummyStrategies,
  currency: 'USD',
  saveSession: true,
};

export const dummyDeleteStrategy = { strategyName: 'Month;y Setup' };
