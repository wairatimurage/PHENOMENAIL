const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const passport = require("passport");
const session = require("express-session");

// local imports
const initializePassport = require("./passport-config");

// local variables
const MONGODB_URI = "mongodb://localhost/boilerplate";
const PORT = 3400;
const app = express();
const pathToKey = path.join(__dirname, "./cryptography/id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf-8");

// connecting db
const db = mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err
      ? console.log(`there is a problem: ${err.message}`)
      : console.log("DB successfully connected");
  }
);
// maintain connection to db
mongoose.connection;

// setup session management to allow for a logged in user session to be maintained
app.use(
  session({
    secret: PUB_KEY,
    resave: true,
    saveUninitialized: false,
  })
);
// declare and initialize passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

// allow for api to pare/recieve json in request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adding static files
app.use("/scripts", express.static(path.join(__dirname, "./frontend/scripts")));
app.use("/images", express.static(path.join(__dirname, "./frontend/assets")));
app.use(express.static(path.join(__dirname, "./frontend")));

app.use(require("./routes"));

app.listen(PORT, () => console.log("App listening on port %s", PORT));
