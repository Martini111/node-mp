const express = require('express');
const app = express();
const port = 3050;
const routes = require('./src/router');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(bodyParser.json());
app.use('/', routes);
app.use((err, req, res, next)=>{
    res.status(422).send({
        error: err.message
    })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});