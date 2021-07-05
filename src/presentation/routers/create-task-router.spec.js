const CreateTaskRouter = require('./create-task-router')
const { ServerError } = require('../errors')
const { MissingParamError } = require('../../utils/errors')
const TaskAdapter = require('../../adapters/task-adapter')

class CreateTaskUseCaseSpy {
  async execute ({ description, isChecked }) {
    this.description = description
    this.isChecked = isChecked

    return TaskAdapter.adapt({ description, isChecked })
  }
}

const makeCreateTaskUseCaseWithError = () => {
  class CreateTaskUseCaseWithError {
    async execute () {
      throw new Error()
    }
  }
  return new CreateTaskUseCaseWithError()
}

const makeSut = () => {
  const createTaskUseCaseSpy = new CreateTaskUseCaseSpy()
  const sut = new CreateTaskRouter({ createTaskUseCase: createTaskUseCaseSpy })
  return {
    sut,
    createTaskUseCaseSpy
  }
}

describe('Create Task Router', () => {
  test('should return 400 if no description is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(
      new MissingParamError('description').message
    )
  })
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
  test('should call CreateTaskUseCase with correct params', async () => {
    const { sut, createTaskUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        description: 'any description',
        isChecked: false
      }
    }
    await sut.route(httpRequest)
    expect(createTaskUseCaseSpy.description).toBe(httpRequest.body.description)
    expect(createTaskUseCaseSpy.isChecked).toBe(httpRequest.body.isChecked)
  })
  test('should return 500 if CreateTaskUseCase throws error', async () => {
    const createTaskUseCaseWithError = makeCreateTaskUseCaseWithError()
    const sut = new CreateTaskRouter({
      createTaskUseCase: createTaskUseCaseWithError
    })
    const httpRequest = {
      body: {
        description: 'any description',
        isChecked: false
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
  test('should return 201 if is provided correct params', async () => {
    const { sut } = makeSut()
    const data = {
      description: 'any description',
      isChecked: false
    }
    const httpRequest = {
      body: data
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body.task).toEqual({ ...data, id: undefined })
  })
})
