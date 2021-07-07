const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class DeleteTaskRouter {
  constructor ({ deleteTaskUseCase }) {
    this.deleteTaskUseCase = deleteTaskUseCase
  }

  async route (httpRequest) {
    try {
      const { id } = httpRequest.params
      if (!id) return HttpResponse.badRequest(new MissingParamError('id'))

      return (await this.deleteTaskUseCase.execute(id))
        ? HttpResponse.noContent()
        : HttpResponse.notFound('task')
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = DeleteTaskRouter
