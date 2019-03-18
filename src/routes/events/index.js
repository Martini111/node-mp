const events = require('express').Router();
const Joi = require('joi');
const eventScheme = require('./schemes/event');
const eventModel = require('./schemes/event_mongo_model');

events.route('/')
    .get((req, res) => {
        eventModel.find({})
            .then((data) => res.json(data))
    })
    .post((req, res) => {
        const {error} = Joi.validate(req.body, eventScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        eventModel.create(req.body)
            .then((data) => res.json(data))
    })
    .put((req, res) => {
        const {id, ...newData} = req.body;
        const {error} = Joi.validate(req.body, eventScheme);

        if (error) {
            res.status(405).send(error);
            return;
        }

        eventModel.findByIdAndUpdate({_id: id}, {$set: newData}, {new: true})
            .then((data) => res.send(data))
    })

events.route('/:id')
    .get((req, res) => {
        const {id} = req.params;
        eventModel.findById({_id: id})
            .then((data) => res.json(data))
    })
    .delete((req, res) => {
        const {id} = req.params;
        eventModel.findByIdAndRemove({_id: id})
            .then((data) => res.json(data));
    });

module.exports = events;