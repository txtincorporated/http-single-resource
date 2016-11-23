const server = require('./lib/http-server');

server.listen(8888, () => {
  console.log('Server has started.');
});