const { MongoClient } = require('mongodb')
const { mongoUrl } = require('../config/database')

module.exports = {
  async connect () {
    this.client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect () {
    await this.client.close()
  }
}
