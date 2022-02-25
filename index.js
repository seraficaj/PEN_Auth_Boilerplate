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
app.use(async (req, res, next)=>{
    if(req.cookies.userId){
        // decrypting the incoming user id from the cookie
        const decryptedId = cryptoJS.AES.decrypt(req.cookies.userId, process.env.SECRET)
        // converting the decrypted id into a readable string
        const decryptedIdString = decryptedId.toString(cryptoJS.enc.Utf8)
        // querying the db for the user with that id
        const user = await db.user.findByPk(decryptedIdString)
        // assigning the found user to res.locals.user in the routes, and user in the ejs
        res.locals.user = user
    } else res.locals.user = null
    next() // move on to next middleware
})

app.use("/users", require("./controllers/users"));

// Routes
app.get("/", (req, res) => {
    res.render("index");
    console.log("cookies",req.cookies);
    console.log("locals",req.locals);
});

app.listen(port, () => {
    console.log("Server running on PORT:", port);
});
