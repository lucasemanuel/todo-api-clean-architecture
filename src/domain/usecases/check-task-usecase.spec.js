const CheckTaskUseCase = require('./check-task-usecase')
const {
  MissingParamError,
  InvalidParamError,
  DomainError
} = require('../../utils/errors')

const makeTaskEntitySpy = () => {
  class TaskEntitySpy {
    check () {
      if (this.isChecked) throw new Error()
    }
  }
  return new TaskEntitySpy()
}

const makeTaskRepositoryWithErrorSpy = () => {
  class TaskRepositoryWithErrorSpy {
    async update () {
      throw new Error()
    }
  }
  return new TaskRepositoryWithErrorSpy()
}

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async update (id, payload = {}) {
      this.id = id
      this.isChecked = payload.isChecked
      return true
    }
  }
  return new TaskRepositorySpy()
}

const makeSut = () => {
  const taskEntitySpy = makeTaskEntitySpy()
  const taskRepositorySpy = makeTaskRepositorySpy()
  taskRepositorySpy.task = taskEntitySpy
  const sut = new CheckTaskUseCase({ taskRepository: taskRepositorySpy })
  return {
    sut,
    taskRepositorySpy,
    taskEntitySpy
  }
}

describe('Check task Use Case', () => {
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
    expect(taskRepositorySpy.isChecked).toBeTruthy()
  })
  test('should throw error if TaskRepository is invalid', () => {
    const { taskEntitySpy } = makeSut()
    const suts = [
      new CheckTaskUseCase(),
      new CheckTaskUseCase({}),
      new CheckTaskUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      const promise = sut.execute(taskEntitySpy)
      expect(promise).rejects.toThrow(new InvalidParamError('taskRepository'))
    }
  })
  test('should throw error if TaskRepository throws', async () => {
    const taskRepositoryWithErrorSpy = makeTaskRepositoryWithErrorSpy()
    const taskEntity = makeTaskEntitySpy()
    const sut = new CheckTaskUseCase({
      taskRepository: taskRepositoryWithErrorSpy
    })
    const promise = sut.execute(taskEntity)
    expect(promise).rejects.toThrow()
  })
  test('should throw DomainError if check a task already checked', () => {
    const { sut, taskEntitySpy } = makeSut()
    taskEntitySpy.isChecked = true
    const promise = sut.execute(taskEntitySpy)
    expect(promise).rejects.toThrowError(DomainError)
  })
  test('should return task', async () => {
    const { sut, taskEntitySpy } = makeSut()
    const task = await sut.execute(taskEntitySpy)
    expect(task).toBeTruthy()
  })
})
