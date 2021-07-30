// Dummy Journal Data
export const dummyJournals = [
  {
    name: 'Strollpy Strategy Journal',
    currency: 'GBP/USD',
    tradeNo: 14,
    tradeWins: 10,
    tradeLosses: 4,
    balance: 500,
    strategyList: ['End Day', 'PFL Strategy', 'Asian Night', 'Swing Day'],
    trades: [
      {
        tradeID: 1,
        strategy: 'Swing Day',
        leverage: '200',
        tradeSize: '500',
        profitLoss: '500',
        tradeStatus: 'Win',
        entryTime: '05:30',
        exitTime: '09:30',
        entryDate: '2020-01-20',
        exitDate: '2020-01-22',
        commission: '2.50',
        comments: 'Market was ranging when this trade was taken',
      },
      {
        tradeID: 2,
        strategy: 'Swing Day',
        leverage: '500',
        tradeSize: '300',
        profitLoss: '-200',
        tradeStatus: '',
        entryTime: '',
        exitTime: '',
        entryDate: '2020-01-23',
        exitDate: '2020-01-22',
        commission: '',
        comments: '',
      },
      {
        tradeID: 3,
        strategy: 'Asian Night',
        leverage: '1000',
        tradeSize: '500',
        profitLoss: '200',
        tradeStatus: '',
        entryTime: '',
        exitTime: '',
        entryDate: '2020-05-12',
        exitDate: '2020-01-22',
        commission: '',
        comments: '',
      },
      {
        tradeID: 4,
        strategy: 'PFL Strategy',
        leverage: '200',
        tradeSize: '200',
        profitLoss: '-500',
        tradeStatus: 'Lost',
        entryTime: '',
        exitTime: '',
        entryDate: '2021-12-05',
        exitDate: '2020-01-22',
        commission: '',
        comments: '',
      },
    ],
  },
  {
    name: 'Kruger Journal',
    currency: 'AUD/USD',
    tradeNo: 20,
    tradeWins: 7,
    tradeLosses: 13,
    balance: 700,
    strategyList: ['End Day', 'PFL Strategy', 'Asian Night', 'Swing Day'],
  },
  {
    name: 'Night Trade Journal',
    currency: 'CHF/JPY',
    tradeNo: 10,
    tradeWins: 8,
    tradeLosses: 2,
    balance: 1000,
    strategyList: ['End Day', 'PFL Strategy', 'Asian Night', 'Swing Day'],
  },
];

let dummyTradeRecords = {
  tradeDate: '20/05/2021',
  strategy: 'Swing Day',
  leverage: 'x200',
  tradeSize: '$500',
  profitLoss: '$500',
};
