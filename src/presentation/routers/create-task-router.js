const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

module.exports = class CreateTaskRouter {
  async route (httpRequest) {
    try {
      const { description } = httpRequest.body

      if (!description) {
        return HttpResponse.badRequest(new MissingParamError('description'))
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
