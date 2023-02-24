const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`Usage: node ${process.argv[1]} <serverHost> <serverPort>`);
  process.exit(1);
}

const serverHost = args[0];
const serverPort = parseInt(args[1], 10);

const messageTypes = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
const logFormats = ['text', 'json', 'xml'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateLogMessage(clientId) {
  const type = messageTypes[randomInt(0, messageTypes.length - 1)];
  const format = logFormats[randomInt(0, logFormats.length - 1)];
  const message = `Test ${type} log message in ${format} format from client ${clientId}`;
  return { type, format, message };
}

//Sends the Log Message
function sendLogMessage(logMessage) {
  const message = Buffer.from(JSON.stringify(logMessage));
  client.send(message, 0, message.length, serverPort, serverHost, (err) => {
    if (err) {
      console.log(`Error sending message to server: ${err}`);
    }
  });
}

function testLogFormats(clientId) {
  console.log(`Client ${clientId} testing log formats...`);
  logFormats.forEach((format) => {
    const logMessage = { type: 'INFO', format, message: `Testing ${format} log format from client ${clientId}` };
    console.log(`Client ${clientId} sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage); //calling log message function
  });
}

function testLogTypes(clientId) {
  console.log(`Client ${clientId} testing log types...`);
  messageTypes.forEach((type) => {
    const logMessage = { type, format: 'text', message: `Testing ${type} log type from client ${clientId}` };
    console.log(`Client ${clientId} sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage);
  });
}

function testAbusePrevention(clientId) {
  console.log(`Client ${clientId} testing abuse prevention...`);
  const numMessages = 10;
  const interval = 500; // in milliseconds
  let count = 0;
  const intervalId = setInterval(() => {
    const logMessage = generateLogMessage(clientId);
    console.log(`Client ${clientId} sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage);
    count++;
    if (count >= numMessages) {
      clearInterval(intervalId);
      console.log(`Client ${clientId} finished sending messages`);
    }
  }, interval);
}

function main() {
  console.log(`Connecting to server at ${serverHost}:${serverPort}`);
  const clientId = randomInt(1, 1000); //Clients can be identified by random number
  console.log(`Client ${clientId} started`);

  testLogFormats(clientId); //Testing log formats
  testLogTypes(clientId); //Testing Log types
  testAbusePrevention(clientId); //testing abuse prevention
}

main();
