module.exports = class DomainError extends Error {
  constructor (message) {
    super(`Domain error: ${message}`)
    this.name = 'DomainError'
  }
}
