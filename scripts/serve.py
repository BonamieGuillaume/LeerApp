"""Serve the built app on one stable local origin, without installing packages."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
from pathlib import Path
from threading import Timer
import webbrowser, sys
ROOT=Path(__file__).resolve().parents[1]
if not (ROOT/'dist/index.html').exists():
 raise SystemExit('De gebouwde app ontbreekt. Maak eerst een build met pnpm build.')
class Handler(SimpleHTTPRequestHandler):
 def end_headers(self):
  self.send_header('Cache-Control','no-cache')
  self.send_header('X-Leeratelier','verzekeringen')
  super().end_headers()
try:
 server=ThreadingHTTPServer(('127.0.0.1',5173),partial(Handler,directory=str(ROOT/'dist')))
except OSError as error:
 raise SystemExit('Poort 5173 is al in gebruik. Sluit een eerder gestart Leeratelier-venster en probeer opnieuw. '+str(error))
print('\nLeeratelier is gestart: http://127.0.0.1:5173/\nLaat dit venster open. Stoppen: Ctrl+C.\n',flush=True)
if '--no-open' not in sys.argv:
 Timer(0.7,lambda:webbrowser.open('http://127.0.0.1:5173/')).start()
try: server.serve_forever()
except KeyboardInterrupt: pass
finally: server.server_close()
