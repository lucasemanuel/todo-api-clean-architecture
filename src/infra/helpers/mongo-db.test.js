const MongoDB = require('./mongo-db')

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
})
