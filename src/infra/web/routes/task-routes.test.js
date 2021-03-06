const request = require('supertest')
const MongoDB = require('../../helpers/mongo-db')
const app = require('../app')

describe('Task Routes', () => {
  let db
  beforeAll(async () => {
    await MongoDB.connect()
    db = await MongoDB.client.db()
  })
  beforeEach(async () => {
    await db.collection('tasks').deleteMany()
  })
  afterAll(async () => {
    await MongoDB.disconnect()
  })
  test('should return 201 after create task - [Http verb: Post]', async () => {
    await request(app)
      .post('/api/tasks')
      .send({
        description: 'any description'
      })
      .expect(201)
  })
  test('should return 200 and a task list - [Http verb: Get]', async () => {
    await db.collection('tasks').insertMany([
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false }
    ])
    const response = await request(app).get('/api/tasks')
    expect(response.body).toHaveLength(3)
    await request(app)
      .get('/api/tasks')
      .expect(200)
  })
  test('should return 404 if task is not found - [Http verb: Delete]', async () => {
    await request(app)
      .delete('/api/tasks/any_identity')
      .expect(404)
  })
  test('should return 404 if task is not found - [Http verb: Patch]', async () => {
    await request(app)
      .patch('/api/tasks/any_identity')
      .expect(404)
  })
  test('should return 204 if task deleted - [Http verb: Delete]', async () => {
    const id = MongoDB.objectId('any_identity')
    await db
      .collection('tasks')
      .insertOne({ _id: id, description: 'any description' })

    await request(app)
      .delete(`/api/tasks/${id}`)
      .expect(204)
  })
  test('should return 200 if task is checked - [Http verb: Patch]', async () => {
    const id = MongoDB.objectId('any_identity')
    await db
      .collection('tasks')
      .insertOne({ _id: id, description: 'any description', is_checked: false })

    const response = await request(app)
      .patch(`/api/tasks/${id}`)
      .expect(200)

    expect(response.body.task.isChecked).toBeTruthy()
  })
  test('should return 200 if task is unchecked - [Http verb: Patch]', async () => {
    const id = MongoDB.objectId('any_identity')
    await db
      .collection('tasks')
      .insertOne({ _id: id, description: 'any description', is_checked: true })

    const response = await request(app)
      .patch(`/api/tasks/${id}`)
      .expect(200)

    expect(response.body.task.isChecked).toBeFalsy()
  })
})
