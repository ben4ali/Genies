//Modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');


//Custom Modules
const params = require('./config/params.js');
const setUpPassport = require('./setuppassport.js');

//Database Connection
const app = express();
mongoose.connect(params.DATABASE_CONNECTION);
setUpPassport();

//server setup
app.set("port",process.env.PORT || 3000);

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret:"mercurochrome",
    resave: false,
    saveUninitialized: false
}));

app.use("/uploads", express.static(path.resolve(__dirname, "./public/media/profilPictures")));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routing
app.use("/", require("./routes/web/index.js"));
app.use("/api", require("./routes/api/index.js"));

app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
});