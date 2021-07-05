const TaskAdapter = require('../../adapters/task-adapter')
const InvalidParamError = require('../../utils/errors/invalid-param-error')
const MongoDB = require('../helpers/mongo-db')

class TaskRepository {
  async create ({ description, is_checked = false }) {
    if (!description) throw new InvalidParamError('description')
    const taskDocument = await MongoDB.client
      .db()
      .collection('tasks')
      .insertOne({ description, is_checked })

    return TaskAdapter.adapt({
      id: taskDocument.ops[0]._id,
      description: taskDocument.ops[0].description,
      isChecked: taskDocument.ops[0].is_checked
    })
  }

  async findAll () {
    let taskList = await MongoDB.client
      .db()
      .collection('tasks')
      .find()
      .toArray()

    taskList = taskList.map(document => {
      return TaskAdapter.adapt({
        id: document._id,
        description: document.description,
        isChecked: document.is_checked
      })
    })

    return taskList
  }
}

module.exports = TaskRepository
