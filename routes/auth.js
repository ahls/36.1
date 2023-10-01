const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const user = require("../models/user")
const expressError = require("../expressError");
const {SECRET_KEY} = require("../config")
/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function(req,res,next){
    try
    {
        const username = req.body.username;
        const result = await user.authenticate(username, req.body.password);
        if(result)
        {
            const token = jwt.sign({username},SECRET_KEY);
            user.updateLoginTimestamp(username)
            return res.json({token});
        }
        else
        {
            throw new ExpressError("incorrect login information!",400)
        }
    }
    catch(e)
    {
        next(e);
    }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register',async function(req,res,next){
    try
    {
        const {username,password,first_name,last_name,phone} = req.body;
        const res = user.register(username,password,first_name,last_name,phone);
        const token = jwt.sign({username},SECRET_KEY);
        user.updateLoginTimestamp(username)
        return res.json({token});
    }
    catch(e)
    {
        next(e);
    }
})

module.exports = router;