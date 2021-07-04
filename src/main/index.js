const MongoDB = require('../infra/helpers/mongo-db')
const { port } = require('../infra/config/env')
const app = require('../infra/web/app')

console.log('aff')
MongoDB.connect()
  .then(() => {
    app.listen(port, () => console.log(`Server Running in port: ${port}`))
  })
  .catch(console.error)
