class TaskEntity {
  constructor ({ description, isChecked = false }) {
    this.description = description
    this.isChecked = isChecked
  }

  checked () {
    this.isChecked = true
  }

  unChecked () {
    this.isChecked = false
  }
}

const makeTaskEntity = () => new TaskEntity({ description: 'any_task' })

describe('Task Entity', () => {
  test('should check a task', () => {
    const sut = makeTaskEntity()
    sut.checked()
    expect(sut.isChecked).toBe(true)
  })
  test('should uncheck a task', () => {
    const sut = makeTaskEntity()
    sut.unChecked()
    expect(sut.isChecked).toBe(false)
  })
})
