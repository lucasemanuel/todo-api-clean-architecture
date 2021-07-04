const { MongoClient } = require('mongodb')
const { mongoUri } = require('../config/env')

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
  }
}
