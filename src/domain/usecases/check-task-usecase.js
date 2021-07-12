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

  async execute (id) {
    this.taskRepositoryIsValid()
    if (!id) throw new MissingParamError('id')
    let task = await this.taskRepository.findById(id)
    if (task === null) return null
    try {
      task.check()
    } catch (error) {
      throw new DomainError(error.message)
    }
    task = await this.taskRepository.update(id, { isChecked: true })
    return task
  }
}

module.exports = CheckTaskUseCase
