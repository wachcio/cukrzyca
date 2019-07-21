// var path = require("path");
// var data = require("../helpers/data.json");
// const jsonfile = require("jsonfile");
// const file = "./helpers/data.json";
var express = require("express");
var router = express.Router();

var data = global.appData;

/* GET home page. */
router.get("/", function(req, res, next) {
   //  data.result.h21y1 = 134;
   //  console.log(data);

   //  jsonfile.writeFile(file, data, { spaces: 2 }, function(err) {
   //     if (err) console.error(err);

   //  });

   res.render("report", { title: "Raport", data });
});

module.exports = router;
