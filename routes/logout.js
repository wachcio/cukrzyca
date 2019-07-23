var express = require("express");
var router = express.Router();
var sha256 = require("sha256");
var mysql = require("mysql");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");

// getting the local authentication type
const LocalStrategy = require("passport-local").Strategy;
router.get("/", function(req, res) {
   console.log("logged out");
   req.logout();

   return res.send();
});

module.exports = router;
