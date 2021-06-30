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
    const task = await this.taskRepository.insert({ description })
    return task
  }
}

module.exports = CreateTaskUseCase
