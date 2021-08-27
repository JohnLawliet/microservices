const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json())

app.post('/events',async (req,res) => {
    const {type, data} = req.body

    if (type==="CommentCreated"){
        const status = data.content.includes('sex')? 'rejected' : 'Approved'
    
        await axios.post('http://event-bus-int-serv:5000/events',{
            type:'CommentModerated',
            data: {
                status,
                id: data.id,
                content: data.content,
                postId: data.postId
            }
        })
    }

    res.send({status: 'OK'})
})

const PORT = 4300
app.listen(PORT, () => {
    console.log("MODERATION listening on port ",PORT)
})