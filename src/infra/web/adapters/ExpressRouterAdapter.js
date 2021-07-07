module.exports = {
  adapt (router) {
    return async (request, response) => {
      const httpRequest = {
        body: request.body || {},
        params: request.params || {}
      }
      const httpResponse = await router.route(httpRequest)
      response.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
