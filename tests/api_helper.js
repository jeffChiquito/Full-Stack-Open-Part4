const Blog = require('../models/blog')
const User = require('../models/users')


const initialBlog = [ 
    {
    title: "First test",
    author: "Jeffry Chiquito",
    url: "https://jeffchiquito.github.io/page/",
    likes: 5,
    id: "662ecba45c5183bb2ba3e9bb"
    },
    {
    title: "Second test",
    author: "Jose Chiquito",
    url: "https://jeffchiquito.github.io/page/",
    likes: 3,
    id: "662eda82d7233e2a753d5c90",
    user: "6653ca984c706329b2497de0"
        
    }
]

const initialUser = [
    {
        username: "jeffchiquitotest3",
        name: "Jeffry Chiquito3",
        passwordHash:"test",
        blogs: [
            "662ecba45c5183bb2ba3e9bb",
            "662eda82d7233e2a753d5c90"
        ]
    }
    ,{
        username: "jeffchiquitotest4",
        name: "Jeffry Chiquito4",
        passwordHash:"$2b$10$QeUIul1jCG5lvtW3Cgt6t.HPvvHcWV2fM3Mbm6rIReF9tGQX9zeNy",
        blogs:[]
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlog, blogsInDb,
    initialUser, usersInDb
}