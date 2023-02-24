Logger.py
Logger is a Python script that listens for log messages from a client and writes them to a file. It uses a datagram socket to receive messages, parses them, and writes them to a log file in the specified format.

Usage
To use logger, run the script and pass in the following arguments:

filepath: path to the log file
ip: IP address to bind to
port: port to listen on

For example, to start the logger listening on port 8080 and write logs to logs.txt, run the following command:

python Logger.py logs.txt 127.0.0.1 8080

Configuration
the logger can be configured with the following constants:

MAX_MESSAGES_PER_SECOND: maximum number of log messages to receive per second
MAX_MESSAGES_PER_MINUTE: maximum number of log messages to receive per minute
LOG_FORMAT: format string for log messages

Dependencies
the logger requires Python 3.

Client.js
The Client is a Node.js script that sends log messages to a logger instance listening on the specified IP and port. It generates random log messages and sends them in JSON format.

Usage
To use Client, run the script and pass in the following arguments:

serverHost: IP address of the logger instance
serverPort: port of the logger instance

For example, to send log messages to a logger instance running on 127.0.0.1 port 8080, run the following command:

node client.js 127.0.0.1 8080

Configuration
The Client can be configured with the following constants:

message types: array of log message types
log formats: array of log message formats

Dependencies
The Client requires Node.js.