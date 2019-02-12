const http = require('http');
const port = 3050;

const router = require('./src/router');

const requestListener = (request, response) => {
    router(request, response);
};

const server = http.createServer(requestListener);

server.listen(port, (err) => {
    if (err) {
        return console.error('Something went wrong', err);
    }
    console.log(`server is listening on ${port}`);
});