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
    await this.taskRepository.update(id)
  }
}

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async update (id) {
      this.id = id
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
  test('should throw error if TaskRepository is invalid', () => {
    const suts = [
      new CheckTaskUseCase(),
      new CheckTaskUseCase({}),
      new CheckTaskUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      expect(() => {
        sut.taskRepositoryIsValid()
        sut.execute('any id')
      }).toThrow(new InvalidParamError('taskRepository'))
    }
  })
})
