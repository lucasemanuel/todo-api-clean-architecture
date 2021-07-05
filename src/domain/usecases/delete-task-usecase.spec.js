const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class DeleteTaskUseCase {
  async execute () {
    throw new MissingParamError('id')
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.delete) {
      throw new InvalidParamError('taskRepository')
    }
  }
}

const makeSut = () => {
  const sut = new DeleteTaskUseCase()
  return {
    sut
  }
}

describe('Delete Task Use Case', () => {
  test('should throw error if id is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
  test('should throw error if TaskRepository is invalid', () => {
    const suts = [
      new DeleteTaskUseCase(),
      new DeleteTaskUseCase({}),
      new DeleteTaskUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      expect(() => {
        sut.taskRepositoryIsValid()
      }).toThrow(new InvalidParamError('taskRepository'))
    }
  })
})
