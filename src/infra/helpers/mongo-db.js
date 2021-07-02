const { MongoClient } = require('mongodb')
const { mongoUrl } = require('../config/database')

module.exports = {
  async connect () {
    this.client = await MongoClient.connect(mongoUrl, {
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
