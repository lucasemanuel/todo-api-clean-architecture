const { ServerError } = require('../errors')
const ListTaskRouter = require('./list-task-router')

const makeListAllTaskUseCaseSpy = () => {
  class ListAllTaskUseCaseSpy {
    constructor () {
      this.tasklist = []
    }

    async execute () {
      return this.tasklist
    }
  }
  return new ListAllTaskUseCaseSpy()
}

const makeListAllTaskUseCaseWithErrorSpy = () => {
  class ListAllTaskUseCaseWithErrorSpy {
    async execute () {
      throw new Error()
    }
  }
  return new ListAllTaskUseCaseWithErrorSpy()
}

const makeSut = () => {
  const listAllTaskUseCaseSpy = makeListAllTaskUseCaseSpy()
  const sut = new ListTaskRouter({ listAllTaskUseCase: listAllTaskUseCaseSpy })
  return {
    sut,
    listAllTaskUseCaseSpy
  }
}

describe('List Task Router', () => {
  test('should return 200 if there no error when find tasks', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(200)
  })
  test('should return task list', async () => {
    const listAllTaskUseCaseSpy = makeListAllTaskUseCaseSpy()
    const sut = new ListTaskRouter({
      listAllTaskUseCase: listAllTaskUseCaseSpy
    })
    listAllTaskUseCaseSpy.tasklist = [
      {
        id: '1',
        description: 'any description',
        isChecked: false
      },
      {
        id: '2',
        description: 'any description',
        isChecked: false
      }
    ]
    const httpResponse = await sut.route()
    expect(httpResponse.body.length).toBe(2)
    for (const task of httpResponse.body) {
      expect(task.id).not.toBeUndefined()
      expect(task.description).not.toBeUndefined()
      expect(task.isChecked).not.toBeUndefined()
    }
  })
  test('should return 500 if ListAllTaskUseCase throws error', async () => {
    const ListAllTaskUseCaseWithErrorSpy = makeListAllTaskUseCaseWithErrorSpy()
    const sut = new ListTaskRouter({
      listAllTaskUseCase: ListAllTaskUseCaseWithErrorSpy
    })
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new ServerError().message)
  })
})
