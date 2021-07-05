const ListAllTasksUseCase = require('./list-all-tasks-usecase')
const TaskEntity = require('../entities/task-entity')
const { InvalidParamError } = require('../../utils/errors')

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async findAll () {
      return Promise.resolve([
        new TaskEntity({ description: 'any description 0' }),
        new TaskEntity({ description: 'any description 1' }),
        new TaskEntity({ description: 'any description 2' })
      ])
    }
  }

  return new TaskRepositorySpy()
}

const makeTaskRepositoryWithErrorSpy = () => {
  class TaskRepositoryWithErrorSpy {
    async findAll () {
      throw new Error()
    }
  }

  return new TaskRepositoryWithErrorSpy()
}

const makeSut = () => {
  const taskRepositorySpy = makeTaskRepositorySpy()
  const sut = new ListAllTasksUseCase({
    taskRepository: taskRepositorySpy
  })

  return {
    sut,
    taskRepositorySpy
  }
}

describe('List All Tasks Use Case', () => {
  test('should throw error if TaskRepository is invalid', () => {
    const suts = [
      new ListAllTasksUseCase(),
      new ListAllTasksUseCase({}),
      new ListAllTasksUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      const promise = sut.execute()
      expect(promise).rejects.toThrow(new InvalidParamError('taskRepository'))
    }
  })
  test('should return the task List', async () => {
    const { sut } = makeSut()
    const taskList = await sut.execute()
    expect(taskList).toEqual([
      new TaskEntity({ description: 'any description 0' }),
      new TaskEntity({ description: 'any description 1' }),
      new TaskEntity({ description: 'any description 2' })
    ])
  })
  test('should throw if TaskRepository findAll method throw error', () => {
    const taskRepositoryWithErrorSpy = makeTaskRepositoryWithErrorSpy()
    const sut = new ListAllTasksUseCase({
      taskRepository: taskRepositoryWithErrorSpy
    })
    const promise = sut.execute()
    expect(promise).rejects.toThrow()
  })
})
