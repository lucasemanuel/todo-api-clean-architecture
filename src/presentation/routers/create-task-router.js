const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

module.exports = class CreateTaskRouter {
  async route (httpRequest) {
    try {
      const { task } = httpRequest.body

      if (!task) {
        return HttpResponse.badRequest(new MissingParamError('task'))
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
