const express = require('express')
const { v4: uuid } = require('uuid')
const cors = require("cors")
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(cors())

const posts = {}

// app.get('/posts', (req, res) => {
//     res.send(posts)
// })

app.post('/posts/create', async (req, res) => {
    const id = uuid()
    const {title} = req.body
    posts[id] = {
        title, id
    }

    // sending the post creation request to event bus so as to broadcast event to all services
    // posts (event)-> event-bus -> posts && comments
    await axios.post('http://event-bus-int-serv:5000/events', {
        type:'PostCreated',
        data: {
            id, title
        }
    })

    res.status(201).json(posts[id])
})

app.post('/events', (req,res) => {
    console.log("Event received : ",req.body.type)
    res.send({status: 'OK'})
})

const PORT = 4000;
app.listen(PORT, () => {
    console.log("posts listening on ",PORT)
})