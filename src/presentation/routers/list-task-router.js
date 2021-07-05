const HttpResponse = require('../helpers/http-response')

class ListTaskRouter {
  constructor ({ listAllTaskUseCase } = {}) {
    this.listAllTaskUseCase = listAllTaskUseCase
  }

  async route () {
    try {
      const tasklist = await this.listAllTaskUseCase.execute()
      return {
        statusCode: 200,
        body: tasklist
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

module.exports = ListTaskRouter
