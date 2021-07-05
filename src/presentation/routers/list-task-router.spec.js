class ListTaskRouter {
  async route () {
    return {
      statusCode: 200
    }
  }
}

const makeSut = () => {
  const sut = new ListTaskRouter()
  return {
    sut
  }
}

describe('List Task Router', () => {
  test('should return 200 if there no error when find tasks', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(200)
  })
})
