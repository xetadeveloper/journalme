import { usersDummyData, tradesDummyData } from "./dummyData.js";

const usersSchema = {
  name: "users",
  dummyData: usersDummyData,
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "firstname", "lastname", "email", "password"],
      properties: {
        username: {
          bsonType: "string",
          description: "Must be present and a string",
        },
        password: {
          bsonType: "string",
          description: "Must be present and a string",
        },
        firstname: {
          bsonType: "string",
          description: "Must be present and a string",
        },
        lastname: {
          bsonType: "string",
          description: "Must be present and a string",
        },
        email: {
          bsonType: "string",
          description: "Must be present and a string",
        },
        preferences: {
          bsonType: "object",
          properties: {
            strategies: {
              bsonType: "array",
              items: {
                bsonType: "string",
                description: "Must be an array of string",
              },
            },
            currency: {
              type: "string",
              description: "Should be an enum of currency symbols",
            },
            saveSession: {
              bsonType: "boolean",
              description: "To save the user's session or not",
            },
          },
        },
        journal: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["journalName", "market", "startCapital"],
            properties: {
              journalName: {
                bsonType: "string",
                description: "Name of the journal",
              },
              journalDesc: {
                bsonType: "string",
                description: "additional description of journal",
              },
              market: {
                bsonType: "string",
                description: "The market the journal is meant for",
              },
              startCapital: {
                bsonType: "string",
                description: "Starting capital for that market",
              },
              totalProfit: {
                bsonType: "string",
                description: "Overall Profit/Loss",
              },
              winningTrades: {
                bsonType: "string",
                description: "No of winning trades",
              },
              losingTrades: {
                bsonType: "string",
                description: "No of losing trades",
              },
              winRate: { bsonType: "string", description: "Win rate" },
              loseRate: { bsonType: "string", description: "lose rate" },
              acctBalance: {
                bsonType: "string",
                description: "Account balancec after trades",
              },
            },
          },
        },
      },
    },
  },
};

const tradesSchema = {
  name: "trades",
  dummyData: tradesDummyData,
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "journalID",
        "capital",
        "tradesize",
        "strategy",
        "entryTime",
        "exitTime",
        "entryDate",
        "exitDate",
        "tradeStatus",
        "leverage",
        "commission",
        "pl",
        "comment",
      ],
      properties: {
        journalID: {
          bsonType: "objectID",
        },
        capital: {
          bsonType: "double",
        },
        tradesize: {
          bsonType: "double",
        },
        strategy: {
          bsonType: "string",
        },
        entryTime: {
          bsonType: "timestamp",
        },
        exitTime: {
          bsonType: "timestamp",
        },
        entryDate: {
          bsonType: "date",
        },
        exitDate: {
          bsonType: "date",
        },
        tradeStatus: {
          enum: ["Win", "Lost"],
        },
        leverage: {
          bsonType: "int",
        },
        commission: {
          bsonType: "double",
        },
        pl: {
          bsonType: "double",
        },
        comment: {
          bsonType: "date",
        },
      },
    },
  },
};

export const validationLevel = "strict";
export const validationAction = "error";
export const DBCollections = [usersSchema, tradesSchema];
