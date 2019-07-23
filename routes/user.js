const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");

// getting the local authentication type
const LocalStrategy = require("passport-local").Strategy;
var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");
var moment = require("moment");
let users = [
   {
      id: 1,
      name: "wachcio",
      email: "wachcio",
      password: "123"
   },
   {
      id: 2,
      name: "Emma",
      email: "emma@email.com",
      password: "password2"
   }
];

const authMiddleware = (req, res, next) => {
   if (!req.isAuthenticated()) {
      res.status(401).send("You are not authenticated");
   } else {
      return next();
   }
};

const badParameters = err => {
   return {
      error: err
   };
};

const weekOfPregnancy = (date, dateFrom = new Date().getTime()) => {
   if (dateFrom != new Date().getTime()) {
      Date.parse(dateFrom);
      dateFrom = new Date(dateFrom).getTime();
   }

   date = new Date(date).getTime();
   let weeks = (date - dateFrom) / (1000 * 60 * 60 * 24 * 7);

   return Math.floor(40 - weeks);
};

router.get("/", authMiddleware, function(req, res, next) {
   let user = users.find(user => {
      return user.id === req.session.passport.user;
   });
   console.log([user, req.session]);
   res.send({ user: user });
});

router.get("/:id/:report?/:date?", function(req, res, next) {
   // console.log("id", req.params.id);

   let id = req.params.id;
   let report = req.params.report;
   let date = req.params.date;

   if (!_.isNumber(Number(id))) res.json(badParameters("ID is not correct"));

   var query =
      "SELECT `ID`, `first_name`, `last_name`, `name`, `date_of_birth_child`, `date_added` FROM `users` WHERE `ID`=" +
      id;
   //  var query =
   // "INSERT INTO `users` (`ID`, `first_name`, `last_name`, `date_of_birth_child`, `date_added`) VALUES (NULL, 'ęóśąłżćńź', 'aa', '2019-07-19', CURRENT_TIMESTAMP);";

   var connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: process.env.TZ,
      multipleStatements: true,
      charset: "utf8_general_ci"
      // debug: true
   });
   connection.connect();
   if (report != "report") {
      connection.query(query, function(err, rows, fields) {
         if (err) {
            res.json(badParameters(err.code));
            next(err);
         }
         rows[0] == undefined
            ? res.json(badParameters(`User ID:${id} not exist`))
            : res.json(rows);
      });
   } else {
      connection.query(query, function(err, rows, fields) {
         if (err) {
            res.json(badParameters(err.code));
            next(err);
         }

         global.appData.name = rows[0].name;
         if (moment(date, "YYYY-MM-DD").isValid) {
            global.appData.week_of_pregnancy = weekOfPregnancy(
               rows[0].date_of_birth_child,
               date
            );
         } else {
            global.appData.week_of_pregnancy = weekOfPregnancy(
               rows[0].date_of_birth_child
            );
         }

         res.redirect("/report");
      });
   }
   connection.end();
});
passport.use(
   new LocalStrategy(
      {
         usernameField: "email",
         passwordField: "password"
      },
      (username, password, done) => {
         let user = users.find(user => {
            return user.email === username && user.password === password;
         });

         if (user) {
            done(null, user);
         } else {
            done(null, false, { message: "Incorrect username or password" });
         }
      }
   )
);

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   let user = users.find(user => {
      return user.id === id;
   });

   done(null, user);
});
module.exports = router;
