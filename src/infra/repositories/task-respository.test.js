const TaskRepository = require('./task-repository')
const TaskEntity = require('../../domain/entities/task-entity')
const MongoDB = require('../helpers/mongo-db')
const { InvalidParamError, MissingParamError } = require('../../utils/errors')

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
  beforeEach(async () => {
    await db.collection('tasks').deleteMany()
  })
  afterAll(async () => {
    await MongoDB.disconnect()
    await db.collection('tasks').deleteMany()
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
  test('should return task list by findAll method', async () => {
    const { sut } = makeSut()
    await db.collection('tasks').insertMany([
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false }
    ])
    const tasklist = await sut.findAll()
    expect(tasklist.length).toBe(5)
  })
  test('should return list with TaskEntities', async () => {
    const { sut } = makeSut()
    await db.collection('tasks').insertMany([
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false },
      { description: 'any description', is_checked: false }
    ])
    const taskList = await sut.findAll()
    for (const task of taskList) {
      expect(task).toBeInstanceOf(TaskEntity)
    }
  })
  test('should throw error if id is no provided in findById', () => {
    const { sut } = makeSut()
    const promise = sut.findById()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
  test('should return task by id', async () => {
    const { sut } = makeSut()
    const id = MongoDB.objectId('any_identity')
    await db.collection('tasks').insertOne({
      _id: id,
      description: 'any description',
      is_checked: true
    })
    const task = await sut.findById(id)
    expect(task).toBeInstanceOf(TaskEntity)
  })
  test('should return null if task not found in findById', async () => {
    const { sut } = makeSut()
    const task = await sut.findById('any_identity')
    expect(task).toBeNull()
  })
  test('should throw error if id is no provided in delete', () => {
    const { sut } = makeSut()
    const promise = sut.delete()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
  test('should return null if task not found in delete', async () => {
    const { sut } = makeSut()
    const task = await sut.delete('any_identity')
    expect(task).toBeNull()
  })
  test('should return true if task is deleted', async () => {
    const { sut } = makeSut()
    const id = MongoDB.objectId('any_identity')
    await db.collection('tasks').insertOne({
      _id: id,
      description: 'any description',
      is_checked: true
    })

    const isDeleted = await sut.delete(id)
    const task = await db.collection('tasks').findOne({ _id: id })

    expect(task).toBeNull()
    expect(isDeleted).toBeTruthy()
  })
  test('should return null if task not found in update', async () => {
    const { sut } = makeSut()
    const task = await sut.update('any_identity', { isChecked: true })
    expect(task).toBeNull()
  })
  test('should throw error if payload for update is no provided', async () => {
    const { sut } = makeSut()
    const suts = [sut.update('any_identity'), sut.update('any_identity', {})]
    for (const promise of suts) {
      expect(promise).rejects.toThrow(new MissingParamError('isChecked'))
    }
  })
  test('should return task if is updated', async () => {
    const { sut } = makeSut()
    const id = MongoDB.objectId('any_identity')
    await db.collection('tasks').insertOne({
      _id: id,
      description: 'any description',
      is_checked: false
    })

    const task = await sut.update('any_identity', { isChecked: true })
    const taskDocument = await db.collection('tasks').findOne({ _id: id })

    expect(task).toBeInstanceOf(TaskEntity)
    expect(taskDocument.is_checked).toBeTruthy()
  })
  test.todo('should throw error if the id provided is invalid in update')
  test.todo('should throw error if the id provided is invalid in delete')
  test.todo('should throw error if the id provided is invalid in findByid')
})
