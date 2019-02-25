const events = require('express').Router();
const util = require('util');
const path = require('path');
const uuidv4 = require('uuid/v4');
const readFile = util.promisify(require("fs").readFile);
const writeFile = util.promisify(require("fs").writeFile);
const eventsPath = path.join(__dirname, '..', '..', 'data', 'events.json');
const {transformById, findById, filterById} = require('../utils/utils');
const Joi = require('joi');
const eventScheme = require('./schemes/event');

events.route('/')
    .get((req, res) => {
        readFile(eventsPath, 'utf8')
            .then(data => res.json(JSON.parse(data)))
    })
    .put((req, res) => {
        const {id, ...newData} = req.body;
        const {error} = Joi.validate(req.body, eventScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        readFile(eventsPath, 'utf8')
            .then(data => writeFile(eventsPath, JSON.stringify(transformById(id, JSON.parse(data), newData)), 'utf8'))
            .then(() => res.json({id, ...newData}))
    })
    .post((req, res) => {
        const newEvent = {id: uuidv4(), ...req.body};

        const {error} = Joi.validate(req.body, eventScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        readFile(eventsPath, 'utf8')
            .then(data => [newEvent, ...JSON.parse(data)])
            .then(extendedArray =>
                writeFile(eventsPath, JSON.stringify(extendedArray), 'utf8'))
            .then(() => res.json(newEvent))
    })

events.route('/:id')
    .get((req, res) => {
        readFile(eventsPath, 'utf8')
            .then(data => res.json(findById(req.params.id, JSON.parse(data))));
    })
    .delete((req, res) => {
        const id = req.params.id;
        readFile(eventsPath, 'utf8')
            .then(data =>
                writeFile(eventsPath, JSON.stringify(filterById(id, JSON.parse(data))), 'utf8'))
            .then(() => res.send(id))
    });

module.exports = events;