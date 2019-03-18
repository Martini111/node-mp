const Joi = require('joi');

const schema = Joi.object().keys({
    id: Joi.string(),
    city: Joi.string().alphanum().min(3).max(30).required(),
    venue: Joi.string().alphanum().min(3).max(30).required()
});

module.exports = schema;