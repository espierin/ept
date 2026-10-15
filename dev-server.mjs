import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf','.csv':'text/csv; charset=utf-8','.eds':'application/xml; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8'};
const port=Number(process.env.EPT_PORT||4173);
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1');let pathname=decodeURIComponent(url.pathname);
  if(pathname==='/'){res.writeHead(302,{Location:'/app/'});res.end();return;}
  if(!['/app/','/docs/'].some(p=>pathname.startsWith(p))||pathname.split('/').some(p=>p.startsWith('.'))){res.writeHead(404);res.end();return;}
  let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep))throw Error('path');
  if((await stat(file)).isDirectory())file=path.join(file,'index.html');
  const content=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(content);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`EPT local preview: http://127.0.0.1:${port}/app/`));
