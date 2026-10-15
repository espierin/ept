const {chromium}=require(process.env.EPT_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=process.env.EPT_BASE_URL||'http://127.0.0.1:4173/docs/app/';
const passwords=JSON.parse(process.env.EPT_TEST_PASSWORDS||'{}');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),page=await browser.newPage();
 const passed=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 const check=s=>{passed.push(s);console.log('PASS '+s);};
 try{
  let unlock;const ready=new Promise(resolve=>{unlock=resolve;});
  await page.route('**/auth.mjs',async route=>{await ready;await route.continue();});
  await page.goto(base,{waitUntil:'commit'});await page.locator('#login-user').waitFor();
  assert.equal(await page.locator('#login-form button').isDisabled(),true);
  unlock();await page.waitForFunction(()=>!document.querySelector('#login-form button').disabled);
  await page.unroute('**/auth.mjs');
  check('Login remains disabled until its delayed authentication module is ready');
  await page.locator('#login-user').fill('espierin');
  await page.locator('#login-password').fill(passwords.espierin);
  await page.locator('#login-form button').click();await page.locator('#logout').waitFor();
  await page.locator('#dashboard').selectOption('lab');
  await page.waitForFunction(()=>!document.querySelector('[data-class="II"]').disabled);
  await page.locator('[data-class="II"]').click();
  assert.equal(await page.locator('[data-kind=own]').count(),5);
  assert.ok((await page.locator('#measurement-body').textContent()).includes('HLA-DQA1*02:01~HLA-DQB1*02:01'));
  check('Class II is pre-imported with five molecular targets and paired DQ/DP chains');
  for(const scale of ['linear','log10']){
   await page.locator(`#scale-buttons button[data-value=${scale}]`).click();
   assert.equal(await page.locator('#chart svg').getAttribute('data-min'),'1');
   assert.equal(await page.locator('#chart svg').getAttribute('data-max'),'30000');
  }
  assert.equal(await page.locator('[data-kind=minor-tick]').count(),33);
  for(const value of [10,100,1000,10000]){
   const tick=page.locator(`[data-kind=major-tick][data-value="${value}"]`);
   assert.equal(await tick.evaluate(e=>Number(e.getAttribute('y2'))-Number(e.getAttribute('y1'))),10);
  }
  assert.equal(await page.locator('[data-kind=minor-tick]').first().evaluate(e=>Number(e.getAttribute('y2'))-Number(e.getAttribute('y1'))),6);
  check('Class II axis is fixed to 1 through 30000 in both scale modes');
  await page.locator('[data-class="I"]').click();
  assert.equal(await page.locator('[data-kind=own]').count(),4);
  assert.equal(await page.locator('#measurement-body tr').first().locator('td').nth(1).textContent(),'8002');
  check('Switching classes restores original class I values');
  const csv=fs.readFileSync('app/fixtures/LSA1-test.csv','utf8').replaceAll('8001.5','40000').replaceAll('"63"','"0.5"');
  await page.locator('#files').setInputFiles([
   {name:'range-test.csv',mimeType:'text/csv',buffer:Buffer.from(csv)},
   {name:'3012456_3065421-SA1.eds',mimeType:'application/xml',buffer:fs.readFileSync('app/fixtures/3012456_3065421-SA1.eds')}
  ]);
  await page.waitForFunction(()=>!document.querySelector('#accept-import').disabled);
  await page.locator('#confirm-mapping').check();await page.locator('#accept-import').click();
  assert.equal(await page.locator('[data-kind=own][data-out-of-range=above]').count(),1);
  assert.equal(await page.locator('[data-kind=own][data-out-of-range=below]').count(),1);
  assert.equal(await page.locator('#chart svg').getAttribute('data-max'),'30000');
  for(const scale of ['linear','log10']){
   await page.locator(`#scale-buttons button[data-value=${scale}]`).click();
   const boundary=await page.locator('[data-kind=major-tick][data-value="30000"]').getAttribute('x1');
   assert.equal(await page.locator('[data-kind=own][data-out-of-range=above]').getAttribute('cx'),boundary);
  }
  const event=page.waitForEvent('download');await page.locator('#export-json').click();
  const download=await event,report=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
  assert.deepEqual(report.axisRange,[1,30000]);
  assert.equal(report.rows[0].value,40000);assert.equal(report.rows[1].value,.5);
  check('Out-of-range values retain raw precision and get boundary markers on the fixed axis');
  await page.locator('[data-class="II"]').click();assert.equal(await page.locator('[data-kind=own]').count(),5);
  await page.locator('[data-class="I"]').click();
  assert.equal(await page.locator('#measurement-body tr').first().locator('td').nth(1).textContent(),'40000');
  await page.locator('#logout').click();assert.equal(await page.locator('#class-panel').isVisible(),false);
  assert.equal(await page.locator('#report').isVisible(),false);assert.deepEqual(errors,[]);
  check('Class caches preserve imports on switching and clear on logout without JavaScript errors');
 }finally{
  fs.mkdirSync('.local/classes-check',{recursive:true});
  fs.writeFileSync('.local/classes-check/checks.json',JSON.stringify({base,passed,errors},null,2));
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
