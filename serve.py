"""开发服务器：带 no-cache 头的静态文件服务（避免浏览器缓存导致改了不生效）"""
import http.server
import socketserver

PORT = 8123


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


with socketserver.ThreadingTCPServer(("127.0.0.1", PORT), NoCacheHandler) as httpd:
    print(f"serving at http://127.0.0.1:{PORT} (no-cache)")
    httpd.serve_forever()
