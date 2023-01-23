import './config.js';
import express from 'express';
import path from 'path';
import session from 'express-session';
import mongoDBSession from 'connect-mongodb-session';
import { v4 as genUUID } from 'uuid';

import { getRoutes, postRoutes } from './Routes/routes.js';
import { serverErrorFound } from './Utility/errorHandling.js';
import { closeClientInstance, getDBInstance } from './Database/mongoDB.js';
import { closeTransport } from './Utility/MailSender/mailSend.js';

const app = express();
const productionMode = process.env.NODE_ENV == 'production';
const clientIndexPath = path.join(path.resolve(), '../client', 'build', 'index.html');
const buildPath = path.join(path.resolve(), '../client', 'build');

console.log('Build path: ', buildPath);
console.log('Environment: ', process.env.NODE_ENV);

const dbUrl = productionMode ? process.env.prodDBUrl : process.env.devDBUrl;

// Configure DB
getDBInstance().then(() => {
    // console.log('Done with DB setup...');
});

// For handling session
const MongoDBSession = mongoDBSession(session);
const store = new MongoDBSession({
    uri: dbUrl,
    collection: 'journalMeSession',
});

app.use(
    session({
        genid: () => genUUID(),
        secret: process.env.sessionSecret,
        saveUninitialized: false,
        resave: false,
        store,
    })
);

// Handling JSON
app.use(express.json());

// Parsing url queries
app.use(express.urlencoded({ extended: true }));

app.use(express.static(buildPath));

// Handling all api requests
app.use('/api', getRoutes, postRoutes);

app.get('/test', (req, res) => {
    console.log('Server Test Route...');
    res.send('Server is up and running...');
});

// Serve react app here
if (productionMode || true) {
    app.get('/*', (req, res) => {
        // console.log('Client url: ', clientUrl);
        res.sendFile(clientIndexPath);
    });
}

// Handle all errors
app.use((err, req, res, next) => {
    console.log('ServerErroFound: An error was thrown');
    serverErrorFound(res, err, `An error occured on the server: ${err.stack}`);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Handle other errors that cause app to exit, for cleanup
// process.on('exit', number => {
//     console.log(`App exited with code: ${number}`);
//     closeClientInstance();
//     closeTransport();
// });

// process.on('SIGINT', number => {
//     console.log(`App exited with code: ${number}`);
//     closeClientInstance();
//     closeTransport();
// });
