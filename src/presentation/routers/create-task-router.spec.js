const CreateTaskRouter = require('./create-task-router')
const { ServerError } = require('../errors')
const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  const createTaskRouter = new CreateTaskRouter()
  return {
    sut: createTaskRouter
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
})
