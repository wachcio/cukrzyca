var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");
// var data = require("../helpers/data.json");
// const file = "./helpers/data.json";
// const jsonfile = require("jsonfile");

const moment = require("moment");

const badParameters = err => {
   return {
      error: err
   };
};

const writeDaysOfWeek = date => {
   let daysOfweek = [];
   moment.locale("pl");
   // console.log(moment(date).format("dddd"));

   for (let i = 0; i < 7; i++) {
      daysOfweek.push({ day: moment(date).format("dddd") });
      date = moment(date).add(1, "d");
   }
   return daysOfweek;
};

const writeResult = rows => {
   // console.log(rows[0][0].sugarLevelAVG);
   // console.log(rows[1][0].insulinDoseAVG);
   let result = {};

   for (let i = 0; i <= 14; i++) {
      if (i % 2 == 0) {
         if (rows[i]) {
            result[`avg${i + 1}`] = rows[i][0].sugarLevelAVG;
            console.log("I", rows[i][0]);
         }
      } else {
         if (rows[i]) {
            result[`avg${i + 1}`] = rows[i][0].insulinDoseAVG;
            console.log("S", rows[i][0]);
         }
      }
   }

   console.log(result);
   return result;
};

router.get("/:userId/:report?/:dateFrom?", function(req, res, next) {
   // console.log("userId", req.params.userId);

   let userId = req.params.userId;
   let report = req.params.report;
   let dateFrom = req.params.dateFrom;

   if (!_.isNumber(Number(userId)))
      res.json(badParameters("user ID is not correct"));

   var query = "";
   //  var query =
   // "INSERT INTO `users` (`ID`, `first_name`, `last_name`, `date_of_birth_child`, `date_added`) VALUES (NULL, 'ęóśąłżćńź', 'aa', '2019-07-19', CURRENT_TIMESTAMP);";
   var dateTmp = moment(new Date(dateFrom));

   if (dateFrom) {
      for (let i = 0; i < 7; i++) {
         // console.log(dateTmp);
         // SELECT AVG(`insulin_dose`) AS insulinDoseAVG FROM `measurements` WHERE `ID_user`=1 AND `date_of_measurement` = '2019-07-14' AND `insulin_dose` IS NOT NULL
         query =
            query +
            "SELECT AVG(`sugar_level`) AS sugarLevelAVG FROM `measurements` WHERE `ID_user`=" +
            userId +
            " AND `date_of_measurement` = '" +
            moment(dateTmp).format("YYYY-MM-DD") +
            "'  AND `sugar_level` > '0'" +
            ";SELECT AVG(`insulin_dose`) AS insulinDoseAVG FROM `measurements` WHERE `ID_user`=" +
            userId +
            " AND `date_of_measurement` = '" +
            moment(dateTmp).format("YYYY-MM-DD") +
            "' AND `insulin_dose` > '0';";
         dateTmp = moment(dateTmp).add(1, "d");
      }

      console.log(query);
   }

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
      if (err) {
         res.json(badParameters(err.code));
         next(err);
      }
      if (report != "report") {
         rows[0] == undefined
            ? res.json(badParameters(`User ID:${userId} not exist`))
            : res.json(rows);
      } else {
         if (moment(dateFrom, "YYYY-MM-DD").isValid) {
            delete global.appData.avg;
            global.appData.avg = writeResult(rows);

            res.redirect(`/measurementsUser/${userId}/report/${dateFrom}`);
            // res.json(global.appData);
         }
      }
   });
   connection.end();
});

module.exports = router;
