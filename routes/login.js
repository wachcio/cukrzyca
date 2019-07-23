var express = require("express");
var router = express.Router();
var sha256 = require("sha256");
var mysql = require("mysql");
const passport = require("passport");
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

// const checkLoginPassword = (login, password) => {
//    var query =
//       "SELECT `ID`, `login`, `password`, `is_admin`, `name` FROM `users` WHERE `login`='" +
//       login +
//       "' AND `password`='" +
//       sha256(password) +
//       "'";
//    console.log(query);

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
router.get("/", function(req, res, next) {
   let err = global.app.error;
   //  req.params.error ? (err = req.params.error) : (err = "");
   //  console.log("err", req.query);

   res.render("login", { title: "Logowanie", err });
});
router.post("/", (req, res, next) => {
   passport.authenticate("local", (err, user, info) => {
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

// router.post("/", function(req, res, next) {
//    console.log(req.body);

//    global.app.error = "";
//    if (req.body.error) {
//       let err = "";
//       req.body.error ? (err = req.body.error) : (err = "");
//       //  console.log("err", req.query);

//       res.render("login", { title: "Logowanie", err });
//    }

//    const body = req.body;
//    var query =
//       "SELECT `ID`, `login`, `password`, `is_admin`, `name` FROM `users` WHERE `login`='" +
//       body.login +
//       "' AND `password`='" +
//       sha256(body.password) +
//       "'";
//    console.log(query);

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
//       console.log(rows[0]);

//       if (err) {
//          res.json(err);
//          next(err);
//       } else if (rows[0] == undefined) {
//          //  res.json({ error: "Incorrect login or password" });
//          //  const error = "Incorrect login or password";
//          //  res.redirect("/login/" + error);
//          // global.app.error = "Incorrect login or password";
//          //  global.app.loginUserName = "";
//          req.session = null;
//          //  req.session.loginUserName = " ";
//          res.redirect("/");
//          return;
//       } else if (rows[0].is_admin == 1) {
//          //  console.log("admin", rows[0].is_admin);

//          req.session.admin = 1;
//          req.session.loginUserName = rows[0].name;
//          req.session.login = rows[0].login;
//          req.session.ID = rows[0].ID;
//          //  global.app.loginUserName = rows[0].name;
//          // res.redirect("/admin");
//          res.json(req.session);
//          return;
//       }
//       // console.log("login", rows[0].login);
//       req.session.user = 1;
//       req.session.loginUserName = rows[0].name;
//       req.session.login = rows[0].login;
//       req.session.ID = rows[0].ID;
//       // global.app.loginUserName = rows[0].name;
//       // res.redirect("/userPanel");
//       res.json(req.session);
//       return;
//    });
//    connection.end();
// });

module.exports = router;
