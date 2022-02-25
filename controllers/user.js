let express = require("express");
let db = require("../models");
let router = express.Router();

router.get("/new", (req, res) => {
    res.render("users/new");
});

router.post("/new", (req, res) => {
    db.user.findOrCreate({
        
    })
    res.redirect("/");
});

module.exports = router;