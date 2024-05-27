const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/users')

const helper = require('./api_helper')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUser)
})

test('getting users', async () => {
    const usersAtStart = await helper.initialUser
    const response = await api.get('/api/users')
  
    assert.strictEqual(response.body.length, usersAtStart.length)
})

test('adding same user error', async () => {
    const sameUser = 
    {
    username: "jeffchiquitotest4",
    name: "Jeffry Chiquito4",
    password:"jeffchiquito1",
    }
    
    await api
    .post('/api/users')    
    .send(sameUser)
    .expect(400)
})

test('login works', async () => {
    const tokenResponse = await api
    .post('/api/login')
    .send({ username: 'jeffchiquitotest4', password: 'jeffchiquito1' })
    .expect(200)

})

after(async () => {
    await mongoose.connection.close()
})