const { MongoClient } = require('mongodb')
const { mongoUrl } = require('../config/database')
const InvalidParamError = require('../../utils/errors/invalid-param-error')

let connection
let db

class TaskRepository {
  async create ({ description, is_checked = false }) {
    if (!description) throw new InvalidParamError('description')
    const document = { description, is_checked }
    await db.collection('tasks').insertOne(document)
  }
}

describe('Task Respository', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await connection.db()
  })
  afterAll(async () => {
    await connection.close()
  })
  test('should throw error if a description is invalid or no provided in method create', () => {
    const sut = new TaskRepository()
    const suts = [sut.create({}), sut.create({ description: '' })]
    for (const promise of suts) {
      expect(promise).rejects.toThrow(new InvalidParamError('description'))
    }
  })
  test('should insert a task in database by create method', async () => {
    const sut = new TaskRepository()
    await sut.create({ description: 'any description' })
    const countTasks = await db.collection('tasks').countDocuments()
    expect(countTasks).toBe(1)
  })
})
