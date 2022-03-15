const request = require('supertest')

const app = require('../src/app')
const Task = require('../src/models/task')
const { userId, sampleUser, userTwoId, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${sampleUser.tokens[0].token}`)
        .send({
            description: 'test task'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should return tasks created by the user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${sampleUser.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Should fail to delete other users task', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo._id}`)
        .send()
        .expect(401)
    
    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
