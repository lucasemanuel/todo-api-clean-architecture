const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')

class DeleteTaskRouter {
  constructor ({ deleteTaskUseCase }) {
    this.deleteTaskUseCase = deleteTaskUseCase
  }

  async route (httpRequest) {
    try {
      const { id } = httpRequest.body
      if (!id) return HttpResponse.badRequest(new MissingParamError('id'))
      await this.deleteTaskUseCase.execute(id)
      return {
        statusCode: 204
      }
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

const makeDeleteTaskUseCaseWithErrorSpy = () => {
  class DeleteTaskUseCaseWithErrorSpy {
    async execute () {
      throw new Error()
    }
  }

  return new DeleteTaskUseCaseWithErrorSpy()
}

const makeDeleteTaskUseCaseSpy = () => {
  class DeleteTaskUseCaseSpy {
    async execute (id) {
      this.id = id
    }
  }
  return new DeleteTaskUseCaseSpy()
}

const makeSut = () => {
  const deleteTaskUseCaseSpy = makeDeleteTaskUseCaseSpy()
  const sut = new DeleteTaskRouter({ deleteTaskUseCase: deleteTaskUseCaseSpy })
  return {
    sut,
    deleteTaskUseCaseSpy
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
  test('should call DeleteTaskUseCase with correct params', async () => {
    const { deleteTaskUseCaseSpy } = makeSut()
    const sut = new DeleteTaskRouter({
      deleteTaskUseCase: deleteTaskUseCaseSpy
    })
    const httpRequest = {
      body: {
        id: 'any id'
      }
    }
    await sut.route(httpRequest)
    expect(deleteTaskUseCaseSpy.id).toBe('any id')
  })
  test('should return 500 if DeleteTaskUseCase throw error', async () => {
    const deleteTaskUseCaseWithErrorSpy = makeDeleteTaskUseCaseWithErrorSpy()
    const sut = new DeleteTaskRouter({
      deleteTaskUseCase: deleteTaskUseCaseWithErrorSpy
    })
    const httpRequest = {
      body: {
        id: 'any id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should return 204 after delete task', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        id: 'any id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
  })
})
