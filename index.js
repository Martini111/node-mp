const http = require('http');
const port = 3050;

const {events, discoveries} = require('./src/data');
const {getLeftJoinById} = require('./src/utils');

const requestListener = (request, response) => {
    const data = getLeftJoinById(events, discoveries);
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(data));
};

const server = http.createServer(requestListener);

server.listen(port, (err) => {
    if (err) {
        return console.error('Something went wrong', err);
    }
    console.log(`server is listening on ${port}`);
});