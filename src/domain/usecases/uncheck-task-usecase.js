const {
  DomainError,
  InvalidParamError,
  MissingParamError
} = require('../../utils/errors')

class UncheckTaskUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository?.update) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (task) {
    if (!task) throw new MissingParamError('task')
    this.taskRepositoryIsValid()
    try {
      task.uncheck()
    } catch (error) {
      throw new DomainError(error.message)
    }
    task = await this.taskRepository.update(task.id, { isChecked: false })
    return task
  }
}

module.exports = UncheckTaskUseCase
