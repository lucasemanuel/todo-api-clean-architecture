const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class CreateTaskUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.insert) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (description) {
    if (!description) throw new MissingParamError('description')
    this.taskRepositoryIsValid()
  }
}

class TaskRepository {
  async insert () {}
}

const makeSut = () => {
  const taskRepository = new TaskRepository()
  return new CreateTaskUseCase({ taskRepository })
}

describe('Check Task Use Case', () => {
  test('should throw if no description is provided', () => {
    const sut = makeSut()
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
})
