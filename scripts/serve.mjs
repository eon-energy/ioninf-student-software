import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
export const CSP="default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8'};
export function createStaticServer(){
  return createServer(async(req,res)=>{
    res.setHeader('Content-Security-Policy',CSP);res.setHeader('X-Content-Type-Options','nosniff');
    try {
      const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname),filename=path.resolve(root,'.'+name);
      if(!filename.startsWith(root)||!(await stat(filename)).isFile())throw new Error('Not found');
      let body=await readFile(filename);const ext=path.extname(filename);
      res.setHeader('Content-Type',mime[ext]||'application/octet-stream');
      res.setHeader('Cache-Control',/\.[a-f0-9]{12}\.[a-z0-9]+$/.test(filename)?'public, max-age=31536000, immutable':'no-cache');
      if(/gzip/.test(req.headers['accept-encoding']||'')&&['.html','.js','.css','.json','.svg'].includes(ext)){body=gzipSync(body);res.setHeader('Content-Encoding','gzip');res.setHeader('Vary','Accept-Encoding');}
      res.setHeader('Content-Length',body.length);res.writeHead(200);res.end(req.method==='HEAD'?undefined:body);
    }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});res.end('Not found');}
  });
}
if(process.argv[1]===fileURLToPath(import.meta.url))createStaticServer().listen(Number(process.env.PORT||4174),'127.0.0.1',()=>console.log('Serving dist on http://127.0.0.1:'+(process.env.PORT||4174)));
