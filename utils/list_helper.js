const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0 
    : blogs.reduce((total, current) => {
        return total + current.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const maxLikesObject = blogs.reduce((maxObject, currentObject) => {
        if (currentObject.likes > maxObject.likes) {
            return currentObject; // Si encontramos un objeto con más likes, lo devolvemos
        } else if (currentObject.likes === maxObject.likes && currentObject.id < maxObject.id) {
            return currentObject; // Si tienen el mismo número de likes pero un id menor, lo devolvemos
        }
        return maxObject; // En cualquier otro caso, devolvemos el objeto actual
    }, blogs[0]);

    return maxLikesObject
    
}

const mostBlogs = (blogs) => {

    const groupByAuthor = lodash.countBy(blogs, 'author')

    const authorMoreBlog = lodash.maxBy(lodash.keys(groupByAuthor), author => groupByAuthor[author])

    const authorQuantity = groupByAuthor[authorMoreBlog]

    return {author: authorMoreBlog,
            blogs: authorQuantity}
}

const mostLikes = (blogs) => {
    const groupByAuthor = lodash.groupBy(blogs, 'author')

    const authorMoreLikes = lodash.maxBy(lodash.keys(groupByAuthor), author => lodash.sumBy(groupByAuthor[author], 'likes'))

    const authorQuantity = lodash.sumBy(groupByAuthor[authorMoreLikes], 'likes')

    return {author: authorMoreLikes,
            likes: authorQuantity}
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}