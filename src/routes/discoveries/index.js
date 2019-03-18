const discoveries = require('express').Router();
const ObjectID = require('mongodb').ObjectID;
const Joi = require('joi');
const discoveryScheme = require('./schemes/discovery');

const routeDiscoveries = (db) => {
    const discoveriesCollection = db.collection('discoveries');
    discoveries.route('/')
        .get((req, res) => {
            discoveriesCollection.find({}).toArray()
                .then((data) => res.json(data))
        })
        .put((req, res) => {
            const {id, ...newData} = req.body;

            const {error} = Joi.validate(req.body, discoveryScheme);

            if (error) {
                res.status(405).send(error);
                return;
            }

            discoveriesCollection.findOneAndUpdate({_id: new ObjectID(id)}, {$set: newData}, {returnOriginal: false})
                .then((data) => res.json(data.value))
        })
        .post((req, res) => {
            const {error} = Joi.validate(req.body, discoveryScheme);

            if (error) {
                res.status(405).send(error);
                return;
            }

            discoveriesCollection.insert(req.body)
                .then((data) => {
                    res.json(data.ops[0])
                })
        })

    discoveries.route('/:id')
        .get((req, res) => {
            const {id} = req.params;
            discoveriesCollection.findOne({_id: new ObjectID(id)})
            .then((data) => res.json(data))
        })
        .delete((req, res) => {
            const {id} = req.params;
            discoveriesCollection.remove({_id: new ObjectID(id)}, true)
            .then(() => res.send(id))
        });

    return discoveries;
};

module.exports = {
    routeDiscoveries
};