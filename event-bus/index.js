const { default: axios } = require('axios')
const express = require('express')
// const { v4: uuid } = require('uuid')
// const cors = require("cors")

const app = express()
app.use(express.json())
// app.use(cors())

// to save events. For event bus, use kafka, rabbitmq or such tool for event bus and their db
const eventBusDb = []

// job is to get requests and broadcast so it should include type and data
app.post('/events', (req,res) => {
    const event = req.body
    eventBusDb.push(event)

    console.log("event : ",event)
    axios.post('http://posts-int-serv:4000/events', event).catch(err => console.log(err.message))
    axios.post('http://comments-int-serv:4100/events', event).catch(err => console.log(err.message))
    axios.post('http://query-int-serv:4200/events', event).catch(err => console.log(err.message))
    axios.post('http://moderation-int-serv:4300/events', event).catch(err => console.log(err.message))
    res.send({status: 'OK'})
})

app.get('/events', (req,res) => {
    res.send(eventBusDb)
})

const PORT = 5000;
app.listen(PORT, () => {
    console.log("event bus listening on ",PORT)
})