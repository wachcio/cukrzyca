var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");

const badParameters = err => {
   return {
      error: err
   };
};

router.get("/:id", function(req, res, next) {
   console.log("id", req.params.id);

   let id = req.params.id;

   if (!_.isNumber(Number(id))) res.json(badParameters("ID is not correct"));

   var query = "SELECT * FROM `users` WHERE `ID`=" + id;
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

      res.json(rows);
   });
   connection.end();
});

module.exports = router;
