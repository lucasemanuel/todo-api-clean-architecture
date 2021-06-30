const { MissingParamError } = require('../../utils/errors')

class CreateTaskUseCase {
  async execute (description) {
    if (!description) throw new MissingParamError('description')
  }
}

describe('Check Task Use Case', () => {
  test('should throw if no description is provided', () => {
    const createTaskUseCase = new CreateTaskUseCase()
    const sut = createTaskUseCase.execute()
    expect(sut).rejects.toThrow(new MissingParamError('description'))
  })
})
