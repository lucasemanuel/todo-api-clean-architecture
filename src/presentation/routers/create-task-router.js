const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class CreateTaskRouter {
  constructor ({ createTaskUseCase }) {
    this.createTaskUseCase = createTaskUseCase
  }

  async route (httpRequest) {
    try {
      const { description, isChecked } = httpRequest.body
      if (!description) {
        return HttpResponse.badRequest(new MissingParamError('description'))
      }

      await this.createTaskUseCase.execute({ description, isChecked })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = CreateTaskRouter
