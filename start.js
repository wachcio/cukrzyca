var createError = require("http-errors");
var cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const passport = require("passport");

// getting the local authentication type
const LocalStrategy = require("passport-local").Strategy;
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const mysql = require("mysql");

var logger = require("morgan");
var sassMiddleware = require("node-sass-middleware");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var userRouter = require("./routes/user");
var userAddRouter = require("./routes/userAdd");
var measurementAddRouter = require("./routes/measurementAdd");
var measurementsUserRouter = require("./routes/measurementsUser");
var measurementsAVGUserRouter = require("./routes/measurementsAVGUser");
var reportRouter = require("./routes/report");
var reportGeneratorRouter = require("./routes/reportGenerator");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var adminRouter = require("./routes/admin");
var userPanelRouter = require("./routes/userPanel");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
   cookieSession({
      name: "session",
      // keys: process.env.KEY_SESSION,
      keys: ["KluczykDoAplikacjiCukier"],
      maxAge: process.env.MAX_AGE_SESSION
   })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
   sassMiddleware({
      src: path.join(__dirname, "public"),
      dest: path.join(__dirname, "public"),
      indentedSyntax: false, // true = .sass and false = .scss
      sourceMap: false,
      outputStyle: "compressed"
   })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/user", userRouter);
app.use("/userAdd", userAddRouter);
app.use("/measurementAdd", measurementAddRouter);
app.use("/measurementsUser", measurementsUserRouter);
app.use("/measurementsAVGUser", measurementsAVGUserRouter);
app.use("/report", reportRouter);
app.use("/reportGenerator", reportGeneratorRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/admin", adminRouter);
app.use("/userPanel", userPanelRouter);

const getUsers = () => {
   var query = "SELECT * FROM `users`";
   // var query =
   //    "SELECT `ID`, `first_name`, `last_name`, `name`, `date_of_birth_child`, `date_added` FROM `users`";
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
      global.app.users = Array.from(rows);
      global.appUsers = Array.from(rows);

      // return rows;
   });
   connection.end();
};
getUsers();
// global.app.users = getUsers();
// console.log(global.app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render("error");
});

module.exports = app;
