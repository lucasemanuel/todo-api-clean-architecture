const InvalidParamError = require('../../utils/errors/invalid-param-error')

class TaskRepository {
  async create ({ description }) {
    if (!description) throw new InvalidParamError('description')
  }
}

describe('Task Respository', () => {
  test('should throw error if a description is invalid or no provided in method create', () => {
    const sut = new TaskRepository()
    const suts = [sut.create({}), sut.create({ description: '' })]
    for (const promise of suts) {
      expect(promise).rejects.toThrow(new InvalidParamError('description'))
    }
  })
})
