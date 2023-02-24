import socket
import time

localIP = "127.0.0.1"
localPort = 8080
bufferSize = 1024

# Rate limit configuration
MAX_MESSAGES_PER_SECOND = 10
MAX_MESSAGES_PER_MINUTE = 100

# Logging format configuration
LOG_FORMAT = "{timestamp} {level} {message}\n"

# Create a datagram socket
UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

# Bind to address and ip
UDPServerSocket.bind((localIP, localPort))

print("UDP server up and listening")

# Initialize message counters for rate limiting
second_counter = 0
minute_counter = 0

while True:
    bytesAddressPair = UDPServerSocket.recvfrom(bufferSize)
    message = bytesAddressPair[0]
    address = bytesAddressPair[1]
    
    # Rate limit the logging messages
    if second_counter >= MAX_MESSAGES_PER_SECOND or minute_counter >= MAX_MESSAGES_PER_MINUTE:
        print("Rate limit exceeded. Ignoring message.")
        continue
    
    # Get the current timestamp and format it
    timestamp = int(time.time())
    timestamp_str = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(timestamp))
    
    # Parse the message and format it
    message_str = message.decode("utf-8")
    level = message_str.split(":")[0]
    message_text = message_str.split(":")[1].strip()
    log_message = LOG_FORMAT.format(timestamp=timestamp_str, level=level, message=message_text)
    
    # Write the log message to the file
    with open("logs.txt", "a") as f:
        f.write(log_message)
    
    # Increment the message counters
    second_counter += 1
    minute_counter += 1
    
    # Reset the message counters every second and every minute
    if second_counter >= MAX_MESSAGES_PER_SECOND:
        second_counter = 0
    if minute_counter >= MAX_MESSAGES_PER_MINUTE:
        minute_counter = 0
        
    # Sending a reply to client
    UDPServerSocket.sendto(b"OK", address)