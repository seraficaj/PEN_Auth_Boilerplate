let express = require("express");
let db = require("../models");
let router = express.Router();

router.get("/new", (req, res) => {
    res.render("users/new");
});

router.post("/new", (req, res) => {
    res.json(req.body);
});

module.exports = router;