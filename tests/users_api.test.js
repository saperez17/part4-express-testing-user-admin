const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/users')
const listHelper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)

describe('When there is initially one user in db', ()=>{
    beforeEach(async ()=>{
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username:'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async()=>{
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'event',
            name: 'event horizon',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username is already taken', async()=>{
        const usersAtStart = await listHelper.usersInDb()

        const newUser = {
            username: 'root',
            name:'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails if username or password are not 3 characters long at least', async()=>{
        const usersAtStart = await listHelper.usersInDb()
        
        const newUser = {
            username: "sa",
            name: "santiago",
            password: "0000",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username and password must be at least 3 characters long')

        const usersAtEnd = await listHelper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    afterAll(()=>{
        mongoose.connection.close()
    })
})
