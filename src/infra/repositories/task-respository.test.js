const { MongoClient } = require('mongodb')
const { mongoUrl } = require('../config/database')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const TaskEntity = require('../../domain/entities/task-entity')
const TaskAdapter = require('../../adapters/task-adapter')

let connection
let db

class TaskRepository {
  async create ({ description, is_checked = false }) {
    if (!description) throw new InvalidParamError('description')
    const taskDocument = (
      await db.collection('tasks').insertOne({ description, is_checked })
    ).ops[0]
    return TaskAdapter.adapt({
      id: taskDocument._id,
      description: taskDocument.description,
      isChecked: taskDocument.is_checked
    })
  }
}

const makeSut = () => {
  return {
    sut: new TaskRepository()
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
    const { sut } = makeSut()
    const suts = [sut.create({}), sut.create({ description: '' })]
    for (const promise of suts) {
      expect(promise).rejects.toThrow(new InvalidParamError('description'))
    }
  })
  test('should insert a task in database by create method', async () => {
    const { sut } = makeSut()
    await sut.create({ description: 'any description' })
    const countTasks = await db.collection('tasks').countDocuments()
    expect(countTasks).toBe(1)
  })
  test('should return the TaskEntity after save task in database by create method', async () => {
    const { sut } = makeSut()
    const task = await sut.create({ description: 'any description' })
    expect(task).toEqual(
      new TaskEntity({ description: 'any description', id: task.id })
    )
  })
})
