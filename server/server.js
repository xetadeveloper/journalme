import "./config.js";
import express from "express";
import path from "path";
// import session from "express-session";
// import connect from "connect-mongodb-session";

import { getRoutes, postRoutes } from "./Routes/routes.js";
import { serverErrorFound } from "./Utility/errorHandling.js";
import { closeClientInstance } from "./Database/mongoDB.js";

const app = express();
const productionMode = process.env.NODE_ENV == "production";

// Handling JSON
app.use(express.json());

// Parsing url queries
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(path.resolve(), "client", "build")));

// Handling all api requests
app.use("/api", getRoutes, postRoutes);

// Serve react app here
app.get("/", (req, res) => {
  console.log("Server Home Route...");
  res.send("Server is up and running...");
});

if (productionMode) {
  app.get("/*", (req, res) => {
    res.sendFile(path.join(path.resolve(), "client", "build", "index.html"));
  });
}

// Handle all errors
app.use((err, req, res, next) => {
  console.log("ServerErroFound: An error was thrown");
  serverErrorFound(res, err, `An error occured on the server: ${err.stack}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Handle other errors that cause app to exit, for cleanup
process.on("exit", (number) => {
  console.log(`App exited with code: ${number}`);
  closeClientInstance();
});

process.on("SIGINT", (number) => {
  console.log(`App exited with code: ${number}`);
  closeClientInstance();
});
