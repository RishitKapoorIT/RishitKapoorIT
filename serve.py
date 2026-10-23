import http.server
import socketserver
import os

web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'site')
os.chdir(web_dir)

class ThreadingSimpleServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

Handler = http.server.SimpleHTTPRequestHandler

PORT = 8000
print(f"Starting server in {web_dir} on http://127.0.0.1:{PORT}...", flush=True)

with ThreadingSimpleServer(('0.0.0.0', PORT), Handler) as httpd:
    print(f"Server is listening at http://127.0.0.1:{PORT}", flush=True)
    httpd.serve_forever()
