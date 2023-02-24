const dgram = require('dgram');
const client = dgram.createSocket('udp4');

const serverPort = 8080;
const serverHost = '127.0.0.1';

const messageTypes = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
const logFormats = ['text', 'json', 'xml'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateLogMessage() {
  const type = messageTypes[randomInt(0, messageTypes.length - 1)];
  const format = logFormats[randomInt(0, logFormats.length - 1)];
  const message = `Test ${type} log message in ${format} format`;
  return { type, format, message };
}

function sendLogMessage(logMessage) {
  const message = Buffer.from(JSON.stringify(logMessage));
  client.send(message, 0, message.length, serverPort, serverHost, (err) => {
    if (err) {
      console.log(`Error sending message to server: ${err}`);
    }
  });
}

function testLogFormats() {
  console.log('Testing log formats...');
  logFormats.forEach((format) => {
    const logMessage = { type: 'INFO', format, message: `Testing ${format} log format` };
    console.log(`Sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage);
  });
}

function testLogTypes() {
  console.log('Testing log types...');
  messageTypes.forEach((type) => {
    const logMessage = { type, format: 'text', message: `Testing ${type} log type` };
    console.log(`Sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage);
  });
}

function testAbusePrevention() {
  console.log('Testing abuse prevention...');
  const numMessages = 10;
  const interval = 500; // in milliseconds
  let count = 0;
  const intervalId = setInterval(() => {
    const logMessage = generateLogMessage();
    console.log(`Sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage);
    count++;
    if (count >= numMessages) {
      clearInterval(intervalId);
      console.log('Finished sending messages');
    }
  }, interval);
}

testLogFormats();
testLogTypes();
testAbusePrevention();
