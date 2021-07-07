const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class DeleteTaskRouter {
  constructor ({ deleteTaskUseCase }) {
    this.deleteTaskUseCase = deleteTaskUseCase
  }

  async route (httpRequest) {
    try {
      const { id } = httpRequest.body
      if (!id) return HttpResponse.badRequest(new MissingParamError('id'))
      const result = await this.deleteTaskUseCase.execute(id)
      if (result === null) {
        return { statusCode: 404 }
      }
      return {
        statusCode: 204
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = DeleteTaskRouter
