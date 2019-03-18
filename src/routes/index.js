const routes = require('express').Router();

const events = require('./events');
const discoveries = require('./discoveries');

routes.use('/events', events);
routes.use('/discoveries', discoveries);

module.exports = routes;