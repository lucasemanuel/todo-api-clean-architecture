const { ServerError } = require('../errors')
const HttpResponse = require('../helpers/http-response')

class UpdateTaskRouter {
  constructor ({ getTaskByIdUseCase }) {
    this.getTaskByIdUseCase = getTaskByIdUseCase
  }

  async route (httpRequest) {
    try {
      const { id } = httpRequest.params
      await this.getTaskByIdUseCase.execute(id)
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

const makeGetTaskByIdUseCaseSpy = () => {
  class GetTaskByIdUseCaseSpy {
    async execute (id) {
      this.id = id
    }
  }

  return new GetTaskByIdUseCaseSpy()
}

const makeSut = () => {
  const getTaskByIdUseCaseSpy = makeGetTaskByIdUseCaseSpy()
  const sut = new UpdateTaskRouter({
    getTaskByIdUseCase: getTaskByIdUseCaseSpy
  })
  return {
    sut,
    getTaskByIdUseCaseSpy
  }
}

describe('Update Task Router', () => {
  test('should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should return 500 if no httpRequest.params is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should call GetTaskByIdUseCase with correct params', async () => {
    const { sut, getTaskByIdUseCaseSpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }
    await sut.route(httpRequest)
    expect(getTaskByIdUseCaseSpy.id).toBe('any_id')
  })
})
