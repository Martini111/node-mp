const events = require('express').Router();
const util = require('util');
const path = require('path');
const uuidv4 = require('uuid/v4');
const writeFile = util.promisify(require("fs").writeFile);
const eventsPath = path.join(__dirname, '..', '..', 'data', 'events.json');
const data = require(eventsPath);
const {transformById, findById, filterById} = require('../utils/utils');

events.route('/')
    .get((req, res) => {
        res.json(data);
    })
    .put((req, res) => {
        const {id, ...newData} = req.body;
        writeFile(eventsPath, JSON.stringify(transformById(id, data, newData)), 'utf8')
        .then(() => res.json({id, ...newData}))
    })
    .post((req, res) => {
        const newEvent = {id: uuidv4(), ...req.body};
        const extendedArray = [newEvent, ...data]
        writeFile(eventsPath, JSON.stringify(extendedArray), 'utf8')
        .then(() => res.json(newEvent))
    })

events.route('/:id')
    .get((req, res) => {
        res.json(findById(req.params.id, data));
    })
    .delete((req, res) => {
        const id = req.params.id;
        writeFile(eventsPath, JSON.stringify(filterById(id, data)), 'utf8')
        .then(() => res.send(id))
    });

module.exports = events;