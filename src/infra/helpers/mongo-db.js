const { MongoClient, ObjectID } = require('mongodb')
const { mongoUri } = require('../config/env')
const { InvalidParamError } = require('../../utils/errors')

module.exports = {
  async connect () {
    this.client = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async isConnected () {
    return this.client && this.client.topology.isConnected()
  },
  async disconnect () {
    if (this.isConnected()) {
      await this.client.close()
      this.client = null
    }
  },
  objectId (id) {
    try {
      return new ObjectID(id)
    } catch (error) {
      throw new InvalidParamError('id')
    }
  }
}
