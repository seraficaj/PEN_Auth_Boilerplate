const express = require("express");
const ejsLayouts = require("express-ejs-layouts");

const app = express();
const port = process.env.PORT || 4000;

const db = require("./models");

//Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.use('/users', require('./controllers/user'));

app.listen(port, () => {
    console.log("Server running on PORT:", port);
});
