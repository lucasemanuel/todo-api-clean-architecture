const {
  InvalidParamError,
  MissingParamError,
  DomainError
} = require('../../utils/errors')

class CheckTaskUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.update) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (task) {
    if (!task) throw new MissingParamError('task')
    this.taskRepositoryIsValid()
    try {
      task.check()
    } catch (error) {
      throw new DomainError(error.message)
    }
    task = await this.taskRepository.update(task.id, { isChecked: true })
    return task
  }
}

module.exports = CheckTaskUseCase
