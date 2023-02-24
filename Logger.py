import socket
import time

localIP = "127.0.0.1"
localPort = 8080
bufferSize = 1024

# Rate limit configuration
MAX_MESSAGES_PER_SECOND = 10
LAST_MESSAGE_TIME = time.time()

# Log file configuration
LOG_FILE_PATH = 'C:\\Users\\janis\\Documents\\NAD\\A3\\Code\\log.txt'
LOG_FORMAT = '{timestamp} - {message}'

# Create a datagram socket
UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

# Bind to address and ip
UDPServerSocket.bind((localIP, localPort))

print("UDP server up and listening")

# Listen for incoming datagrams
while True:
    bytesAddressPair = UDPServerSocket.recvfrom(bufferSize)
    message = bytesAddressPair[0]
    address = bytesAddressPair[1]
    
    # Check if rate limit is exceeded
    current_time = time.time()
    elapsed_time = current_time - LAST_MESSAGE_TIME
    if elapsed_time < 1 / MAX_MESSAGES_PER_SECOND:
        continue
    
    LAST_MESSAGE_TIME = current_time
    
    # Format log message
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
    log_message = LOG_FORMAT.format(timestamp=timestamp, message=message.decode())
    
    # Write log message to file
    with open(LOG_FILE_PATH, 'a') as log_file:
        log_file.write(log_message + '\n')
    
    # Sending a reply to client
    UDPServerSocket.sendto(b'OK', address)
