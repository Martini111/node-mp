const events = require('express').Router();
const ObjectID = require('mongodb').ObjectID;
const Joi = require('joi');
const eventScheme = require('./schemes/event');

const routeEvents = (db) => {
    const eventsCollection = db.collection('events');
    events.route('/')
        .get((req, res) => {
            eventsCollection.find({}).toArray()
                .then((data) => res.json(data))
        })
        .put((req, res) => {
            const {id, ...newData} = req.body;
            const {error} = Joi.validate(req.body, eventScheme);

            if (error) {
                res.status(405).send(error);
                return;
            }

            eventsCollection.findOneAndUpdate({_id: new ObjectID(id)}, {$set: newData}, {returnOriginal: false})
                .then((data) => res.json(data.value))
        })
        .post((req, res) => {
            const {error} = Joi.validate(req.body, eventScheme);

            if (error) {
                res.status(405).send(error);
                return;
            }

            eventsCollection.insert(req.body)
                .then((data) => {
                    res.json(data.ops[0])
                })
        })

    events.route('/:id')
        .get((req, res) => {
            const {id} = req.params;
            eventsCollection.findOne({_id: new ObjectID(id)})
            .then((data) => res.json(data))
        })
        .delete((req, res) => {
            const {id} = req.params;
            eventsCollection.remove({_id: new ObjectID(id)}, true)
            .then(() => res.send(id))
        });

    return events;
};

module.exports = {
    routeEvents
};