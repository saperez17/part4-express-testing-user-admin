const bcrypt = require('bcrypt') //use bcryptjs if having problems in windows
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.get('/', async(request, response, next)=>{  
    const usersFound = await User.find({}).populate('notes', {title:1, author:1, likes:1, url:1})
    response.json(usersFound)
   
})
usersRouter.post('/', async(request, response, next)=>{
    const body = request.body

    //Check for 1) both username and password are given; 2) Both username and pass are 3 characters long
    // 3) Username must be unique

    if (!(body.password && body.username)){
        return response.status(400).json({
            error: "missing username or password"
        })
    }
    if (!(body.password.length >=3 && body.username.length>=3)){
        return response.status(400).json({
            error: "username and password must be at least 3 characters long"
        })
    }
    
    const uniqueUsername = User.findOne({ username:body.username })
    if (uniqueUsername === null){
        return response.status(400).json({
            error: "username already exists"
        }) 
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await newUser.save()
    response.json(savedUser)
})

usersRouter.get('/:id', async(request, response, next)=>{
})

usersRouter.delete('/:id', async(request, response, next)=>{
})

usersRouter.put('/:id', async(request, response, next)=>{
})

module.exports = usersRouter