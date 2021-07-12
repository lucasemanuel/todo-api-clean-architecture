const { MissingParamError } = require('../../utils/errors')

class GetTaskByIdUseCase {
  async execute (id) {
    if (!id) throw new MissingParamError('id')
    return null
  }
}

const makeSut = () => {
  const sut = new GetTaskByIdUseCase()
  return {
    sut
  }
}

describe('Get Task By Id Use Case', () => {
  test('should return null if task not found', async () => {
    const { sut } = makeSut()
    const task = await sut.execute('any_id')
    expect(task).toBeNull()
  })
  test('should throw error if id is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
})
