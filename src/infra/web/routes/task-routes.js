const router = require('express').Router()
const ExpressRouterAdapter = require('../adapters/ExpressRouterAdapter')
const deleteTaskRouterComposer = require('../composers/delete-task-router-composer').compose()
const createTaskRouterComposer = require('../composers/create-task-router-composer').compose()
const listTaskRouterComposer = require('../composers/list-task-router-composer').compose()
const updateTaskRouterComposer = require('../composers/update-task-router-composer').compose()

router.get('/', ExpressRouterAdapter.adapt(listTaskRouterComposer))
router.post('/', ExpressRouterAdapter.adapt(createTaskRouterComposer))
router.delete('/:id', ExpressRouterAdapter.adapt(deleteTaskRouterComposer))
router.patch('/:id', ExpressRouterAdapter.adapt(updateTaskRouterComposer))

module.exports = router
