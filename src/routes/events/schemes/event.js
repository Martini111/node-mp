const Joi = require('joi');

const schema = Joi.object().keys({
    id: Joi.string(),
    event: Joi.string().alphanum().min(3).max(30).required(),
});

module.exports = schema;