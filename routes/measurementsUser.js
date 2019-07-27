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
      daysOfweek.push({ day: moment(date).format("dddd DD-MM") });
      date = moment(date).add(1, "d");
   }
   return daysOfweek;
};

const writeResult = (rows, userId, dateFrom) => {
   let result = {};
   for (let i = 1; i <= 7; i++) {
      for (let j = 0; j < rows[i].length; j++) {
         let h = rows[i][j].hour_of_measurement;
         if (i == 1) {
            result[`h${h}y${i}`] = rows[i][j].sugar_level;
            rows[i][j].insulin_dose != 0
               ? (result[`h${h}y${i + 1}`] = rows[i][j].insulin_dose)
               : null;
         } else {
            result[`h${h}y${i * 2 - 1}`] = rows[i][j].sugar_level;

            rows[i][j].insulin_dose != 0
               ? (result[`h${h}y${i * 2}`] = rows[i][j].insulin_dose)
               : null;
         }
      }
   }
   // console.log("rows", rows[7]);

   // console.log(result);
   return result;
};

router.get("/:userId/:report?/:dateFrom?", function(req, res, next) {
   // console.log("userId", req.params.userId);

   let userId = req.params.userId;
   let report = req.params.report;
   let dateFrom = req.params.dateFrom;

   if (!_.isNumber(Number(userId)))
      res.json(badParameters("user ID is not correct"));

   var query =
      "SELECT * FROM `measurements` WHERE `ID_user`=" +
      userId +
      " ORDER BY `date_of_measurement` DESC";
   //  var query =
   // "INSERT INTO `users` (`ID`, `first_name`, `last_name`, `date_of_birth_child`, `date_added`) VALUES (NULL, 'ęóśąłżćńź', 'aa', '2019-07-19', CURRENT_TIMESTAMP);";
   var dateTmp = moment(new Date(dateFrom));

   if (dateFrom) {
      for (let i = 0; i < 7; i++) {
         // console.log(dateTmp);

         query =
            query +
            ";SELECT * FROM `measurements` WHERE `ID_user` = " +
            userId +
            " AND `date_of_measurement` = '" +
            moment(dateTmp).format("YYYY-MM-DD") +
            "'";
         dateTmp = moment(dateTmp).add(1, "d");
      }

      // console.log(query);
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
            global.appData.days = writeDaysOfWeek(dateFrom);
            delete global.appData.result;
            global.appData.result = writeResult(rows, userId, dateFrom);

            // jsonfile.writeFile(file, data, { spaces: 3 }, function(err) {
            //    if (err) console.error(err);

            res.redirect(`/user/${userId}/report/${dateFrom}`);
            // res.json(data);
            // });
         }
      }
   });
   connection.end();
});

module.exports = router;
