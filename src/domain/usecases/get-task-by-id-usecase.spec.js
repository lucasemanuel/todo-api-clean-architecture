const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class GetTaskByIdUseCase {
  constructor ({ taskRepository } = {}) {
    this.taskRepository = taskRepository
  }

  taskRepositoryIsValid () {
    if (!this.taskRepository || !this.taskRepository.findById) {
      throw new InvalidParamError('taskRepository')
    }
  }

  async execute (id) {
    if (!id) throw new MissingParamError('id')
    this.taskRepositoryIsValid()
    const task = await this.taskRepository.findById(id)
    return task || null
  }
}

const makeTaskRepositoryWithErrorSpy = () => {
  class TaskRepositoryWithErrorSpy {
    async findById () {
      throw new Error()
    }
  }
  return new TaskRepositoryWithErrorSpy()
}

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async findById (id) {
      this.id = id
      return this.task
    }
  }
  return new TaskRepositorySpy()
}

const makeSut = () => {
  const taskRepositorySpy = makeTaskRepositorySpy()
  const sut = new GetTaskByIdUseCase({
    taskRepository: taskRepositorySpy
  })
  return {
    sut,
    taskRepositorySpy
  }
}

describe('Get Task By Id Use Case', () => {
  test('should return null if task not found', async () => {
    const { sut } = makeSut()
    const task = await sut.execute('any_id')
    expect(task).toBeNull()
  })
  test('should return task if is found', async () => {
    const { sut, taskRepositorySpy } = makeSut()
    taskRepositorySpy.task = {
      id: 'any_id',
      description: 'any_description',
      isChecked: false
    }
    const task = await sut.execute('any id')
    expect(task).toBeTruthy()
  })
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
  test('should throw error if TaskRepository is invalid', () => {
    const suts = [
      new GetTaskByIdUseCase(),
      new GetTaskByIdUseCase({}),
      new GetTaskByIdUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      const promise = sut.execute('any_id')
      expect(promise).rejects.toThrow(new InvalidParamError('taskRepository'))
    }
  })
  test('should throw error if TaskRepository throws', async () => {
    const taskRepositoryWithErrorSpy = makeTaskRepositoryWithErrorSpy()
    const sut = new GetTaskByIdUseCase({
      taskRepository: taskRepositoryWithErrorSpy
    })
    const promise = sut.execute('any_id')
    expect(promise).rejects.toThrow()
  })
})
