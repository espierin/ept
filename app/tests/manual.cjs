const {chromium}=require(process.env.EPT_PLAYWRIGHT_PATH||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=new URL(process.env.EPT_BASE_URL||'http://127.0.0.1:4173/docs/');
const passwords=JSON.parse(process.env.EPT_TEST_PASSWORDS||'{}');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const passed=[],errors=[],httpErrors=[];
 const check=s=>{passed.push(s);console.log('PASS '+s);};
 fs.mkdirSync('.local/manual-check',{recursive:true});
 try{
  for(const lang of ['nl','en']){
   const context=await browser.newContext({viewport:{width:1440,height:1000}});
   context.on('page',page=>{
    page.on('pageerror',e=>errors.push(e.message));
    page.on('response',r=>{if(r.status()>=400)httpErrors.push(r.url());});
   });
   const manual=await context.newPage();
   await manual.goto(new URL(`manual_${lang.toUpperCase()}.html`,base).href);
   assert.equal(await manual.locator('html').getAttribute('lang'),lang);
   assert.ok((await manual.locator('main h2').first().textContent()).startsWith('Quick start'));
   assert.equal(await manual.locator('main h2').count(),13);
   const body=await manual.locator('main').textContent();
   assert.ok(body.includes('provider_1')&&body.includes('SAB-2026-DEMO')&&body.includes('Werfen / Immucor'));
   assert.ok(!body.includes(passwords.espierin));
   await manual.locator('.language-switch').click();
   assert.equal(await manual.locator('html').getAttribute('lang'),lang==='nl'?'en':'nl');
   await manual.locator('.language-switch').click();
   for(const width of [1440,768,390,320]){
    await manual.setViewportSize({width,height:1000});
    assert.ok(await manual.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   }
   await manual.evaluate(()=>window.scrollTo(0,3000));
   assert.equal(await manual.locator('.top').evaluate(e=>Math.round(e.getBoundingClientRect().top)),0);
   await manual.setViewportSize({width:1440,height:1000});
   await manual.evaluate(()=>window.scrollTo(0,0));
   await manual.screenshot({path:`.local/manual-check/manual-top-${lang}.png`});
   await manual.screenshot({path:`.local/manual-check/manual-${lang}.png`,fullPage:true});
   check(`${lang}: manual structure, language switch, sticky navigation and four reading widths`);
   const participant=await context.newPage();await participant.goto(new URL('app/',base).href);
   if(lang==='en')await participant.locator('#language').click();
   assert.equal(await participant.locator('#manual-link').getAttribute('target'),'_blank');
   assert.ok((await participant.locator('#manual-link').getAttribute('href')).endsWith(`manual_${lang.toUpperCase()}.html`));
   await participant.locator('#login-user').fill('participant_1');
   await participant.locator('#login-password').fill(passwords.participant_1);
   await participant.locator('#login-form button').click();await participant.locator('#logout').waitFor();
   await participant.locator('#profile-link').click();
   await participant.locator('#profile-email').fill('participant@example.org');
   await participant.locator('#profile-form button').click();
   await participant.waitForFunction(()=>document.querySelector('#profile-status').textContent.includes(document.documentElement.lang==='nl'?'Opgeslagen':'Saved'));
   await participant.locator('#membership-scheme').fill('SAB-2026-DEMO');
   await participant.locator('[name=membership-vendor][value=werfen]').check();
   await participant.locator('#membership-form button').click();
   assert.ok((await participant.locator('#membership-list').textContent()).includes('Werfen / Immucor'));
   check(`${lang}: quick start saves optional email and required provider/scheme/vendor enrollment`);
   await participant.locator('#demo-i').click();
   await participant.waitForFunction(()=>!document.querySelector('#accept-import').disabled);
   for(const [field,value]of Object.entries({provider:'provider_1',schemeEdition:'SAB-2026-DEMO',round:'ROUND-02',sample:'DEMO-01'}))
    assert.equal(await participant.locator('#ctx-'+field).inputValue(),value);
   assert.equal(await participant.locator('#import-technique').inputValue(),'SAB_IGG');
   assert.ok((await participant.locator('#preview-sample option:checked').textContent()).includes('S001 · 33(1,A5)'));
   await participant.locator('#confirm-mapping').check();await participant.locator('#accept-import').click();
   await participant.locator('#report').waitFor();
   assert.equal(await participant.locator('[data-kind=own]').count(),4);
   assert.equal(await participant.locator('#measurement-body tr').first().locator('td').nth(1).textContent(),'8002');
   assert.equal(await participant.locator('[data-kind=violin]').count(),0);
   await participant.waitForFunction(()=>!document.querySelector('[data-class="II"]').disabled);
   await participant.locator('[data-class="II"]').click();
   assert.equal(await participant.locator('[data-kind=own]').count(),5);
   await participant.locator('[data-class="I"]').click();
   check(`${lang}: documented default fields and confirmation produce both expected class reports`);
   const popup=participant.waitForEvent('popup');await participant.locator('#manual-link').click();
   const help=await popup;await help.waitForLoadState();
   assert.equal(await help.locator('html').getAttribute('lang'),lang);await help.close();
   assert.equal(await participant.locator('[data-kind=own]').count(),4);
   check(`${lang}: opening the manual preserves the active report in its original tab`);
   const provider=await context.newPage();await provider.goto(new URL('app/',base).href);
   if(lang==='en')await provider.locator('#language').click();
   await provider.locator('#login-user').fill('provider_1');
   await provider.locator('#login-password').fill(passwords.provider_1);
   await provider.locator('#login-form button').click();await provider.locator('#logout').waitFor();
   await provider.waitForFunction(()=>!document.querySelector('#consensus-template').disabled);
   for(const [hlaClass,targets]of [['I',4],['II',5]]){
    if(hlaClass==='II'){
     await provider.waitForFunction(()=>!document.querySelector('[data-class="II"]').disabled);
     await provider.locator('[data-class="II"]').click();
     await participant.locator('[data-class="II"]').click();
     assert.equal(await participant.locator('[data-kind=violin]').count(),0);
    }
    const event=provider.waitForEvent('download');await provider.locator('#consensus-template').click();
    const download=await event;
    await provider.locator('#consensus-file').setInputFiles(await download.path());
    await participant.locator('[data-kind=violin]').first().waitFor();
    assert.equal(await participant.locator('[data-kind=violin]').count(),targets);
    assert.equal(await participant.locator('[data-kind=peer]').count(),targets*18);
    const calls=await participant.locator('#measurement-body tr td:nth-child(3)').allTextContents();
    assert.ok(calls.every(call=>call===(lang==='nl'?'Niet beoordeeld':'Not assessed')));
   }
   check(`${lang}: unchanged downloaded provider examples release each class separately across tabs`);
   await provider.locator('#revoke').click();
   await participant.waitForFunction(()=>document.querySelectorAll('[data-kind=violin]').length===0);
   assert.equal(await participant.locator('[data-kind=own]').count(),5);
   check(`${lang}: documented withdrawal removes peers while preserving own class II values`);
   await context.close();
  }
  assert.deepEqual(errors,[]);assert.deepEqual(httpErrors,[]);
  check('Both language quick starts run without JavaScript errors or failed HTTP resources');
 }finally{
  fs.writeFileSync('.local/manual-check/checks.json',JSON.stringify({base:base.href,passed,errors,httpErrors},null,2));
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
