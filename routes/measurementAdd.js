var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");
var moment = require("moment");

const checkParameters = par => {
   var parOk = false;
   console.log(par);

   if (
      !!par.hour_of_measurement &&
      // !_.trim(par.date_of_birth_child) &&
      _.isNumber(Number(par.sugar_level)) &&
      _.isNumber(Number(par.hour_of_measurement)) &&
      Number(par.hour_of_measurement) >= 0 &&
      Number(par.hour_of_measurement) <= 24 &&
      moment(par.date_of_measurement, "YYYY-MM-DD", true).isValid()
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

router.post("/", function(req, res, next) {
   // let id = req.query.ID;
   let ID_user = _.trim(req.body.ID_user);
   let sugar_level = _.trim(req.body.sugar_level);
   let insulin_dose = req.body.insulin_dose;
   let hour_of_measurement = req.body.hour_of_measurement;
   let date_of_measurement = req.body.date_of_measurement;
   // let date_added = req.query.date_added;

   // var query = "SELECT * FROM `users`";
   var query =
      "INSERT INTO `measurements` (`ID`, `ID_user`, `sugar_level`, `insulin_dose`, `hour_of_measurement`, `date_of_measurement`, `date_added`) VALUES (NULL, '" +
      ID_user +
      "', '" +
      sugar_level +
      "', '" +
      insulin_dose +
      "', '" +
      hour_of_measurement +
      "', '" +
      date_of_measurement +
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
         hour_of_measurement,
         date_of_measurement
      }) == false
   )
      return res.json("400", badParameters("Bad parameters"));

   connection.connect();
   connection.query(query, function(err, rows, fields) {
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
