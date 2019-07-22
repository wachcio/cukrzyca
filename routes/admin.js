var express = require("express");
var router = express.Router();

router.all("*", (req, res, next) => {
   if (!req.session.admin) {
      res.redirect("login");
      return;
   }
   next();
});

/* GET home page. */
router.get("/", function(req, res, next) {
   console.log(req.session.admin);
   let appData = global.app;
   res.render("admin", { title: "Logowanie", appData });
});

module.exports = router;
