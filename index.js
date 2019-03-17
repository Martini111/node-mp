const express = require('express');
const app = express();
const port = 3050;
const host = '0.0.0.0';
const routes = require('./src/routes').routes;
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongoClient = require('mongodb').MongoClient;

var j2s = require('joi-to-swagger');
const eventsSchema = require('./src/routes/events/schemes/event');
const discoveriesSchema = require('./src/routes/discoveries/schemes/discovery');

app.use(bodyParser.json());
app.use((err, req, res, next)=>{
    res.status(422).send({
        error: err.message
    })
});

mongoClient
    .connect(
        'mongodb://localhost:27017/events-discoveries',
        {useNewUrlParser: true}
    )
    .then((client) => {
        console.log('MongoDB Connected')
        const db = client.db();
        app.use('/', routes(db));
    })
    .catch(err => console.log(err));

const withoutId = (schema) => {
    const {id, ...restProps} = schema.properties;
    return {...schema, properties: restProps};
};

const getDocument = () => {
    const Event = j2s(eventsSchema).swagger;
    const Discovery = j2s(discoveriesSchema).swagger;
    const NewEvent = withoutId(Event);
    const NewDiscovery = withoutId(Discovery);
    const newDocument = {
        ...swaggerDocument,
        definitions: {
            ...swaggerDocument.definitions,
            Event,
            NewEvent,
            Discovery,
            NewDiscovery
        }
    };
    return newDocument;
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(getDocument()));

app.listen(port, host);

console.log(`Listening on port ${port}`);