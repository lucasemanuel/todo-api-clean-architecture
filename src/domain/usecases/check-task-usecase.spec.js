const {
  MissingParamError,
  InvalidParamError,
  DomainError
} = require('../../utils/errors')

class CheckTaskUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.update) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (id) {
    this.taskRepositoryIsValid()
    if (!id) throw new MissingParamError('id')
    let task = await this.taskRepository.findById(id)
    if (task === null) return null
    try {
      task.check()
    } catch (error) {
      throw new DomainError(error.message)
    }
    task = await this.taskRepository.update(id, { isChecked: true })
    return task
  }
}

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

    async findById (id) {
      this.id = id
      return this.task
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
  test('should throw error if id is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
  test('should call TaskRepository with correct id', async () => {
    const { sut, taskRepositorySpy } = makeSut()
    await sut.execute('any_id')
    expect(taskRepositorySpy.id).toBe('any_id')
  })
  test('should call TaskRepository with correct payload', async () => {
    const { sut, taskRepositorySpy } = makeSut()
    await sut.execute('any_id')
    expect(taskRepositorySpy.isChecked).toBeTruthy()
  })
  test('should throw error if TaskRepository is invalid', () => {
    const suts = [
      new CheckTaskUseCase(),
      new CheckTaskUseCase({}),
      new CheckTaskUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      const promise = sut.execute('any_id')
      expect(promise).rejects.toThrow(new InvalidParamError('taskRepository'))
    }
  })
  test('should throw error if TaskRepository throws', async () => {
    const taskRepositoryWithErrorSpy = makeTaskRepositoryWithErrorSpy()
    const sut = new CheckTaskUseCase({
      taskRepository: taskRepositoryWithErrorSpy
    })
    const promise = sut.execute('any_id')
    expect(promise).rejects.toThrow()
  })
  test('should return null if task not found', async () => {
    const taskRepositorySpy = makeTaskRepositorySpy()
    const sut = new CheckTaskUseCase({
      taskRepository: taskRepositorySpy
    })
    taskRepositorySpy.task = null
    const task = await sut.execute('invalid_id')
    expect(task).toBeNull()
  })
  test('should return true if task is update', async () => {
    const { sut } = makeSut()
    const result = await sut.execute('any id')
    expect(result).toBeTruthy()
  })
  test('should throw DomainError if check a task already checked', () => {
    const { sut, taskRepositorySpy } = makeSut()
    taskRepositorySpy.task.isChecked = true
    const promise = sut.execute('any_id')
    expect(promise).rejects.toThrowError(DomainError)
  })
})
