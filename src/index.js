const express = require('express')

require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: 'Welcom to Task App!' })
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})
