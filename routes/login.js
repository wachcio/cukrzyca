var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
   res.render("login", { title: "Logowanie" });
});
router.post("/", function(req, res, next) {
   const body = req.body;

   if (
      body.login == process.env.LOGIN_SESSION &&
      body.password == process.env.PASSWORD_SESSION
   ) {
      req.session.admin = 1;

      res.redirect("/admin");
   } else {
      res.redirect("/login");
   }
});

module.exports = router;
