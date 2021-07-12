const { MissingParamError } = require('../../utils/errors')

const makeTaskEntitySpy = () => {
  class TaskEntitySpy {}
  return new TaskEntitySpy()
}

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async update (id, payload) {
      this.id = id
      this.isChecked = payload.isChecked
    }
  }
  return new TaskRepositorySpy()
}

class UncheckTaskUseCase {
  constructor ({ taskRepository }) {
    this.taskRepository = taskRepository
  }

  async execute (task) {
    if (!task) throw new MissingParamError('task')
    await this.taskRepository.update(task.id, { isChecked: false })
  }
}

const makeSut = () => {
  const taskRepositorySpy = makeTaskRepositorySpy()
  const taskEntitySpy = makeTaskEntitySpy()
  const sut = new UncheckTaskUseCase({ taskRepository: taskRepositorySpy })
  return {
    sut,
    taskEntitySpy,
    taskRepositorySpy
  }
}

describe('Uncheck task Use Case', () => {
  test('should throw error if task is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('task'))
  })
  test('should call TaskRepository with correct id', async () => {
    const { sut, taskRepositorySpy, taskEntitySpy } = makeSut()
    taskEntitySpy.id = 'any_id'
    await sut.execute(taskEntitySpy)
    expect(taskRepositorySpy.id).toBe('any_id')
  })
  test('should call TaskRepository with correct payload', async () => {
    const { sut, taskRepositorySpy, taskEntitySpy } = makeSut()
    await sut.execute(taskEntitySpy)
    expect(taskRepositorySpy.isChecked).toBe(false)
  })
})
