const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class DeleteTaskUseCase {
  async execute () {
    throw new MissingParamError('id')
  }

  taskRepositoryIsValid () {
    if (
      !this.taskRepository ||
      !this.taskRepository.delete ||
      this.taskRepository.findById
    ) {
      throw new InvalidParamError('taskRepository')
    }
  }
}

const makeTaskRepositoryWithErrorSpy = () => {
  class TaskRepositoryWithErrorFindByIdMethodSpy {
    async findById () {
      throw new Error()
    }

    async delete () {}
  }

  class TaskRepositoryWithErrorDeleteMethodSpy {
    async findById () {}

    async delete () {
      throw new Error()
    }
  }

  return {
    taskRepositoryWithErrorFindByIdMethodSpy: new TaskRepositoryWithErrorFindByIdMethodSpy(),
    taskRepositoryWithErrorDeleteMethodSpy: new TaskRepositoryWithErrorDeleteMethodSpy()
  }
}

const makeSut = () => {
  const sut = new DeleteTaskUseCase()
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
})
