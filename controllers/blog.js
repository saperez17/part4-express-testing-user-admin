const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
blogRouter.post('/', (request, response, next) => {
  const body = request.body

  if (typeof(body.title)==='undefined' || typeof(body.url)==='undefined'){
    return response.status(400).end()
  }

  const blogPost = new Blog({
    title: body.title,
    author: body.author,
    url: body.author,
    likes: body.likes || 0
  })
  try{
    blogPost
    .save()
    .then(result => {
      response.status(201).json(result)
    })
  }catch(exception){
    next(exception)
  }
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