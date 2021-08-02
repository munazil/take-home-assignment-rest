const http = require('http');
const app = require('./app');

const port = process.env.PORT || null;

const server = http.createServer(app);

server.listen(port);

