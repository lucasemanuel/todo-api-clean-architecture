class TaskEntity {
  constructor ({ description, isCheck = false }) {
    this.description = description
    this.isCheck = isCheck
  }

  check () {
    this.isCheck = true
  }

  unCheck () {
    this.isCheck = false
  }
}

describe('Task Entity', () => {
  test('should check a task', () => {
    const sut = new TaskEntity('any_task')
    sut.check()
    expect(sut.isCheck).toBe(true)
  })
  test('should uncheck an task', () => {
    const sut = new TaskEntity('any_task')
    sut.undoCheck()
    expect(sut.isCheck).toBe(false)
  })
})
