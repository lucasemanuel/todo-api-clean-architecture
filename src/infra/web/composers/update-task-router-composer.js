const UpdateTaskRouter = require('../../../presentation/routers/update-task-router')
const CheckTaskUseCase = require('../../../domain/usecases/check-task-usecase')
const UncheckTaskUseCase = require('../../../domain/usecases/uncheck-task-usecase')
const GetTaskByIdUseCase = require('../../../domain/usecases/get-task-by-id-usecase')
const TaskRepository = require('../../repositories/task-repository')

class UpdateTaskRouterComposer {
  static compose () {
    const taskRepository = new TaskRepository()
    const checkTaskUseCase = new CheckTaskUseCase({
      taskRepository
    })
    const uncheckTaskUseCase = new UncheckTaskUseCase({
      taskRepository
    })
    const getTaskByIdUseCase = new GetTaskByIdUseCase({
      taskRepository
    })
    return new UpdateTaskRouter({
      checkTaskUseCase,
      uncheckTaskUseCase,
      getTaskByIdUseCase
    })
  }
}

module.exports = UpdateTaskRouterComposer
