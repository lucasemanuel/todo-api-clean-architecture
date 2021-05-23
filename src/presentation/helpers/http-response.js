const { ServerError } = require('../routers/errors')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: {
        error
      }
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: {
        error: new ServerError()
      }
    }
  }
}
