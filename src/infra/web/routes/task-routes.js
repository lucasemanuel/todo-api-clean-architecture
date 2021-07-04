const router = require('express').Router()
const ExpressRouterAdapter = require('../adapters/ExpressRouterAdapter')
const createTaskRouterComposer = require('../composers/create-task-router-composer').compose()

router.post('/', ExpressRouterAdapter.adapt(createTaskRouterComposer))

module.exports = router
