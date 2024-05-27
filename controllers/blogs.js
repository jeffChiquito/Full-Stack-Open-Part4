const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find ({}).populate('user', {username: 1, name: 1})
    response.json(blogs)    
})

blogsRouter.get('/:id', (request, response) => {
    Blog.findById(request.params.id)
    .then(blog => {
        if(blog){
            response.json(blog)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body 
    const userSession = request.user
    if (!userSession.id){
        return response.status(401).json({error: 'token in valid'})
    }
    const user = await User.findById (userSession.id)
    
    const blog = new Blog({
       title: body.title,
       author: body.author,
       url: body.url,
       likes: body.likes || 0,
       user: user._id
    })
    
    const blogSaved = await blog.save()
    user.blogs = user.blogs.concat(blogSaved._id)
    await user.save()
    response.status(201).json(blogSaved)
})

blogsRouter.delete('/:id', async (request, response) => {    
    const userSession = request.user
    
    const blogWithUserName = await Blog.findById (request.params.id)    
 
        if(blogWithUserName.user.toString() === userSession.id.toString())
        {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
        }
        else{
        return response.status(401).json({error: 'invalid token'})
        }
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    .then(updatedBlog => {
        response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter