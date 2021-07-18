<<<<<<< HEAD
const User = require('../models/users')

=======
>>>>>>> main
var _ = require('lodash');
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs)=>{
    return blogs.length === 0
        ? 0
        : blogs.reduce((acc, curVal)=>acc + curVal.likes, 0)
}

const favouriteBlog = (blogs)=>{
   let likeScore = 0
   if (blogs.length === 0){
    return []
   }
   let sortedBlogs = blogs.sort((a, b) => {
    if (a.likes < b.likes) {
      return -1
    } else if (a.likes > b.like) {
      return 1
    } else {
      return 0
    }
  })  
  return sortedBlogs[sortedBlogs.length-1]   
}

const mostBlogs = (blogs) =>{
    let authorsRanking = {}
    let res = _.groupBy(blogs, "author")

    let returnObj = {author: '', blogs: 0}
    for (const [key, value] of Object.entries(res)){
        if (res[key].length >= returnObj.blogs){
            returnObj.author = key
            returnObj.blogs = res[key].length
        }
    }
    return returnObj
}

const mostLikes = (blogs) => {
    let sortedByLikeBlogs = _.orderBy(blogs, 'likes', 'desc')

    keys = Object.keys(sortedByLikeBlogs)
    let returnObj = {author: sortedByLikeBlogs[keys[0]].author, likes:sortedByLikeBlogs[keys[0]].likes}
    return returnObj
}

<<<<<<< HEAD
const usersInDb = async()=>{
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

=======
>>>>>>> main
module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
<<<<<<< HEAD
    mostLikes,
    usersInDb
=======
    mostLikes
>>>>>>> main
}