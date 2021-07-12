const { MissingParamError } = require('../../utils/errors')

class UncheckTaskUseCase {
  async execute (task) {
    if (!task) throw new MissingParamError('task')
  }
}

const makeSut = () => {
  const sut = new UncheckTaskUseCase()
  return {
    sut
  }
}

describe('Uncheck task Use Case', () => {
  test('should throw error if task is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('task'))
  })
})
