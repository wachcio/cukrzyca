var express = require("express");
var router = express.Router();
var sha256 = require("sha256");
var mysql = require("mysql");
const passport = require("passport");
const bodyParser = require("body-parser");

// getting the local authentication type
const LocalStrategy = require("passport-local").Strategy;
// let users = [
//    {
//       id: 1,
//       name: "wachcio",
//       email: "wachcio",
//       password: "123"
//    },
//    {
//       id: 2,
//       name: "Emma",
//       email: "emma@email.com",
//       password: "password2"
//    }
// ];

// const checkLoginPassword = (login, password) => {
//    var query =
//       "SELECT `ID`, `login`, `password`, `is_admin`, `name` FROM `users` WHERE `login`='" +
//       login +
//       "' AND `password`='" +
//       sha256(password) +
//       "'";
//    // console.log(query);

//    var connection = mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       timezone: process.env.TZ,
//       multipleStatements: true,
//       charset: "utf8_general_ci"
//       // debug: true
//    });
//    connection.connect();

//    connection.query(query, function(err, rows, fields) {
//       if (err || rows[0] == undefined) {
//          return { error: "Incorrect login or password" };
//          //  next(err);
//       }

//       // console.log("login", rows[0].login);

//       return { rows };
//    });
//    connection.end();
// };

/* GET home page. */
// router.get("/", function(req, res, next) {
//    let err = global.app.error;
//  req.params.error ? (err = req.params.error) : (err = "");
//  console.log("err", req.query);

// res.render("login", { title: "Logowanie", err });
// });

passport.use(
   new LocalStrategy(
      {
         usernameField: "login",
         passwordField: "password"
      },
      (username, password, done) => {
         let user = global.app.users.find(user => {
            // console.log("login1", user.login);
            // console.log("login1", username);

            // console.log("login2", user.password);
            // console.log("login2", sha256(password));

            return (
               user.login === username && user.password === sha256(password)
            );
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
   console.log("user", user);

   done(null, user.ID);
});

passport.deserializeUser((id, done) => {
   let user = global.app.users.find(user => {
      console.log(user.ID);
      console.log(id);

      return user.ID === id;
   });

   done(null, user);
});
router.post("/", (req, res, next) => {
   console.log("req", req.body);

   passport.authenticate("local", (err, user, info) => {
      // user = true;
      if (err) {
         return next(err);
      }

      if (!user) {
         return res.status(400).send([user, "Cannot log in", info]);
      }

      req.login(user, err => {
         res.send("Logged in");
      });
   })(req, res, next);
});

//
module.exports = router;
