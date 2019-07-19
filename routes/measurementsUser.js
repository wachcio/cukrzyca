var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");

const badParameters = err => {
   return {
      error: err
   };
};

router.get("/:userId", function(req, res, next) {
   console.log("userId", req.params.userId);

   let userId = req.params.userId;

   if (!_.isNumber(Number(userId)))
      res.json(badParameters("user ID is not correct"));

   var query = "SELECT * FROM `measurements` WHERE `ID_user`=" + userId;
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
   connection.query(query, function(err, rows, fields) {
      // if (err == "ER_DUP_ENTRY") res.json(badParameters("Duplicate key"));
      if (err) {
         // console.log(err);
         res.json(badParameters(err.code));
         next(err);
      }
      // console.log(_.isEmpty(rows));
      // if (_.isEmpty(rows)) badParameters(`User ID ${id} not exist`);
      // console.log("rows", rows[0] == undefined);
      // console.log(rows[0]);

      rows[0] == undefined
         ? res.json(badParameters(`User ID:${id} not exist`))
         : res.json(rows);
      // if (!_.isEmpty(rows)) {
      // res.json(rows);
      // } else {
      //    badParameters(`User ID ${id} not exist`);
      // }
   });
   connection.end();
});

module.exports = router;
