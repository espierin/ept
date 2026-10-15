// Tests the actual published package through normal UI and downloads, without diagnostics.
const {chromium}=require(process.env.EPT_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
const base=new URL(process.env.EPT_BASE_URL||'https://espierin.github.io/ept/');
const appUrl=new URL('app/',base).href;
const local=base.hostname==='127.0.0.1'||base.hostname==='localhost';
const out=path.join(root,'.local',local?'published-package-check':'online-check');
fs.mkdirSync(out,{recursive:true});
const fixture=n=>path.join(root,'app/fixtures',n);
const passed=[],failures=[],pageErrors=[],httpErrors=[],writes=[];
function check(name){passed.push(name);console.log('PASS '+name);}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.setDefaultTimeout(25000);page.setDefaultNavigationTimeout(45000);
 page.on('pageerror',e=>pageErrors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)httpErrors.push({status:r.status(),url:r.url()});});
 page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))writes.push({method:r.method(),url:r.url()});});
 async function downloaded(selector,name){const event=page.waitForEvent('download');await page.locator(selector).click();const d=await event;const target=path.join(out,name);await d.saveAs(target);return target;}
 async function snapshot(){return JSON.parse(fs.readFileSync(await downloaded('#export-json','report.json'),'utf8'));}
 await page.goto(base.href);await page.waitForSelector('#chart [data-kind="own"]');
 assert.equal(new URL(page.url()).pathname,new URL(appUrl).pathname);
 assert.equal(await page.evaluate(()=>typeof window.eptDiagnostics),'undefined');
 check('Public entry opens the browser prototype; local diagnostic hook is absent');
 const first=await snapshot();
 assert.equal(first.mfiScale,'log10');assert.equal(first.rows.length,4);
 assert.deepEqual(first.rows.map(x=>x.value),[8001.5,63,127,501]);
 assert.equal(await page.locator('[data-kind="violin"]').count(),0);
 assert.equal(await page.locator('[data-kind="peer"]').count(),0);
 assert.equal(await page.locator('#peer-points').isChecked(),false);
 check('Initial xPONENT class I values and PL Strings render on log10; peer context stays closed');
 const provenance=await (await page.request.get(new URL('app/fixtures/provenance.json',base).href)).json();
 for(const fixtureInfo of provenance.fixtures){
  const response=await page.request.get(new URL('app/fixtures/'+fixtureInfo.file,base).href);
  assert.equal(response.status(),200);
  assert.equal(crypto.createHash('sha256').update(await response.body()).digest('hex'),fixtureInfo.sha256);
 }
 const publication=await (await page.request.get(new URL('publication-manifest.json',base).href)).json();
 for(const name of ['app/app.mjs','app/core.mjs','app/assets/app.css']){
  const response=await page.request.get(new URL(name,base).href);
  assert.equal(crypto.createHash('sha256').update(await response.body()).digest('hex'),publication.files[name]);
 }
 check('Published mock files and application assets exactly match their SHA-256 manifests');
 assert.equal(await page.locator('#tech-label').textContent(),'Techniek');
 await page.locator('#scale-buttons button[data-value="linear"]').click();
 await page.locator('#language').click();
 assert.equal(await page.locator('#tech-label').textContent(),'Technique');
 assert.equal(await page.locator('#chart svg').getAttribute('data-scale'),'linear');
 await page.locator('#language').click();await page.locator('#scale-buttons button[data-value="log10"]').click();
 check('NL/EN labels switch correctly while retaining the explicit MFI scale');
 const a=await page.locator('#technique-buttons button').first().boundingBox();
 const b=await page.locator('#locus-buttons button').first().boundingBox();assert.equal(a.x,b.x);
 await page.locator('#import').scrollIntoViewIfNeeded();
 assert.equal(await page.locator('.topbar').evaluate(e=>Math.round(e.getBoundingClientRect().top)),0);
 check('Technique/Locus alignment and sticky navigation work online');
 await page.locator('#files').setInputFiles([fixture('LSA2-test.csv'),fixture('3062145_3045216-SA2.eds')]);
 await page.waitForFunction(()=>!document.querySelector('#accept-import').disabled);
 await page.locator('#confirm-mapping').check();await page.locator('#accept-import').click();
 await page.waitForFunction(()=>document.querySelector('#measurement-body').textContent.includes('HLA-DQA1*02:01~HLA-DQB1*02:01'));
 const second=await snapshot();
 assert.equal(second.hlaClass,'II');assert.equal(second.rows.length,5);
 assert.equal(second.source.csv.sha256,crypto.createHash('sha256').update(fs.readFileSync(fixture('LSA2-test.csv'))).digest('hex'));
 assert.equal(await page.locator('#locus-buttons button:disabled').count(),3);
 check('Online file picker validates class II CSV/EDS, source hash and complete DQ/DP mapping');
 await page.locator('#files').setInputFiles([fixture('LSA1-test.csv'),fixture('3062145_3045216-SA2.eds')]);
 await page.waitForFunction(()=>document.querySelector('#import-status').textContent.includes('lot_mismatch'));
 assert.equal(await page.locator('#accept-import').isDisabled(),true);
 assert.equal((await snapshot()).hlaClass,'II');
 check('Incorrect EDS lot is blocked and the existing report is retained');
 await page.locator('#dashboard').selectOption('provider');
 assert.equal(await page.locator('#lab-dashboard').isVisible(),false);
 assert.equal(await page.locator('#provider-dashboard').isVisible(),true);
 check('Provider dashboard is separate from laboratory report and import');
 const templatePath=await downloaded('#consensus-template','consensus.json');
 const template=JSON.parse(fs.readFileSync(templatePath,'utf8'));
 assert.equal(template.kind,'synthetic-provider-consensus');
 const wrong={...template,context:{...template.context,provider:'UNRELATED-DEMO-PROVIDER'}};
 await page.locator('#consensus-file').setInputFiles({name:'wrong-context.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(wrong))});
 await page.waitForFunction(()=>document.querySelector('#consensus-status').textContent.includes('consensus_context'));
 assert.equal(await page.locator('[data-kind="violin"]').count(),0);
 await page.locator('#consensus-file').setInputFiles(templatePath);
 await page.waitForFunction(()=>document.querySelector('#consensus-status').textContent.includes(document.documentElement.lang==='nl'?'gevalideerd':'validated'));
 await page.locator('#dashboard').selectOption('lab');
 await page.waitForSelector('[data-kind="violin"]');
 assert.equal(await page.locator('[data-kind="violin"]').count(),5);
 assert.equal(await page.locator('[data-kind="peer"]').count(),90);
 const released=await snapshot();
 assert.ok(released.rows.every(r=>r.stats.nLabs===18&&r.peerPoints.every(p=>Object.keys(p).sort().join(',')==='value,vendor')));
 check('Scoped consensus simulation unlocks synthetic peers only; wrong-provider release is refused');
 await page.locator('#peer-points').uncheck();
 assert.equal(await page.locator('[data-kind="peer"]').count(),0);
 assert.equal(await page.locator('[data-kind="violin"]').count(),5);
 await page.locator('#peer-points').check();
 await page.locator('#view-buttons button[data-value="separate"]').click();
 assert.equal((await snapshot()).mode,'separate');
 assert.equal(await page.locator('[data-kind="violin"]').count(),5);
 await page.locator('#view-buttons button[data-value="merge"]').click();
 check('Peer visibility and Merge/Separate work; the single-vendor distribution remains consistent');
 for(const locus of ['DRB1','DRB3-4-5','DP'])await page.locator(`#locus-buttons button[data-value="${locus}"]`).click();
 assert.equal(await page.locator('#measurement-body tr').count(),2);
 assert.ok((await snapshot()).rows.every(r=>r.plString.includes('DQA1')));
 await page.locator('#technique-buttons button[data-value="SAB_C1Q"]').click();
 assert.equal(await page.locator('#chart svg').count(),0);
 await page.locator('#technique-buttons button[data-value="SAB_IGG"]').click();
 check('Locus filters affect chart/table together and unmeasured techniques remain separate');
 const csv=fs.readFileSync(await downloaded('#export-csv','results.csv'),'utf8');
 assert.ok(csv.includes('HLA-DQA1*02:01~HLA-DQB1*02:01'));
 const svg=fs.readFileSync(await downloaded('#export-svg','report.svg'),'utf8');
 assert.ok(svg.includes('<svg'));assert.ok(svg.includes('data:font/ttf;base64,'));
 assert.ok(!svg.includes('<image'));assert.ok(!svg.includes('synthetic-1'));
 check('Online CSV, JSON and vector SVG exports work, including embedded font and metadata');
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});
 await page.locator('#dashboard').selectOption('provider');
 await page.locator('#revoke').click();
 await page.locator('#dashboard').selectOption('lab');
 assert.equal(await page.locator('[data-kind="violin"]').count(),0);
 assert.equal(await page.locator('[data-kind="peer"]').count(),0);
 check('Withdrawing demo consensus removes peer context online');
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
 check('Mobile layouts at 320px and 390px avoid page overflow');
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('#style-link').click();
 assert.equal(new URL(page.url()).pathname,new URL('style_NL.html',base).pathname);
 await page.locator('.ept-specimen').waitFor();
 assert.equal(await page.locator('.ept-specimen strong').first().textContent(),'Techniek');
 await page.goto(new URL('efi-style_NL.html',base).href);
 assert.equal(await page.locator('.colour-card').count(),8);
 await page.locator('.language-switch').click();
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 check('App links open the correct public style guides and their language switches');
 await page.goto(appUrl+'?dashboard=provider');
 await page.waitForFunction(()=>document.querySelector('#provider-context').textContent.includes('DEMO-PROVIDER'));
 assert.equal(await page.locator('#provider-dashboard').isVisible(),true);
 assert.equal(await page.locator('#report').isVisible(),false);
 assert.equal(await page.locator('#import').isVisible(),false);
 assert.equal(await page.locator('#consensus-template').isEnabled(),true);
 assert.ok((await page.locator('#page-title').textContent()).includes('Jouw'));
 await page.screenshot({path:path.join(out,'provider.png'),fullPage:true});
 await page.locator('#language').click();
 assert.equal(await page.locator('#dashboard').inputValue(),'provider');
 assert.equal(await page.locator('#provider-dashboard').isVisible(),true);
 for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.locator('#dashboard').selectOption('lab');
 assert.equal(await page.locator('#provider-dashboard').isVisible(),false);
 assert.equal(await page.locator('#report').isVisible(),true);
 check('Direct provider link, language switching and mobile navigation preserve dashboard separation');
 assert.deepEqual(pageErrors,[]);assert.deepEqual(httpErrors,[]);assert.deepEqual(writes,[]);
 check('No JavaScript errors, failed HTTP resources or network write requests during the online workflow');
 }catch(error){failures.push(error.stack||String(error));throw error;}
 finally{
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({baseUrl:base.href,checkedAt:new Date().toISOString(),passed:passed.length,checks:passed,failures,pageErrors,httpErrors,networkWrites:writes},null,2));
  await browser.close();
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
