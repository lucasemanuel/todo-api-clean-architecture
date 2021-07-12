class GetTaskByIdUseCase {
  async execute () {
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
    const task = await sut.execute()
    expect(task).toBeNull()
  })
})
