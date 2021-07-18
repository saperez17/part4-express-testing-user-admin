const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/users')

blogRouter.get('/', async (request, response) => {
  const blogsFound = await Blog.find({}).populate('user', {username:1, name:1})
  response.json(blogsFound)    
})
  
blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  if (typeof(body.title)==='undefined' || typeof(body.url)==='undefined'){
    return response.status(400).end()
  }

  const blogPost = new Blog({
    title: body.title,
    author: body.author,
    url: body.author,
    likes: body.likes || 0,
    user: user._id
  })
 
  const savedBlog = await blogPost.save()
  console.log('savedBlog', savedBlog)
  user.notes = user.notes.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
  
    //next(exception)
  
})

blogRouter.delete('/:id', async(request,response,next)=>{
  try{
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }catch(exception){
    next(exception)
  }
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