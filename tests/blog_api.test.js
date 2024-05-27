const {test, after, beforeEach} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/users')

const helper = require('./api_helper')



const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlog)    
})

test('there are two notes', async () => {
    const blogsAtStart = await helper.initialBlog
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, blogsAtStart.length)
})
  
test('the first blog is about HTTP methods', async () => {
const response = await api.get('/api/blogs')

const authors = response.body.map(e => e.author)
  assert(authors.includes('Jeffry Chiquito'))
})

test('_id value check', async () => {
  const response = await api.get('/api/blogs')

  const id = response.body.map(e => e._id)
  id.forEach(element => assert(element !== undefined))
})

test('post call with no token is invalid', async () => {
  const newBlog = {
    title: 'API test',
    author: 'Leonel Ardon',
    url: 'https://jeffchiquito.github.io/page/',
    likes: 29,
    user:"665377bcdb74bf7bb2742746"
  }

  await api
    .post('/api/blogs')    
    .send(newBlog)
    .expect(500)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'API test',
    author: 'Leonel Ardon',
    url: 'https://jeffchiquito.github.io/page/',
    likes: 29,
    user:"6653ca984c706329b2497de0"
  }

  const tokenResponse = await api
        .post('/api/login')
        .send({ username: 'jeffchiquitotest4', password: 'jeffchiquito1' })
        .expect(200)

  const token = tokenResponse.body.token;

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)    
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialBlog.length + 1)

  assert(contents.includes('API test'))
})

test('if likes is missing automatic 0 set', async () => {
  const newBlog = {
    title: 'zero likes',
    author: 'zero likes',
    url: 'https://jeffchiquito.github.io/page/',
  }

  const tokenResponse = await api
  .post('/api/login')
  .send({ username: 'jeffchiquitotest4', password: 'jeffchiquito1' }) // Ajusta con las credenciales correctas
  .expect(200)

  const token = tokenResponse.body.token;

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) 
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const likes = response.body.map(r => r.likes)

  assert.strictEqual(likes[likes.length-1],0)
})

test('if no title error', async () => {
  const newBlog = {
    author: 'no title',
    url: 'https://jeffchiquito.github.io/page/',
  }

  const tokenResponse = await api
  .post('/api/login')
  .send({ username: 'jeffchiquitotest4', password: 'jeffchiquito1' }) // Ajusta con las credenciales correctas
  .expect(200)

  const token = tokenResponse.body.token;

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('if no author error', async () => {
  const newBlog = {
    title: 'hello there',
    url: 'https://jeffchiquito.github.io/page/',
  }

  const tokenResponse = await api
  .post('/api/login')
  .send({ username: 'jeffchiquitotest4', password: 'jeffchiquito1' }) // Ajusta con las credenciales correctas
  .expect(200)

  const token = tokenResponse.body.token;

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('deletion of a blog not valid because of userID changing', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[1]

  const tokenResponse = await api
  .post('/api/login')
  .send({ username: 'jeffchiquitotest4', password: 'jeffchiquito1' }) // Ajusta con las credenciales correctas
  .expect(200)

  const token = tokenResponse.body.token;

  await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(401)

})

test('update of a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]
  const likesUpdate = Math.floor((Math.random()) * (94)) + 5
  const blogUpdated = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: likesUpdate,
    user: blogToUpdate.user
  }

  await api
  .put(`/api/blogs/${blogToUpdate.id}`)
  .send(blogUpdated)
  .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  assert.notStrictEqual(blogsAtEnd[0].likes, blogsAtStart[0].likes)
})

after(async () => {
    await mongoose.connection.close()
})