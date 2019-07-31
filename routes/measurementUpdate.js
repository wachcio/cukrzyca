var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");
// var moment = require("moment");

const badParameters = err => {
   return {
      error: err
   };
};

router.patch("/", function(req, res, next) {
   let id = req.body.ID;
   console.log("body", req.body);
   let sugar_level = req.body.sugar_level;
   let insulin_dose = req.body.insulin_dose;
   let hour_of_measurement = req.body.hour_of_measurement;
   let date_of_measurement = req.body.date_of_measurement;

   // UPDATE `measurements` SET `sugar_level` = '333' WHERE `measurements`.`ID` = 2;
   // var query = `UPDATE measurements SET sugar_level = ${sugar_level}, insulin_dose = ${insulin_dose}, hour_of_measurement = ${hour_of_measurement}, date_of_measurement = ${date_of_measurement}  WHERE measurements.ID = ${id}`;
   // var query =
   //    "UPDATE `measurements` SET `sugar_level` = '" +
   //    sugar_level +
   //    "', `insulin_dose` = '" +
   //    insulin_dose +
   //    "', `hour_of_measurement` = '" +
   //    hour_of_measurement +
   //    "', `date_of_measurement` = '" +
   //    date_of_measurement +
   //    "'  WHERE `measurements`.`ID` = '" +
   //    id +
   //    "'";

   var query =
      "UPDATE ?? SET `sugar_level` = ?, `insulin_dose` = ?, `hour_of_measurement` = ?, `date_of_measurement` = ?  WHERE ??.?? = ?";
   // var query =
   //    "UPDATE ?? SET `sugar_level` = ?, `insulin_dose` = ?, `hour_of_measurement` = ?  WHERE ??.?? = ?";
   var inserts = [
      "measurements",
      sugar_level,
      insulin_dose,
      hour_of_measurement,
      date_of_measurement,
      "measurements",
      "ID",
      id
   ];
   // var inserts = [
   //    "measurements",
   //    sugar_level,
   //    insulin_dose,
   //    hour_of_measurement,
   //    "measurements",
   //    "ID",
   //    id
   // ];
   query = mysql.format(query, inserts);
   console.log(query);

   var connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: process.env.TZ,
      multipleStatements: true,
      charset: "utf8_general_ci",
      dateStrings: true,
      debug: true
   });
   connection.escape();
   connection.connect();
   connection.query(query, function(err, rows, fields) {
      if (err) {
         res.json(badParameters(err.code));
         next(err);
      }

      res.json(rows);
   });
   connection.end();
});

module.exports = router;
