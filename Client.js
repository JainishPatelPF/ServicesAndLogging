const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const log = (message, level = 'info') => {
  const logObject = {
    message,
    level,
    timestamp: Date.now(),
  };
  const logString = JSON.stringify(logObject);
  client.send(logString, 0, logString.length, 8080, '127.0.0.1', (err) => {
    if (err) throw err;
  });
};

// Send some example log messages
log('This is an info log message');
log('This is a warning log message', 'warning');
log('This is an error log message', 'error');
