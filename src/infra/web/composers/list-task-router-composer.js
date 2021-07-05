const ListTaskRouter = require('../../../presentation/routers/list-task-router')
const ListAllTaskUseCase = require('../../../domain/usecases/list-all-tasks-usecase')
const TaskRepository = require('../../repositories/task-repository')

class ListTaskRouterComposer {
  static compose () {
    const taskRepository = new TaskRepository()
    const listAllTaskUseCase = new ListAllTaskUseCase({
      taskRepository
    })
    return new ListTaskRouter({ listAllTaskUseCase })
  }
}

module.exports = ListTaskRouterComposer
