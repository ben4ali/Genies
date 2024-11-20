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
const { default: helmet } = require('helmet');

//Database Connection

const app = express();
app.use(helmet());
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


//Security

app.use(cookieParser());

app.use(session({
    secret:"mercurochrome",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, //true in prod
        maxAge: 3600000, 
        sameSite: 'Strict'
    }
}));

app.use(
    helmet({
        frameguard: {
        action: 'sameorigin',
        },
    })
);

app.use(helmet.hidePoweredBy());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'", 
            "'unsafe-inline'", 
            "'unsafe-eval'", 
            "https://cdn.jsdelivr.net", 
            "https://cdnjs.cloudflare.com", 
            "https://api.openai.com", 
            "https://api.stability.ai",
            "https://api-free.deepl.com"
        ],
        styleSrc: [
            "'self'", 
            "'unsafe-inline'", 
            "https://cdn.jsdelivr.net"
        ],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
            "'self'", 
            "https://*.mongodb.net",
            "https://cloud.mongodb.com",
            "wss://*.mongodb.net",
            "https://api.openai.com",
            "https://api.stability.ai",
            "https://api-free.deepl.com"
        ],
        fontSrc: ["'self'", "https:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'", "blob:"],
        upgradeInsecureRequests: [],
        childSrc: ["'self'"],
        },
    })
);

app.use(helmet.xssFilter());

app.use((req, res, next) => {
    res.removeHeader('Date');
    next();
});

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