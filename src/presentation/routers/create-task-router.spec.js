const CreateTaskRouter = require('./create-task-router')
const { ServerError } = require('../errors')
const { MissingParamError } = require('../../utils/errors')

class CreateTaskUseCaseSpy {
  async execute ({ description, isChecked }) {
    this.description = description
    this.isChecked = isChecked
  }
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
    expect(httpResponse.body.error).toEqual(
      new MissingParamError('description')
    )
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
  test('should call CreateTaskUseCase with correct params', () => {
    const { sut, createTaskUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        description: 'any description',
        isChecked: false
      }
    }
    sut.route(httpRequest)
    expect(createTaskUseCaseSpy.description).toBe(httpRequest.body.description)
    expect(createTaskUseCaseSpy.isChecked).toBe(httpRequest.body.isChecked)
  })
})
