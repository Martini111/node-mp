const discoveries = require('express').Router();
const util = require('util');
const path = require('path');
const uuidv4 = require('uuid/v4');
const readFile = util.promisify(require("fs").readFile);
const writeFile = util.promisify(require("fs").writeFile);
const discoveriesPath = path.join(__dirname, '..', '..', 'data', 'discoveries.json');
const {transformById, findById, filterById} = require('../utils/utils');
const Joi = require('joi');
const discoveryScheme = require('./schemes/discovery');

discoveries.route('/')
    .get((req, res) => {
        readFile(discoveriesPath, 'utf8')
            .then(data => res.json(JSON.parse(data)))
    })
    .put((req, res) => {
        const {id, ...newData} = req.body;

        const {error} = Joi.validate(req.body, discoveryScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        readFile(discoveriesPath, 'utf8')
            .then(data => writeFile(discoveriesPath, JSON.stringify(transformById(id, JSON.parse(data), newData)), 'utf8'))
            .then(() => res.json({id, ...newData}))
    })
    .post((req, res) => {
        const newDiscovery = {id: uuidv4(), ...req.body};

        const {error} = Joi.validate(req.body, discoveryScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        readFile(discoveriesPath, 'utf8')
            .then(data => [newDiscovery, ...JSON.parse(data)])
            .then(extendedArray =>
                writeFile(discoveriesPath, JSON.stringify(extendedArray), 'utf8'))
            .then(() => res.json(newDiscovery))
    })

discoveries.route('/:id')
    .get((req, res) => {
        readFile(discoveriesPath, 'utf8')
            .then(data => res.json(findById(req.params.id, JSON.parse(data))));
    })
    .delete((req, res) => {
        const id = req.params.id;
        readFile(discoveriesPath, 'utf8')
            .then(data =>
                writeFile(discoveriesPath, JSON.stringify(filterById(id, JSON.parse(data))), 'utf8'))
            .then(() => res.send(id))
    });

module.exports = discoveries;