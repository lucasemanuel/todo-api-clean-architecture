const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class CheckTaskUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.update) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (id) {
    if (!id) throw new MissingParamError('id')
    const task = await this.taskRepository.update(id, { isChecked: true })
    return task
  }
}

const makeTaskRepositoryWithErrorSpy = () => {
  class TaskRepositoryWithErrorSpy {
    async update () {
      throw new Error()
    }
  }
  return new TaskRepositoryWithErrorSpy()
}

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async update (id, payload = {}) {
      this.id = id
      this.isChecked = payload.isChecked
      if (this.id === 'invalid_id') return null
      return true
    }
  }
  return new TaskRepositorySpy()
}

const makeSut = () => {
  const taskRepositorySpy = makeTaskRepositorySpy()
  const sut = new CheckTaskUseCase({ taskRepository: taskRepositorySpy })
  return {
    sut
  }
}

describe('Check task Use Case', () => {
  test('should throw error if id is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
  test('should call TaskRepository with correct id', async () => {
    const taskRepositorySpy = makeTaskRepositorySpy()
    const sut = new CheckTaskUseCase({ taskRepository: taskRepositorySpy })
    await sut.execute('any_id')
    expect(taskRepositorySpy.id).toBe('any_id')
  })
  test('should call TaskRepository with correct payload', async () => {
    const taskRepositorySpy = makeTaskRepositorySpy()
    const sut = new CheckTaskUseCase({ taskRepository: taskRepositorySpy })
    await sut.execute('any_id')
    expect(taskRepositorySpy.isChecked).toBeTruthy()
  })
  test('should throw error if TaskRepository is invalid', () => {
    const suts = [
      new CheckTaskUseCase(),
      new CheckTaskUseCase({}),
      new CheckTaskUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      expect(() => {
        sut.taskRepositoryIsValid()
        sut.execute('any_id')
      }).toThrow(new InvalidParamError('taskRepository'))
    }
  })
  test('should throw error if TaskRepository throws', async () => {
    const taskRepositoryWithErrorSpy = makeTaskRepositoryWithErrorSpy()
    const sut = new CheckTaskUseCase({
      taskRepository: taskRepositoryWithErrorSpy
    })
    const promise = sut.execute('any_id')
    expect(promise).rejects.toThrow()
  })
  test('should return null if task not found', async () => {
    const { sut } = makeSut()
    const result = await sut.execute('invalid_id')
    expect(result).toBeNull()
  })
  test('should return true if task is update', async () => {
    const { sut } = makeSut()
    const result = await sut.execute('any id')
    expect(result).toBeTruthy()
  })
})
