const { InvalidParamError } = require('../../utils/errors')

class ListAllTasksUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.findAll) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute () {
    this.taskRepositoryIsValid()
    const taskList = await this.taskRepository.findAll()
    return taskList
  }
}

module.exports = ListAllTasksUseCase
