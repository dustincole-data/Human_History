"""The harness's static server. Use this rather than `python -m http.server`.

`python -m http.server` is HTTP/1.0 with a listen backlog of 5, so every one of the tens of
thousands of requests a sweep makes is a fresh TCP connection and a fresh thread. It holds up
until the 2,133-stop walk in `one_at_a_time`, and then the next `fresh()` gets its HTML and
NOTHING ELSE — measured twice, same line both times: the server logged `GET /webgl/index.html
200` and then served zero subresources for thirty seconds, while a cold navigation in isolation
took 4.5s. That is what killed two sweep runs in one session and two more in the next.

Keep-alive collapses a page load from ~250 connections to a handful, and the deeper queue stops
the burst at the head of a load from being dropped at the door.

    python serve.py [port] [--dir PATH]        # defaults: 8812, the directory it is run from
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class Handler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'          # keep-alive; SimpleHTTPRequestHandler already sends
                                           # Content-Length on both files and errors.


class Server(ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 256               # the accept backlog. 5 is the default and it is the bug.
    allow_reuse_address = True


if __name__ == '__main__':
    args = sys.argv[1:]
    directory = '.'
    if '--dir' in args:
        i = args.index('--dir')
        directory = args[i + 1]
        del args[i:i + 2]
    port = int(args[0]) if args else 8812
    with Server(('127.0.0.1', port), partial(Handler, directory=directory)) as httpd:
        print(f'serving {directory} on http://127.0.0.1:{port}', flush=True)
        httpd.serve_forever()
