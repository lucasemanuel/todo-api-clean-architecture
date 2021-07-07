const { MissingParamError, InvalidParamError } = require('../../utils/errors')
const TaskEntity = require('../entities/task-entity')

class DeleteTaskUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (
      !this.taskRepository ||
      !this.taskRepository.delete ||
      !this.taskRepository.findById
    ) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (id) {
    this.taskRepositoryIsValid()
    if (!id) throw new MissingParamError('id')

    const task = await this.taskRepository.findById(id)
    if (task instanceof TaskEntity) {
      return await this.taskRepository.delete(id)
    }
    return null
  }
}

module.exports = DeleteTaskUseCase
