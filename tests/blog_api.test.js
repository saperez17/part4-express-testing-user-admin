const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogPosts = [
  {
    title: 'Express backend server testing',
    author: 'Helsinki UniversityI',
    url: 'https://fullstackopen.com/en/part4/testing_the_backend',
    likes: 100
  },
  {
    title: 'Modern React Development',
    author: 'Helsinki University',
    url: 'https://fullstackopen.com/en/part4/testing_the_backend',
    likes: 1150
  },

 ]
beforeEach(async()=>{
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogPosts[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogPosts[1])
  await blogObject.save()
})

test('All blog posts are retrieved as json', async()=>{
  const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)  

  expect(response.body).toHaveLength(initialBlogPosts.length)
})

test('All blogs have a unique identifier id', async()=>{
  const response = await api.get('/api/blogs')
//   const blogToCheck = response.body[0]
  for(let noteToTest of response.body){
      expect(noteToTest.id).toBeDefined()
  }
})

test('a valid blog post can be saved', async()=>{
  const newBlogPost = {
    title: 'Helper module in express backend testing',
    author: 'Helsinki UniversityII',
    url: 'https://fullstackopen.com/en/part4/testing_the_backend',
    likes: 56
  }

  await api
    .post('/api/blogs')
    .send(newBlogPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesInDb = await Blog.find({})
  expect(notesInDb.map(note=>note.toJSON())).toHaveLength(initialBlogPosts.length + 1)

  const contents = notesInDb.map(blogPost => blogPost.title)
  expect(contents).toContain(
      'Helper module in express backend testing'
  )
})

test('if likes property is missing it defaults to 0', async()=>{
    const newBlogPost = {
        title: 'Helper module in express backend testing',
        author: 'Helsinki UniversityII',
        url: 'https://fullstackopen.com/en/part4/testing_the_backend',
    }
    
    const result = await api
      .post('/api/blogs')
      .send(newBlogPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    expect(result.body.likes).toBeDefined()
})

test('A blog post without title or url cannot be saved', async()=>{
    const newBlogPost = {
      author: 'Helsinki UniversityII',
      likes: 56
    }

    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .expect(400)
})

test('An existing blog post can be deleted', async()=>{
  const blogsAtStart = await Blog.find({})
  const blogToRemove = blogsAtStart.map(blog => blog.toJSON())[0]

  await api
    .delete(`/api/blogs/${blogToRemove.id}`)
    .expect(204)
  
  const blogsAtEnd =  await Blog.find({})
  const blogAtEndResult = blogsAtEnd.map(blog => blog.toJSON())

  expect(blogAtEndResult).toHaveLength(blogsAtStart.length-1)

  const contents = blogAtEndResult.map(blog => blog.title)
  expect(contents).not.toContain(blogToRemove.title)
})

test('An existing blog post can be updated', async()=>{
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart.map(blog => blog.toJSON())[0]
  blogToUpdate.title = 'This is the new title'

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)

  const blogsAtEnd = await Blog.find({})
  const blogsJson = blogsAtEnd.map(blog =>blog.toJSON())
  expect(blogsJson).toContainEqual(
    blogToUpdate
  )
  
})

afterAll(()=>{
    mongoose.connection.close()
  })

 