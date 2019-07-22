var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");
var moment = require("moment");
var sha256 = require("sha256");

const checkParameters = par => {
   var parOk = false;
   // console.log(par);

   if (
      !!par.first_name &&
      !!par.last_name &&
      !!par.password &&
      // !_.trim(par.date_of_birth_child) &&
      _.isString(par.first_name) &&
      _.isString(par.last_name) &&
      _.isString(par.password) &&
      moment(par.date_of_birth_child, "YYYY-MM-DD", true).isValid()
   ) {
      parOk = true;
   }
   // console.log(!!par.first_name);
   // console.log(!!par.last_name);
   // console.log(_.isString(par.first_name));
   // console.log(_.isString(par.last_name));
   // console.log(moment(par.date_of_birth_child, "YYYY-MM-DD", true).isValid());
   // console.log(parOk);

   if (parOk) return true;

   return false;
};

const badParameters = err => {
   return {
      error: err
   };
};

router.all("*", (req, res, next) => {
   if (!req.session.admin) {
      res.redirect("login");
      return;
   }
   next();
});

router.post("/", function(req, res, next) {
   // let id = req.query.ID;
   let first_name = _.trim(req.body.first_name);
   let last_name = _.trim(req.body.last_name);
   let password = String(req.body.password);
   let login = req.body.login;
   let is_admin = req.body.is_admin;
   let name = req.body.first_name + " " + req.body.last_name;
   let date_of_birth_child = req.body.date_of_birth_child;
   console.log(req.body);
   // let first_name = _.trim(req.query.first_name);
   // let last_name = _.trim(req.query.last_name);
   // let password = String(req.query.password);
   // let login = req.query.login;
   // let is_admin = req.query.is_admin;
   // let name = req.query.first_name + " " + req.query.last_name;
   // let date_of_birth_child = req.query.date_of_birth_child;
   // console.log(req.query);

   // let date_added = req.query.date_added;

   // var query = "SELECT * FROM `users`";
   var query =
      "INSERT INTO `users` (`ID`, `first_name`, `last_name`, `name`, `login`, `password`, `is_admin`, `date_of_birth_child`, `date_added`) VALUES (NULL, '" +
      first_name +
      "', '" +
      last_name +
      "', '" +
      name +
      "', '" +
      login +
      "', '" +
      sha256(password) +
      "', '" +
      is_admin +
      "', '" +
      date_of_birth_child +
      "', CURRENT_TIMESTAMP);";
   console.log(query);

   var connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: process.env.TZ,
      multipleStatements: true,
      charset: "utf8_general_ci"
   });

   // console.log(checkParameters(req.query));

   if (
      checkParameters({
         first_name,
         last_name,
         password,
         date_of_birth_child
      }) == false
   )
      return res.json(badParameters("Bad parameters"));

   connection.connect();
   connection.query(query, function(err, rows, fields) {
      if (err == "ER_DUP_ENTRY") res.json(badParameters("Duplicate key"));
      if (err) {
         // console.log(err);
         res.json(badParameters(err.code));
         next(err);
      }

      res.json(rows);
   });
   connection.end();
});

module.exports = router;
