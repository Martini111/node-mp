const discoveries = require('express').Router();
const util = require('util');
const path = require('path');
const uuidv4 = require('uuid/v4');
const writeFile = util.promisify(require("fs").writeFile);
const discoveriesPath = path.join(__dirname, '..', '..', 'data', 'discoveries.json');
const data = require(discoveriesPath);
const {transformById, findById, filterById} = require('../utils/utils');

discoveries.route('/')
    .get((req, res) => {
        res.json(data);
    })
    .put((req, res) => {
        const {id, ...newData} = req.body;
        writeFile(discoveriesPath, JSON.stringify(transformById(id, data, newData)), 'utf8')
        .then(() => res.json({id, ...newData}))
    })
    .post((req, res) => {
        const newDiscovery = {id: uuidv4(), ...req.body};
        const extendedArray = [newDiscovery, ...data]
        writeFile(discoveriesPath, JSON.stringify(extendedArray), 'utf8')
        .then(() => res.json(newDiscovery))
    })

discoveries.route('/:id')
    .get((req, res) => {
        res.json(findById(req.params.id, data));
    })
    .delete((req, res) => {
        const id = req.params.id;
        writeFile(discoveriesPath, JSON.stringify(filterById(id, data)), 'utf8')
        .then(() => res.send(id))
    });

module.exports = discoveries;