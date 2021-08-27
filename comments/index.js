const express = require('express')
const { v4: uuid } = require('uuid')
const cors = require("cors")
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(cors())

const commentsByPost = {}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPost[req.params.id] || [])
})

app.post('/posts/:id/comments/create', async (req, res) => {
    const commentId = uuid()
    const {content} = req.body

    const comments = commentsByPost[req.params.id] || []
    comments.push({
        id: commentId,
        content,
        status: 'pending'
    })
    commentsByPost[req.params.id] = comments

    await axios.post('http://event-bus-int-serv:5000/events',{
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    })

    console.log("comments : ",comments)
    res.status(201).json(comments)
})

app.post('/events', async (req,res) => {
    const {type, data} = req.body
    console.log("Event received : ",type)
    if (type==="CommentModerated"){ 
        const {postId, id, status, content} = data
        
        // select all comments of a particular post
        const comments = commentsByPost[postId]

        // find the required comment by commentId
        const selectedComment = comments.find(comment => comment.id === id)
        
        // change status of the selected comment
        selectedComment.status = status

        await axios.post('http://event-bus-int-serv:5000/events', {
            type: 'CommentUpdated',
            data: {
                status, id, postId, content
            }
        })
    }

    res.send({status: 'OK'})
})

const PORT = 4100;
app.listen(PORT, () => {
    console.log("comments listening on ",PORT)
})