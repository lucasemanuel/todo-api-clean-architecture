class TaskEntity {
  constructor ({ description, isChecked = false }) {
    this.description = description
    this.isChecked = isChecked
  }

  checked () {
    if (this.isChecked) throw new Error('The task is already checked.')
    this.isChecked = true
  }

  unChecked () {
    if (!this.isChecked) throw new Error('The task is not checked.')
    this.isChecked = false
  }
}

const makeTaskEntity = () => new TaskEntity({ description: 'any_task' })

const makeTaskEntityChecked = () =>
  new TaskEntity({ description: 'any_task', isChecked: true })

describe('Task Entity', () => {
  test('should check a task', () => {
    const sut = makeTaskEntity()
    sut.checked()
    expect(sut.isChecked).toBe(true)
  })
  test('should throw an error when trying check a task already checked', () => {
    const sut = makeTaskEntityChecked()
    expect(() => {
      sut.checked()
    }).toThrow()
  })
  test('should uncheck a task', () => {
    const sut = makeTaskEntityChecked()
    sut.unChecked()
    expect(sut.isChecked).toBe(false)
  })
  test('should throw an error when trying uncheck a task not checked', () => {
    const sut = makeTaskEntity()
    expect(() => {
      sut.unChecked()
    }).toThrow()
  })
})
