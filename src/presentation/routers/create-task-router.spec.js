const makeSut = () => {
  class CreateTaskRoute {
    async route (httpRequest) {
      const { body } = httpRequest
      if (!body.email) {
        return {
          statusCode: 400
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
})
