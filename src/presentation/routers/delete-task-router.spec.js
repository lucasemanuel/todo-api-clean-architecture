const { ServerError } = require('../errors')
const HttpResponse = require('../helpers/http-response')

class DeleteTaskRouter {
  async route (httpRequest) {
    return HttpResponse.serverError()
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
})
