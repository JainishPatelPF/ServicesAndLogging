//FILE: Client.js
//PROJECT : A03
//PROGRAMMER(S) : Jainish Patel
//FIRST VERSION : 2023 - 02 - 24
//DESCRIPTION : A test client which sends logs to a logger on desired IP and Port. 

const dgram = require('dgram'); //datagram sockets
const client = dgram.createSocket('udp4');
const args = process.argv.slice(2);

//if arguments less than 0 then Help usage.
if (args.length < 2) {
  console.log(`Usage: node ${process.argv[1]} <serverHost> <serverPort>`);
  process.exit(1);
}

//getting first argument as hostIP.
const serverHost = args[0];
//getting second argument as port.
const serverPort = parseInt(args[1], 10);

//types of messages defined in a constant.
const messageTypes = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
//Log formats defined in a constant.
const logFormats = ['text', 'json', 'xml'];

//Function Name: randomInt()
//Parameters: min, max
//Description: gets a min number and a maximum number and returns a RANDOM number from it.
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Function Name: generateLogMessage()
//Parameters: clientId
//Description: generates a random log message.
function generateLogMessage(clientId) {
  const type = messageTypes[randomInt(0, messageTypes.length - 1)];
  const format = logFormats[randomInt(0, logFormats.length - 1)];
  const message = `Test ${type} log message in ${format} format from client ${clientId}`;
  return { type, format, message };
}

//Function Name: sendLogMessage()
//Parameters: logMessage
//Description: Sends the Log Message to server.
function sendLogMessage(logMessage) {
  const message = Buffer.from(JSON.stringify(logMessage));
  client.send(message, 0, message.length, serverPort, serverHost, (err) => {
    if (err) {
      console.log(`Error sending message to server: ${err}`);
    }
  });
}

//Function Name: testLogFormats()
//Parameters: clientId
//Description: this function is used to test the logFormats.
function testLogFormats(clientId) {
  console.log(`Client ${clientId} testing log formats...`);
  logFormats.forEach((format) => {
    const logMessage = { type: 'INFO', format, message: `Testing ${format} log format from client ${clientId}` };
    console.log(`Client ${clientId} sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage); //calling log message function
  });
}

//Function Name: testLogTypes()
//Parameters: clientId
//Description: this function is used to test Log Types.
function testLogTypes(clientId) {
  console.log(`Client ${clientId} testing log types...`);
  messageTypes.forEach((type) => {
    const logMessage = { type, format: 'text', message: `Testing ${type} log type from client ${clientId}` };
    console.log(`Client ${clientId} sending ${JSON.stringify(logMessage)}`);
    sendLogMessage(logMessage);
  });
}

//Function Name: testAbusePrevention()
//Parameters: clientId
//Description: this function is used to test Abuse prevention(i.e, rate limiting).
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

//Function Name: main()
//Parameters: None
//Description: This is the main function in which it connects to the server and gets a random client number
// As well as it tests the Log formats, log Types ang Abuse Prevention.
function main() {
  console.log(`Connecting to server at ${serverHost}:${serverPort}`);
  const clientId = randomInt(1, 1000); //Clients can be identified by random number
  console.log(`Client ${clientId} started`);

  testLogFormats(clientId); //Testing log formats
  testLogTypes(clientId); //Testing Log types
  testAbusePrevention(clientId); //testing abuse prevention
}

//main function is called.
main();
