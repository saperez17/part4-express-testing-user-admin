const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/users')

usersRouter.get('/', async(request, response, next)=>{  
    const usersFound = await User.find({}).populate('notes', {title:1, author:1, likes:1, url:1})
    response.json(usersFound)
   
})
usersRouter.post('/', async(request, response, next)=>{
    const body = request.body

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