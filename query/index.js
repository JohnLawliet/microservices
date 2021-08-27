const express = require('express')
const cors = require("cors")
const axios = require("axios")

const app = express()
app.use(express.json())
app.use(cors())

const posts={}

const handleEvent = (type, data) => {
    if(type === "PostCreated"){
        const {id, title} = data
        posts[id] = {
            id, title, comments: []
        }
    }

    if(type==="CommentCreated"){
        const {id,content,postId, status} = data

        // adding post key to posts obj
        const post = posts[postId]

        // adding comment object to post key of particular postid
        post.comments.push({
            id, content, status
        })
        console.log("post",post)
    }

    if (type==="CommentUpdated"){
        const {id, content, postId, status} = data
        const post = posts[postId]
        const selectedComment = post.comments.find(comment => comment.id === id)
    
        // replace old comment with new comment with most likely changed attributesS
        selectedComment.status = status
        selectedComment.content = content
    }
}

app.get('/posts', (req,res) => {
    console.log("posts query get: ",posts)
    res.send(posts)
})

app.post('/events', (req,res) => {
    const {type, data} = req.body
    handleEvent(type, data)

    res.send({})
})

const PORT = 4200;
app.listen(PORT, async () => {
    console.log("QUERIES listening on ",PORT)
    try{
        const res = await axios.get('http://event-bus-int-serv:5000/events')
        for (let event of res.data){
            console.log("Processing event:",event.type)
            handleEvent(event.type, event.data)
        }
    }
    catch(err){
        console.log(err.message)
    }
})