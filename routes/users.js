const express = require("express");
const router = new express.Router();
const User = require("../models/users")
const {ensureLoggedIn,ensureCorrectUser} = require("../middleware/auth");
/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", async function(req,res,next){
    try
    {
        const res = await User.all();
        return res;
    }
    catch(e)
    {
        next(e);
    }
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username",ensureCorrectUser,async function(req,res,next){
    try{
        const res = await User.get(req.params.username);
        return {'user':res.rows[0]}
    }
    catch(e)
    {
        return next(e);
    }
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to",ensureCorrectUser,async function(req,res,next){
    try{
        const res = await User.messagesTo(req.params.username);
        return {'user':res.rows[0]}
    }
    catch(e)
    {
        return next(e);
    }
})
/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from",ensureCorrectUser,async function(req,res,next){
    try{
        const res = await User.messagesFrom(req.params.username);
        return {'user':res.rows[0]}
    }
    catch(e)
    {
        return next(e);
    }
})

module.exports = router;