const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
      },
    author: {
        type: String,
        required: true,
        minlength: 5
      },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    url: String, 
    likes: Number,
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()        
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)