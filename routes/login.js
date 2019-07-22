var express = require("express");
var router = express.Router();
var sha256 = require("sha256");
var mysql = require("mysql");

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
router.post("/", function(req, res, next) {
   global.app.error = "";
   if (req.params.error) {
      let err = "";
      req.params.error ? (err = req.params.error) : (err = "");
      //  console.log("err", req.query);

      res.render("login", { title: "Logowanie", err });
   }

   const body = req.body;
   var query =
      "SELECT `ID`, `login`, `password`, `is_admin`, `name` FROM `users` WHERE `login`='" +
      body.login +
      "' AND `password`='" +
      sha256(body.password) +
      "'";
   console.log(query);

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

   connection.query(query, function(err, rows, fields) {
      console.log(rows[0]);

      if (err) {
         res.json(err);
         next(err);
      } else if (rows[0] == undefined) {
         //  res.json({ error: "Incorrect login or password" });
         //  const error = "Incorrect login or password";
         //  res.redirect("/login/" + error);
         global.app.error = "Incorrect login or password";
         global.app.loginUserName = "";
         res.redirect("/login/");
         return;
      } else if (rows[0].is_admin == 1) {
         //  console.log("admin", rows[0].is_admin);

         req.session.admin = 1;
         global.app.loginUserName = rows[0].name;
         res.redirect("/admin");
         return;
      }
      // console.log("login", rows[0].login);
      req.session.user = 1;
      global.app.loginUserName = rows[0].name;
      res.redirect("/userPanel");
      return;
   });
   connection.end();
});

module.exports = router;
