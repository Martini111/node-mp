const fs = require('fs');
const {events, discoveries} = require('./data');
const {getLeftJoinById} = require('./utils');
const data = getLeftJoinById(events, discoveries);

const sendData = (res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
};

const sendImage = (res) => {
    const imagePath = `${__dirname}/assets/img/map.jpg`;

    const imgStream = fs.createReadStream(imagePath);
    imgStream.pipe(res);
    res.on('close', () => imgStream.destroy());
};

module.exports = (req, res) => {
    switch(req.url) {
    case '/image':
        sendImage(res);
        break;
    default:
        sendData(res);
        break;
    }
};