var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");
var moment = require("moment");

const badParameters = err => {
   return {
      error: err
   };
};

const weekOfPregnancy = date => {
   let today = new Date().getTime();
   date = new Date(date).getTime();
   // console.log(date);
   // console.log(today);

   let weeks = (date - today) / (1000 * 60 * 60 * 24 * 7);

   // console.log("weeks", Math.floor(40 - weeks));

   return Math.floor(40 - weeks);
};

router.get("/:id/:report?", function(req, res, next) {
   // console.log("id", req.params.id);

   let id = req.params.id;
   let report = req.params.report;

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
         // rows[0] == undefined
         //    ? res.json(badParameters(`User ID:${id} not exist`))
         //    : res.json(rows);

         var data = require("../helpers/data.json");
         const file = "./helpers/data.json";
         const jsonfile = require("jsonfile");
         data.name = rows[0].name;

         data.week_of_pregnancy = weekOfPregnancy(rows[0].date_of_birth_child);

         jsonfile.writeFile(file, data, { spaces: 2 }, function(err) {
            if (err) console.error(err);

            res.redirect("/report");
            // res.json(data);
         });
      });
   }
   connection.end();
});

module.exports = router;
