const { MissingParamError } = require('../../utils/errors')

class CreateTaskUseCase {
  async create (description) {
    if (!description) throw new MissingParamError('description')
  }
}

describe('Check Task Use Case', () => {
  test('should throw if no description is provided', () => {
    const createTaskUseCase = new CreateTaskUseCase()
    const sut = createTaskUseCase.create()
    expect(sut).rejects.toThrow(new MissingParamError('description'))
  })
})
