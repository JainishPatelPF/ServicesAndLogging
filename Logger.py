# FILE: Logger.py
# PROJECT : A03
# PROGRAMMER(S) : Jainish Patel
# FIRST VERSION : 2023 - 02 - 24
# DESCRIPTION : A Logger written in python which gets the logs from test client and puts it in a text file. 

import socket
import time
import argparse

# Rate limit configuration
MAX_MESSAGES_PER_SECOND = 10
MAX_MESSAGES_PER_MINUTE = 100

# Logging format configuration
LOG_FORMAT = "{timestamp} {level} {client_address} {message}\n"

def main(filepath, ip, port):
    bufferSize = 1024
    
    # Create a datagram socket
    UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    
    # Bind to address and ip
    UDPServerSocket.bind((ip, port))
    
    print("UDP server up and listening")
    
    # Initialize message counters for rate limiting
    second_counter = 0
    minute_counter = 0
    
    while True:
        bytesAddressPair = UDPServerSocket.recvfrom(bufferSize)
        message = bytesAddressPair[0]
        client_address = bytesAddressPair[1]
        
        # Rate limit the logging messages
        if second_counter >= MAX_MESSAGES_PER_SECOND or minute_counter >= MAX_MESSAGES_PER_MINUTE:
            print("Rate limit exceeded. Ignoring message.")
            continue
        
        # Get the current timestamp and format it
        timestamp = int(time.time())
        timestamp_str = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(timestamp))
        
        # Parse the message and format it
        message_str = message.decode("utf-8")
        level, message_text = message_str.split(":", maxsplit=1)
        level = level.strip()
        message_text = message_text.strip()
        log_message = LOG_FORMAT.format(timestamp=timestamp_str, level=level, client_address=client_address, message=message_text)
        
        # Write the log message to the file
        with open(filepath, "a") as f:
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
        UDPServerSocket.sendto(b"OK", client_address)


if __name__ == "__main__":
    # Getting Arguments from the command line Arguments
    parser = argparse.ArgumentParser(description="UDP Logging Server")
    parser.add_argument("filepath", help="path to the log file")
    parser.add_argument("ip", help="IP address to bind to")
    parser.add_argument("port", type=int, help="port to listen on")
    args = parser.parse_args()
    
    main(args.filepath, args.ip, args.port) # Calls the main function with recieved arguments passed
