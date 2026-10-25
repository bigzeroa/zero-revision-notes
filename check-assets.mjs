import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=new URL('./',import.meta.url);
const html=readFileSync(new URL('dist/index.html',root),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url=match[1];
  if(url==='./'||url.startsWith('#')||/^https?:/.test(url))continue;
  assert(!url.startsWith('/'),'Local assets must remain portable');
  assert(existsSync(new URL('dist/'+url,root)),`Missing local asset: ${url}`);
}
const app=readFileSync(new URL('dist/app.js',root),'utf8');
assert(!/\b(?:fetch|XMLHttpRequest|WebSocket)\b/.test(app),'Note content must not be sent over the network');
assert(!/innerHTML\s*=/.test(app),'Feedback must render as text');
assert(!existsSync(new URL('.openai/hosting.json',root)),'Do not publish private hosting configuration');
assert(!existsSync(new URL('knowledge',root)),'Do not publish private project records');
assert(!existsSync(new URL('products',root)),'Do not publish the separate paid kit');
const files=[];
function walk(dir){for(const item of readdirSync(dir,{withFileTypes:true})){
  if(['.git','node_modules'].includes(item.name))continue;
  const file=path.join(dir,item.name);
  if(item.isDirectory())walk(file);else files.push(file);
}}
walk(fileURLToPath(root));
assert(!files.some(f=>/[/\\](?:\.env|auth\.json|credentials\.json)$/.test(f)),'Credential-like file found');
console.log('Local asset links and public-source boundaries passed.');
