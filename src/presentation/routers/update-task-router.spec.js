const HttpResponse = require('../helpers/http-response')
const { ServerError } = require('../errors')
const { MissingParamError } = require('../../utils/errors')

class UpdateTaskRouter {
  constructor ({ getTaskByIdUseCase, checkTaskUseCase, uncheckTaskUseCase }) {
    this.getTaskByIdUseCase = getTaskByIdUseCase
    this.checkTaskUseCase = checkTaskUseCase
    this.uncheckTaskUseCase = uncheckTaskUseCase
  }

  async route (httpRequest) {
    try {
      const { id } = httpRequest.params
      if (!id) return HttpResponse.badRequest(new MissingParamError('id'))
      let task = await this.getTaskByIdUseCase.execute(id)
      if (!task) return HttpResponse.notFound('task')
      task = task.isChecked
        ? await this.uncheckTaskUseCase.execute(task)
        : await this.checkTaskUseCase.execute(task)
      return HttpResponse.ok({ task })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}

const makeGetTaskByIdUseCaseWithErrorSpy = () => {
  class GetTaskByIdUseCaseWithErrorSpy {
    async execute () {
      throw new Error()
    }
  }
  return new GetTaskByIdUseCaseWithErrorSpy()
}

const makeGetTaskByIdUseCaseSpy = () => {
  class GetTaskByIdUseCaseSpy {
    async execute (id) {
      this.id = id
      return this.task
    }
  }
  return new GetTaskByIdUseCaseSpy()
}

const makeCheckTaskUseCaseSpy = () => {
  class CheckTaskUseCaseSpy {
    async execute (task) {
      task.isChecked = true
      this.task = task
      return task
    }
  }
  return new CheckTaskUseCaseSpy()
}

const makeUncheckTaskUseCaseSpy = () => {
  class UncheckTaskUseCaseSpy {
    async execute (task) {
      task.isChecked = false
      this.task = task
      return task
    }
  }
  return new UncheckTaskUseCaseSpy()
}

const makeSut = () => {
  const getTaskByIdUseCaseSpy = makeGetTaskByIdUseCaseSpy()
  const checkTaskUseCaseSpy = makeCheckTaskUseCaseSpy()
  const uncheckTaskUseCaseSpy = makeUncheckTaskUseCaseSpy()
  const sut = new UpdateTaskRouter({
    getTaskByIdUseCase: getTaskByIdUseCaseSpy,
    checkTaskUseCase: checkTaskUseCaseSpy,
    uncheckTaskUseCase: uncheckTaskUseCaseSpy
  })
  return {
    sut,
    getTaskByIdUseCaseSpy,
    checkTaskUseCaseSpy,
    uncheckTaskUseCaseSpy
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
  test('should return 404 if GetTaskByIdUseCase does not return a task', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body.error).toBe(
      HttpResponse.notFound('task').body.error
    )
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
  test('should return 500 if GetTaskByIdUseCase throw error', async () => {
    const deleteTaskUseCaseWithErrorSpy = makeGetTaskByIdUseCaseWithErrorSpy()
    const sut = new UpdateTaskRouter({
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
  test('should call CheckTaskUseCase with correct params', async () => {
    const { sut, getTaskByIdUseCaseSpy, checkTaskUseCaseSpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }
    getTaskByIdUseCaseSpy.task = {
      id: 'any_id',
      description: 'any description',
      isChecked: false
    }
    await sut.route(httpRequest)
    expect(checkTaskUseCaseSpy.task).toEqual({
      id: 'any_id',
      description: 'any description',
      isChecked: true
    })
  })
  test('should call UncheckTaskUseCase with correct params', async () => {
    const { sut, getTaskByIdUseCaseSpy, uncheckTaskUseCaseSpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }
    getTaskByIdUseCaseSpy.task = {
      id: 'any_id',
      description: 'any description',
      isChecked: true
    }
    await sut.route(httpRequest)
    expect(uncheckTaskUseCaseSpy.task).toEqual({
      id: 'any_id',
      description: 'any description',
      isChecked: false
    })
  })
  test('should return task checked', async () => {
    const { sut, getTaskByIdUseCaseSpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }
    getTaskByIdUseCaseSpy.task = { isChecked: false }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.task.isChecked).toBeTruthy()
  })
  test('should return task unchecked', async () => {
    const { sut, getTaskByIdUseCaseSpy } = makeSut()
    const httpRequest = {
      params: {
        id: 'any_id'
      }
    }
    getTaskByIdUseCaseSpy.task = { isChecked: true }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.task.isChecked).toBeFalsy()
  })
})
