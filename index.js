const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const cryptoJS = require("crypto-js");
const db = require("./models");

const app = express();
const port = process.env.PORT || 4000;

//Middleware
app.set("view engine", "ejs");
app.use(cookieParser()); // gives access to req.cookies
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

// Custom Middleware
app.use(async (req, res, next) => {
    if (req.cookies.userId) {
        const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET);
        const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8);
        const user = await db.user.findByPk(decryptedIdString)
        res.locals.user = user;
    } else res.locals.user = null;
    next();
});

app.use("/users", require("./controllers/users"));

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(port, () => {
    console.log("Server running on PORT:", port);
});
