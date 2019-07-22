var express = require("express");
var router = express.Router();

router.all("*", (req, res, next) => {
   if (!req.session.user) {
      res.redirect("login");
      return;
   }
   next();
});

/* GET home page. */
router.get("/", function(req, res, next) {
   // console.log(req.session.admin);
   let appData = req.session;
   res.render("userPanel", { title: "Panel użytkownika", appData });
});

module.exports = router;
