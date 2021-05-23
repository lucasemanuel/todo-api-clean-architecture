const { ServerError } = require('./errors')

const makeSut = () => {
  class CreateTaskRoute {
    async route (httpRequest) {
      try {
        const { email } = httpRequest.body

        if (!email) {
          return {
            statusCode: 400
          }
        }
      } catch (error) {
        return {
          statusCode: 500,
          body: {
            error: new ServerError()
          }
        }
      }
    }
  }

  const createTaskRoute = new CreateTaskRoute()
  return {
    sut: createTaskRoute
  }
}

describe('Create Task', () => {
  test('should return 400 if no task is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
  test('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toEqual(new ServerError())
  })
  test('should return 500 if no body is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toEqual(new ServerError())
  })
})
