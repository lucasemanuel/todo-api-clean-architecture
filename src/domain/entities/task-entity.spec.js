class TaskEntity {
  constructor (task) {
    this.task = task
    this.isCheck = false
  }

  check () {
    this.isCheck = true
  }
}

describe('Task Entity', () => {
  test('should check a task', () => {
    const sut = new TaskEntity('any_task')
    sut.check()
    expect(sut.isCheck).toBe(true)
  })
})
