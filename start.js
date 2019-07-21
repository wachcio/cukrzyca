var createError = require("http-errors");
var cookieSession = require("cookie-session");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

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
var adminRouter = require("./routes/admin");

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
app.use("/admin", adminRouter);

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
