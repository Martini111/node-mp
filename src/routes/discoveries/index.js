const discoveries = require('express').Router();
const Joi = require('joi');
const discoveryScheme = require('./schemes/discovery');
const discoveryModel = require('./schemes/discovery_mongo_model');

discoveries.route('/')
    .get((req, res) => {
        discoveryModel.find({})
            .then((data) => res.json(data))
    })
    .post((req, res) => {
        const {error} = Joi.validate(req.body, discoveryScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        discoveryModel.create(req.body)
            .then((data) => res.json(data))
    })
    .put((req, res) => {
        const {id, ...newData} = req.body;
        const {error} = Joi.validate(req.body, discoveryScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        discoveryModel.findByIdAndUpdate({_id: id}, {$set: newData}, {new: true})
            .then((data) => res.send(data))
    })

discoveries.route('/:id')
    .get((req, res) => {
        const {id} = req.params;
        discoveryModel.findById({_id: id})
            .then((data) => res.json(data))
    })
    .delete((req, res) => {
        const {id} = req.params;
        discoveryModel.findByIdAndRemove({_id: id})
            .then((data) => res.json(data));
    });

module.exports = discoveries;