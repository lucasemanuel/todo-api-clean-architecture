class TaskEntity {
  constructor ({ id = undefined, description, isChecked = false }) {
    this.id = id
    this.description = description
    this.isChecked = isChecked
  }

  check () {
    if (this.isChecked) throw new Error('The task is already checked.')
    this.isChecked = true
  }

  uncheck () {
    if (!this.isChecked) throw new Error('The task is not checked.')
    this.isChecked = false
  }
}

module.exports = TaskEntity
