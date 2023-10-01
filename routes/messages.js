const express = require("express");
const router = new express.Router();
const message = require("../models/message")
const {ensureLoggedIn,ensureCorrectUser} = require("../middleware/auth");
/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureLoggedIn,ensureCorrectUser, async function(req,res,next){
    try
    {
        const res = await message.get(req.params.id);
        return res;
    }
    catch(e)
    {
        next(e);
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn,ensureCorrectUser, async function(req,res,next)
{
    try{
        const fromUser = req.user.username;
        const res = await message.create(fromUser,req.body.to_username,req.body.body);
        return res;
    }
    catch(e)
    {
        next(e);
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read',,async function(req,res,next){
    try{
        const res = await message.markRead(req.params.id);
        return res;
    }
    catch(e)
    {
        next(e)
    }
})

module.exports = router;