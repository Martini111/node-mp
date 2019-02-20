const express = require('express');
const router = express.Router();
const uuidv1 = require('uuid/v1');
const util = require('util');
const readFile = util.promisify(require("fs").readFile);
const writeFile = util.promisify(require("fs").writeFile);

const eventsPath = `${__dirname}/data/events.json`;
const discoveriesPath = `${__dirname}/data/discoveries.json`;

router.route('/events')
    .get((req, res) => {
        readFile(eventsPath, 'utf8')
            .then(data => res.json(JSON.parse(data)))
    })
    .put((req, res) => {
        const {id, event} = req.body;
        readFile(eventsPath, 'utf8')
        .then(data => {
            const events = JSON.parse(data);
            return events.map(el => el.id === id ? {...el, event} : el);
        })
        .then(transformedData => writeFile(eventsPath, JSON.stringify(transformedData), 'utf8'))
        .then(() => res.json({id, event}))
    })
    .post((req, res) => {
        const {event} = req.body;
        const newEvent = {id: uuidv1(), event};
        readFile(eventsPath, 'utf8')
        .then(data => {
            const events = JSON.parse(data);
            return [newEvent, ...events]
        })
        .then(extendedArray => writeFile(eventsPath, JSON.stringify(extendedArray), 'utf8'))
        .then(() => res.json(newEvent))
    })

router.route('/events/:id')
    .get((req, res) => {
        const id = req.params.id;
        readFile(eventsPath, 'utf8')
        .then(data => {
            const events = JSON.parse(data);
            const event = events.find(el => el.id === id);
            res.json(event);
        })
    })
    .delete((req, res) => {
        const id = req.params.id;
        readFile(eventsPath, 'utf8')
        .then(data => {
            const events = JSON.parse(data);
            return events.filter(el => el.id !== id);
        })
        .then(filteredEvents => writeFile(eventsPath, JSON.stringify(filteredEvents), 'utf8'))
        .then(() => res.send(id))
    })

router.route('/discoveries')
    .get((req, res) => {
        readFile(discoveriesPath, 'utf8')
        .then(data => res.json(JSON.parse(data)));
    });

module.exports = router;