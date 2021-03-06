const TaskAdapter = require('../../adapters/task-adapter')
const { InvalidParamError, MissingParamError } = require('../../utils/errors')
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

  async findById (id) {
    if (!id) throw new MissingParamError('id')
    id = MongoDB.objectId(id)
    const taskDocument = await MongoDB.client
      .db()
      .collection('tasks')
      .findOne({ _id: id })

    const task = taskDocument
      ? TaskAdapter.adapt({
          id: taskDocument._id,
          description: taskDocument.description,
          isChecked: taskDocument.is_checked
        })
      : null
    return task
  }

  async update (id, payload = {}) {
    const { isChecked } = payload
    id = MongoDB.objectId(id)
    if (isChecked === undefined || isChecked === null) {
      throw new MissingParamError('isChecked')
    }

    await MongoDB.client
      .db()
      .collection('tasks')
      .updateOne(
        { _id: id },
        {
          $set: { is_checked: isChecked }
        }
      )

    return (await this.findById(id)) || null
  }

  async delete (id) {
    if (!id) throw new MissingParamError('id')
    id = MongoDB.objectId(id)
    const result = await MongoDB.client
      .db()
      .collection('tasks')
      .deleteOne({ _id: id })

    return result.deletedCount ? true : null
  }
}

module.exports = TaskRepository
