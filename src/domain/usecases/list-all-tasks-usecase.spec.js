const { InvalidParamError } = require('../../utils/errors')

class ListAllTasksUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.findAll) {
      throw new InvalidParamError('taskRepository')
    }
    return true
  }

  async execute () {
    this.taskRepositoryIsValid()
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
})
