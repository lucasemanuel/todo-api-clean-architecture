const { MissingParamError } = require('../../utils/errors')

class DeleteTaskUseCase {
  async execute () {
    throw new MissingParamError('id')
  }
}

const makeSut = () => {
  const sut = new DeleteTaskUseCase()
  return {
    sut
  }
}

describe('Delete Task Use Case', () => {
  test('should throw error if id is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
