var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");
var sha256 = require("sha256");

router.get("/", function(req, res, next) {
   //  res.charset = "latin2";
   let id = req.query.ID;
   let first_name = req.query.first_name;
   let last_name = req.query.last_name;
   let date_of_birth_child = req.query.date_of_birth_child;
   let date_added = req.query.date_added;

   var query =
      "SELECT `ID`, `first_name`, `last_name`, `name`, `date_of_birth_child`, `date_added` FROM `users`";
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
      if (err) throw err;
      // console.log(rows[0].password == sha256("123"));

      res.json(rows);
   });
   connection.end();
});

module.exports = router;
