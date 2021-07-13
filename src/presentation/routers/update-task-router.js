const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class UpdateTaskRouter {
  constructor ({ getTaskByIdUseCase, checkTaskUseCase, uncheckTaskUseCase }) {
    this.getTaskByIdUseCase = getTaskByIdUseCase
    this.checkTaskUseCase = checkTaskUseCase
    this.uncheckTaskUseCase = uncheckTaskUseCase
  }

  async route (httpRequest) {
    try {
      const { id } = httpRequest.params
      if (!id) return HttpResponse.badRequest(new MissingParamError('id'))
      let task = await this.getTaskByIdUseCase.execute(id)
      if (!task) return HttpResponse.notFound('task')
      task = task.isChecked
        ? await this.uncheckTaskUseCase.execute(task)
        : await this.checkTaskUseCase.execute(task)
      return HttpResponse.ok({ task })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = UpdateTaskRouter
