const express = require('express')

require('./db/mongoose')

const { authRouter, userRouter, taskRouter } = require('./routes/v1/index')

const app = express()

app.use(express.json())

app.use('/uploads', express.static('uploads'))

app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: 'Welcom to Task App!' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter)

module.exports = app
