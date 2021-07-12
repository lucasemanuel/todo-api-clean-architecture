const { MissingParamError } = require('../../utils/errors')

class CheckTaskUseCase {
  async execute () {
    throw new MissingParamError('id')
  }
}

const makeSut = () => {
  const sut = new CheckTaskUseCase()
  return {
    sut
  }
}

describe('Check task Use Case', () => {
  test('should throw error if id is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
