const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')

class DeleteTaskRouter {
  async route (httpRequest) {
    try {
      const { id } = httpRequest.body
      if (!id) return HttpResponse.badRequest(new MissingParamError('id'))
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

const makeSut = () => {
  const sut = new DeleteTaskRouter()
  return {
    sut
  }
}

describe('Delete task Router', () => {
  test('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should return 500 if no body is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should return 400 if no id is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('id').message)
  })
})
