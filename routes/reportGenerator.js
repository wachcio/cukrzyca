var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var _ = require("lodash");

const moment = require("moment");

const badParameters = err => {
   return {
      error: err
   };
};

router.get("/:userId/:dateFrom", function(req, res, next) {
   // console.log("userId", req.params.userId);

   let userId = req.params.userId;
   let dateFrom = req.params.dateFrom;

   if (!_.isNumber(Number(userId)))
      res.json(badParameters("user ID is not correct"));

   res.redirect(`/measurementsAVGUser/${userId}/report/${dateFrom}`);
});

module.exports = router;
