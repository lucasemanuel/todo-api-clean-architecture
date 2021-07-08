const MongoDB = require('./mongo-db')
const { InvalidParamError } = require('../../utils/errors')

describe('MongoDB', () => {
  test('should connect with database', async () => {
    await MongoDB.connect()
    const isConnected = await MongoDB.isConnected()
    expect(isConnected).toBeTruthy()
    await MongoDB.disconnect()
  })
  test('should disconnect database', async () => {
    await MongoDB.connect()
    await MongoDB.disconnect()
    const isConnected = await MongoDB.isConnected()
    expect(isConnected).toBeFalsy()
    expect(MongoDB.client).toBeNull()
  })
  test('should throw error if the id provided is invalid', async () => {
    await MongoDB.connect()
    expect(() => {
      MongoDB.objectId('id_invalid')
    }).toThrow(new InvalidParamError('id'))
    await MongoDB.disconnect()
  })
})
