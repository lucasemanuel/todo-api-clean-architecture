const TaskEntity = require('./task-entity')

const makeTaskEntity = () => new TaskEntity({ description: 'any_task' })

const makeTaskEntityChecked = () =>
  new TaskEntity({ description: 'any_task', isChecked: true })

describe('Task Entity', () => {
  test('should check a task', () => {
    const sut = makeTaskEntity()
    sut.check()
    expect(sut.isChecked).toBe(true)
  })
  test('should throw an error when trying check a task already checked', () => {
    const sut = makeTaskEntityChecked()
    expect(() => {
      sut.check()
    }).toThrow()
  })
  test('should uncheck a task', () => {
    const sut = makeTaskEntityChecked()
    sut.uncheck()
    expect(sut.isChecked).toBe(false)
  })
  test('should throw an error when trying uncheck a task not checked', () => {
    const sut = makeTaskEntity()
    expect(() => {
      sut.uncheck()
    }).toThrow()
  })
  test('should have the correct id value', () => {
    const sut = new TaskEntity({
      description: 'any description',
      isChecked: false,
      id: 1
    })
    expect(sut.id).toBe(1)
  })
})
