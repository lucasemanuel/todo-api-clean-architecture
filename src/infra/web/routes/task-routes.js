const router = require('express').Router()
const ExpressRouterAdapter = require('../adapters/ExpressRouterAdapter')
const createTaskRouterComposer = require('../composers/create-task-router-composer').compose()
const listTaskRouterComposer = require('../composers/list-task-router-composer').compose()

router.get('/', ExpressRouterAdapter.adapt(listTaskRouterComposer))
router.post('/', ExpressRouterAdapter.adapt(createTaskRouterComposer))

module.exports = router
