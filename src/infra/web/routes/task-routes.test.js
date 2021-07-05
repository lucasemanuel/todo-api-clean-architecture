const request = require('supertest')
const MongoDB = require('../../helpers/mongo-db')
const app = require('../app')

describe('Task Routes', () => {
  beforeAll(async () => {
    await MongoDB.connect()
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
})
