const TaskRepository = require('./task-repository')
const TaskEntity = require('../../domain/entities/task-entity')
const MongoDB = require('../helpers/mongo-db')
const InvalidParamError = require('../../utils/errors/invalid-param-error')

const makeSut = () => {
  return {
    sut: new TaskRepository()
  }
}

describe('Task Respository', () => {
  let db
  beforeAll(async () => {
    await MongoDB.connect()
    db = await MongoDB.client.db()
  })
  afterAll(async () => {
    await db.collection('tasks').deleteMany()
    await MongoDB.disconnect()
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
