import socket
import os
import gzip
import threading

def get_content_type(filename):
    if filename.endswith(".html"):
        return "text/html"
    elif filename.endswith(".css"):
        return "text/css"
    elif filename.endswith(".js"):
        return "application/javascript"
    elif filename.endswith(".ico"):
        return "image/x-icon"
    elif filename.endswith(".png"):
        return "image/png"
    elif filename.endswith((".jpg", ".jpeg")):
        return "image/jpeg"
    elif filename.endswith(".gif"):
        return "image/gif"
    else:
        return "text/plain"

def handle_client(clientsocket):
    try:
        cerere = ''
        while True:
            data = clientsocket.recv(1024)
            if not data:
                break  
            cerere += data.decode()
            pozitie = cerere.find('\r\n')
            if pozitie > -1:
                linieDeStart = cerere[:pozitie]
                print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
                break

        nume_resursa = linieDeStart.split()[1][1:] if linieDeStart else 'index.html'
        if nume_resursa == '':
            nume_resursa = 'index.html'
        else:
            if not nume_resursa.endswith("js") and \
               not nume_resursa.endswith("css") and \
               not nume_resursa.endswith("html") and \
               not nume_resursa.endswith("xml") and \
               not nume_resursa.endswith("json"):
                nume_resursa += '.html'

        filepath = os.path.join(base_path, nume_resursa.replace('/', os.sep))
        print(f"NUME RESURSA: {nume_resursa}")
        with open(filepath, 'rb') as f:
            content = f.read()

        should_compress = not any(nume_resursa.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', 'ico'])
        if should_compress:
            content = gzip.compress(content)
            content_encoding = 'Content-Encoding: gzip\n'
        else:
            content_encoding = ''

        content_length = len(content)
        header = f'HTTP/1.1 200 OK\r\nContent-Type: {get_content_type(nume_resursa)}\r\nContent-Length: {content_length}\r\n{content_encoding}\r\n'

    except FileNotFoundError:
        content = gzip.compress(b'<html><body><h1>404 Not Found</h1></body></html>')
        header = f'HTTP/1.1 404 Not Found\r\nContent-Type: text/html\r\nContent-Length: {len(content)}\r\nContent-Encoding: gzip\r\n\r\n'


    response = header.encode() + content
    clientsocket.sendall(response)
    clientsocket.close()

serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
serversocket.bind(('', 5678))
serversocket.listen(5)
base_path = '../continut'

print('Server is listening...')

while True:
    (clientsocket, address) = serversocket.accept()
    client_thread = threading.Thread(target=handle_client, args=(clientsocket,))
    client_thread.start()
