const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose, {convert: false});

const joiEventSchema = require('./event');

const mongooseEventSchema = new Mongoose.Schema(Joigoose.convert(joiEventSchema), {versionKey: false});

module.exports = Mongoose.model('Event', mongooseEventSchema);

