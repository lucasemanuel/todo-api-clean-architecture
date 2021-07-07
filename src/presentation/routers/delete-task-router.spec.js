const DeleteTaskRouter = require('./delete-task-router')
const { MissingParamError } = require('../../utils/errors')
const { ServerError } = require('../errors')
const HttpResponse = require('../helpers/http-response')

const makeDeleteTaskUseCaseWithErrorSpy = () => {
  class DeleteTaskUseCaseWithErrorSpy {
    async execute () {
      throw new Error()
    }
  }

  return new DeleteTaskUseCaseWithErrorSpy()
}

const makeDeleteTaskUseCaseReturnNullSpy = () => {
  class DeleteTaskUseCaseReturnNullSpy {
    async execute (id) {
      this.id = id
      return null
    }
  }
  return new DeleteTaskUseCaseReturnNullSpy()
}

const makeDeleteTaskUseCaseSpy = () => {
  class DeleteTaskUseCaseSpy {
    async execute (id) {
      this.id = id
      return true
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
  test('should return 500 if no httpRequest.params is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should return 400 if no id is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      params: {}
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
      params: {
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
      params: {
        id: 'any id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should return 204 if DeleteTaskUseCase return true', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      params: {
        id: 'any id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
  })
  test('should return 404 if DeleteTaskUseCase return null', async () => {
    const deleteTaskUseCaseReturnNullSpy = makeDeleteTaskUseCaseReturnNullSpy()
    const sut = new DeleteTaskRouter({
      deleteTaskUseCase: deleteTaskUseCaseReturnNullSpy
    })
    const httpRequest = {
      params: {
        id: 'any id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body.error).toBe(
      HttpResponse.notFound('task').body.error
    )
  })
})
