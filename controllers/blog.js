const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

const User = require('../models/users')
const { findById } = require('../models/users')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

blogRouter.get('/', async (request, response) => {
  const blogsFound = await Blog.find({}).populate('user', {username:1, name:1})
  response.json(blogsFound)    
})
  
blogRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (typeof(body.title)==='undefined' || typeof(body.url)==='undefined'){
    return response.status(400).end()
  }

  if (!request.user){
    return response.status(401).json({ error:'token missing or invalid' })
  }

  const user = await User.findById(request.user.id)

  const blogPost = new Blog({
    title: body.title,
    author: body.author,
    url: body.author,
    likes: body.likes || 0,
    user: request.user.id
  })
 
  const savedBlog = await blogPost.save()
  user.notes = user.notes.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
    //next(exception)
})

blogRouter.delete('/:id', async(request,response,next)=>{
  //check the user trying to delete the blog is its creator
  const blog = await Blog.findById(request.params.id).populate('user',{_id:1})
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if (blog === null){
    return response.status(404).json({ error:'blog not found' })
  }
  if (!request.token || !decodedToken.id){
    return response.status(401).json({ error:'invalid token' })
  }
  if ( blog.user.id.toString() != decodedToken.id.toString() ){
    return response.status(401).json({ error:'you have no delete rights over this blog' })
  }
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async(request, response)=>{
  const blogInDb = await Blog.findById(request.params.id)
  const body = request.body

  const blog = {
    title: body.title || blogInDb.title,
    author: body.author || blogInDb.author,
    url: body.url || blogInDb.url,
    likes: body.likes || blogInDb.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new:true })
  response.status(200).json(updatedBlog)
})

module.exports = blogRouter