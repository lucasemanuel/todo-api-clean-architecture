const CreateTaskUseCase = require('./create-task-usecase')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async insert ({ description }) {
      this.description = description
      return {
        description
      }
    }
  }

  return new TaskRepositorySpy()
}

const makeTaskRepositoryWithErrorSpy = () => {
  class TaskRepositoryWithErrorSpy {
    async insert () {
      throw new Error()
    }
  }

  return new TaskRepositoryWithErrorSpy()
}

const makeSut = () => {
  const taskRepositorySpy = makeTaskRepositorySpy()
  const sut = new CreateTaskUseCase({ taskRepository: taskRepositorySpy })

  return {
    sut,
    taskRepositorySpy
  }
}

describe('Check Task Use Case', () => {
  test('should throw if no description is provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('description'))
  })
  test('should throw an error if TaskRepository is invalid', () => {
    const suts = [
      new CreateTaskUseCase(),
      new CreateTaskUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      const promise = sut.execute('any description')
      expect(promise).rejects.toThrow(new InvalidParamError('taskRepository'))
    }
  })
  test('should throw if TaskRepository insert method throw error', () => {
    const taskRepositoryWithErrorSpy = makeTaskRepositoryWithErrorSpy()
    const sut = new CreateTaskUseCase({
      taskRepository: taskRepositoryWithErrorSpy
    })
    const promise = sut.execute('any description')
    expect(promise).rejects.toThrow()
  })
  test('should call TaskRepository with correct description', async () => {
    const { sut, taskRepositorySpy } = makeSut()
    await sut.execute('any description')
    expect(taskRepositorySpy.description).toBe('any description')
  })
  test('should return a new task', async () => {
    const { sut } = makeSut()
    const task = await sut.execute('any description')
    expect(task).toBeTruthy()
  })
})
