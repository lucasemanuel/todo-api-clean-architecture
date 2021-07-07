const { ServerError } = require('../errors')

module.exports = class HttpResponse {
  static noContent () {
    return {
      statusCode: 204
    }
  }

  static badRequest (error) {
    return {
      statusCode: 400,
      body: {
        error: error.message
      }
    }
  }

  static notFound (resource) {
    return {
      statusCode: 404,
      body: {
        error: `Not Found: ${resource}`
      }
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: {
        error: new ServerError().message
      }
    }
  }
}
