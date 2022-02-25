const express = require("express");
const db = require("../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const cryptoJS = require("crypto-js");
require('dotenv').config()

router.get("/new", (req, res) => {
    res.render("users/new");
});

router.post("/new", async (req, res) => {
    const [newUser, created] = await db.user.findOrCreate({
        where: { email: req.body.email },
    });
    if (!created) {
        console.log("User already exists");
        // render login page
    } else {
        const hashedPassword = bcrypt.hashSync(req.body.password, 7);
        newUser.password = hashedPassword;
        await newUser.save();

        // encrypt user id via AES
        const encryptedUserId = cryptoJS.AES.encrypt(newUser.id.toString(), process.env.SECRET);
        const encryptedUserIdString = encryptedUserId.toString();
        // store encrypted id in cookie of res obj
        res.cookie({ "userId": encryptedUserIdString });
        res.redirect("/");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", async (req, res) => {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    if (!user) {
        console.log("user not found!");
        res.render("users/login.ejs", { error: "Invalid email/password" });
    } else if (!bcrypt.compareSync(req.body.password, user.password)) {
        console.log("incorrect password!");
        res.render("users/login.ejs", { error: "Invalid email/password" });
    } else {
        console.log("logging in the user!");
        // encrypt user id via AES
        const encryptedUserId = cryptoJS.AES.encrypt(user.id.toString(), process.env.SECRET);
        const encryptedUserIdString = encryptedUserId.toString();
        // store encrypted id in cookie of res obj
        res.cookie({ "userId": encryptedUserIdString });
        res.redirect("/");
    }
});

router.get('/logout', (req,res) => {
    console.log('logging out');
    res.clearCookie('userId');
    res.redirect('/');
})

module.exports = router;
