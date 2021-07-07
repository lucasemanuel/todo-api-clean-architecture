const DeleteTaskRouter = require('../../../presentation/routers/delete-task-router')
const DeleteTaskUseCase = require('../../../domain/usecases/delete-task-usecase')
const TaskRepository = require('../../repositories/task-repository')

class DeleteTaskRouterComposer {
  static compose () {
    const taskRepository = new TaskRepository()
    const deleteTaskUseCase = new DeleteTaskUseCase({
      taskRepository
    })
    return new DeleteTaskRouter({ deleteTaskUseCase })
  }
}

module.exports = DeleteTaskRouterComposer
