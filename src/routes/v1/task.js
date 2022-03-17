const express = require('express')

const auth = require('../../middleware/auth')
const { getTasks, getTask, postTask, updateTask, deleteTask } = require('../../controllers/task')

const router = express.Router()

router.get('/', auth, getTasks)

router.get('/:id', auth, getTask)

router.post('/', auth, postTask)

router.patch('/:id', auth, updateTask)

router.delete('/:id', auth, deleteTask)

module.exports = router
