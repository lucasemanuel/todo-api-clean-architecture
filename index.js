const express = require('express')
const app = express()

require('dotenv').config()

const { PORT } = process.env

app.get('/', (request, response) => {
  response.status(200).send('Hello World!')
})

app.listen(PORT, () => console.log('Server Started!'))
