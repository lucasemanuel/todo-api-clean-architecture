const DeleteTaskUseCase = require('../usecases/delete-task-usecase')
const TaskEntity = require('../entities/task-entity')
const { MissingParamError, InvalidParamError } = require('../../utils/errors')

const makeTaskRepositoryWithErrorSpy = () => {
  class TaskRepositoryWithErrorFindByIdMethodSpy {
    async findById () {
      throw new Error()
    }

    async delete () {}
  }

  class TaskRepositoryWithErrorDeleteMethodSpy {
    async findById () {
      return new TaskEntity({
        description: 'any description'
      })
    }

    async delete () {
      throw new Error()
    }
  }

  return {
    taskRepositoryWithErrorFindByIdMethodSpy: new TaskRepositoryWithErrorFindByIdMethodSpy(),
    taskRepositoryWithErrorDeleteMethodSpy: new TaskRepositoryWithErrorDeleteMethodSpy()
  }
}

const makeTaskRepositorySpy = () => {
  class TaskRepositorySpy {
    async findById (id) {
      this.id = id
      return new TaskEntity({
        description: 'any description'
      })
    }

    async delete (id) {
      this.id = id
    }
  }

  return new TaskRepositorySpy()
}

const makeSut = () => {
  const taskRepositorySpy = makeTaskRepositorySpy()
  const sut = new DeleteTaskUseCase({
    taskRepository: taskRepositorySpy
  })
  return {
    sut
  }
}

describe('Delete Task Use Case', () => {
  test('should throw error if id is no provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new MissingParamError('id'))
  })
  test('should throw error if TaskRepository is invalid', () => {
    const suts = [
      new DeleteTaskUseCase(),
      new DeleteTaskUseCase({}),
      new DeleteTaskUseCase({ taskRepository: {} })
    ]
    for (const sut of suts) {
      expect(() => {
        sut.taskRepositoryIsValid()
        sut.execute('any id')
      }).toThrow(new InvalidParamError('taskRepository'))
    }
  })
  test('should throw error if TaskRepository throws', async () => {
    const {
      taskRepositoryWithErrorFindByIdMethodSpy,
      taskRepositoryWithErrorDeleteMethodSpy
    } = makeTaskRepositoryWithErrorSpy()
    const suts = [
      new DeleteTaskUseCase({
        taskRepository: taskRepositoryWithErrorFindByIdMethodSpy
      }),
      new DeleteTaskUseCase({
        taskRepository: taskRepositoryWithErrorDeleteMethodSpy
      })
    ]
    for (const sut of suts) {
      const promise = sut.execute('any id')
      expect(promise).rejects.toThrow()
    }
  })
  test('should call TaskRepository with correct id', async () => {
    const taskRepositorySpy = makeTaskRepositorySpy()
    const sut = new DeleteTaskUseCase({ taskRepository: taskRepositorySpy })
    await sut.execute('any id')
    expect(taskRepositorySpy.id).toBe('any id')
  })
  test('should delete if the task is found', async () => {
    const { sut } = makeSut()
    const result = await sut.execute('any id')
    expect(result).toBe(true)
  })
})
