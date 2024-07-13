import http.server
import socketserver
import json

PORT = 5800

# Dicionário para armazenar dispositivos conectados
dispositivos_conectados = {}

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/dispositivos_conectados':
            # Define o cabeçalho de resposta como JSON
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Converte o dicionário de dispositivos para JSON e envia
            self.wfile.write(json.dumps(dispositivos_conectados).encode())
        else:
            # Chama o método pai para processar a solicitação normalmente
            super().do_GET()

# Inicia o servidor com o novo manipulador de solicitação personalizado

try:
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("Servidor web rodando na porta", PORT)
        httpd.serve_forever()
except Exception as e:
    print("Ocorreu um erro:", e)
