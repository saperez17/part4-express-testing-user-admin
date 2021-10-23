const jwt = require('jsonwebtoken') //check out express-jwt
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')

loginRouter.post('/', async(req, res)=>{
    console.log('req.ehaders: ', req.headers)
    const body = req.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)
    
    if(!(user && passwordCorrect)){
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    //token experies in 60*60 seconds, that is, in one hour
    const token = jwt.sign(userForToken, process.env.SECRET,
        { expiresIn: 60*60})

    //Another approach is to save info about each token to backend databse. Then, check
    //for each API request if the access right corresponding to the token is still valid.
    //This solution is often called a server side session.

    //Main drawback of server side session is performance. Database access is slower compared
    //to checking the validity from the token itself. To overcome this issue it is quite common
    //to use a key-value-database such as Redis, a db solution limited in funcionality, but useful
    //in some usage scenarios. For each API request the server fetches user info from the db(not from the token).
    //the token is usually just a random string. Instead of using the Authorization-header, cookies
    //are used as the mechanism for transferring the token between the client and the server.
    res
        .status(200)
        .send({ token, username:user.username, userId:user._id })
})

module.exports = loginRouter