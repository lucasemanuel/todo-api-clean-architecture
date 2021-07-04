const CreateTaskRouter = require('../../../presentation/routers/create-task-router')
const CreateTaskUseCase = require('../../../domain/usecases/create-task-usecase')
const TaskRepository = require('../../repositories/task-repository')

class CreateTaskRouterComposer {
  static compose () {
    const taskRepository = new TaskRepository()
    const createTaskUseCase = new CreateTaskUseCase({
      taskRepository
    })
    return new CreateTaskRouter({ createTaskUseCase })
  }
}

module.exports = CreateTaskRouterComposer
