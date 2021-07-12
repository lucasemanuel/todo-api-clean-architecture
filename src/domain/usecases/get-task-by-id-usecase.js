const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class GetTaskByIdUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.findById) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (id) {
    if (!id) throw new MissingParamError('id')
    this.taskRepositoryIsValid()
    const task = await this.taskRepository.findById(id)
    return task || null
  }
}

module.exports = GetTaskByIdUseCase
