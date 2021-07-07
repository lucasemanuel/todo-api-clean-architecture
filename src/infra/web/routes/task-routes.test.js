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
  test('should method post return 201 when is provided correct params', async () => {
    await request(app)
      .post('/api/tasks')
      .send({
        description: 'any description'
      })
      .expect(201)
  })
  test('should method get return 200', async () => {
    await request(app)
      .get('/api/tasks')
      .expect(200)
  })
  test('should method get return in response body a task list', async () => {
    await db.collection('tasks').insertMany([
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false }
    ])
    const response = await request(app).get('/api/tasks')
    expect(response.body).toHaveLength(3)
  })
  test('should return 404 if task is not found - /api/tasks/:id [Delete]', async () => {
    await request(app)
      .delete('/api/tasks/any_id')
      .expect(404)
  })
})
