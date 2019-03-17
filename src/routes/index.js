const routes = require('express').Router();

const events = require('./events').routeEvents;
const discoveries = require('./discoveries');

module.exports = {
    routes(db) {
        routes.use('/events', events(db));
        routes.use('/discoveries', discoveries);

        return routes;
    }
};