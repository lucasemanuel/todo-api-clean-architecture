const TaskEntity = require('../domain/entities/task-entity')

module.exports = {
  adapt ({ description, isChecked, id }) {
    return new TaskEntity({ description, isChecked, id })
  }
}
