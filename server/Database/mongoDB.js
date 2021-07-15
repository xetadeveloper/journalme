import mongo from "mongodb";
import { serverErrorFound } from "../Utility/errorHandling.js";
import {
  DBCollections,
  validationAction,
  validationLevel,
} from "./validator.js";

const { MongoClient } = mongo;
const productionMode = process.env.NODE_ENV == "production";

const defaultDBName = process.env.defaultDBName;
const dbUrl = productionMode ? process.env.devDBUrl : process.env.prodDBUrl;

const DBPool = {};
let client;

async function connectDB(dbName = defaultDBName) {
  if (!client) {
    client = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
    } catch (err) {
      throw err;
    }
  }

  const db = client.db(dbName);

  if (!checkDBExists) {
    await configureDB(db, DBCollections, validationLevel, validationAction);
  }

  // Add to database pool
  DBPool[dbName] = db;

  return db;
}

async function checkDBExists(db, dbName) {
  let exists = false;
  await db
    .admin()
    .listDatabases()
    .then((list) => {
      list.forEach((database) => {
        if (database.name === dbName) {
          exists = true;
        }
      });
    });

  return exists;
}

async function configureDB(db, collections, validationLevel, validationAction) {
  try {
    // Setup DB for first time use
    collections.forEach((coll) => {
      db.createCollection(coll.name, {
        validator: coll.validator,
        validationAction,
        validationLevel,
      })
        .then((createdColl) => {
          console.log(`Collection ${coll.name} created...`);

          // if (!productionMode) {
          //   // Create dummy data
          //   createdColl.insertMany(coll.dummyData)
          // }
        })
        .catch((err) => {
          throw err;
        });
    });
  } catch (err) {
    throw err;
  }
}

export async function getDBInstance(dbName = defaultDBName) {
  if (DBPool[dbName]) {
    return DBPool[dbName];
  } else {
    try {
      connectDB(dbName).then((db) => {
        return db;
      });
    } catch (err) {
      throw err;
    }
  }
}

export function closeClientInstance() {
  if (client) {
    try {
      client.close();
      console.log("Client has been closed...");
    } catch (err) {
      throw err;
    }
  } else {
    console.log("Client was not initialized...");
  }
}
