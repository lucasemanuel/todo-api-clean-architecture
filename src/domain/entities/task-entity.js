class TaskEntity {
  constructor ({ description, isChecked = false }) {
    this.description = description
    this.isChecked = isChecked
  }

  check () {
    if (this.isChecked) throw new Error('The task is already checked.')
    this.isChecked = true
  }

  unCheck () {
    if (!this.isChecked) throw new Error('The task is not checked.')
    this.isChecked = false
  }
}

module.exports = TaskEntity
