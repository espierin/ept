import {VERSION,LOCI,TECHNIQUES,VENDORS,ImportError,parseXponent,parseEds,combineImport,validateContext,validateConsensus,selectReference,referenceStats,chartPoints,violin,mfiDomain,buildSyntheticPeers,toCsv,sha256} from './core.mjs';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const dict={
 nl:{report:'Rapport',import:'Import',concept:'Concept',local:'Lokale werkruimte',prototype:'Lokaal onderzoeksprototype',localNotice:'Bestanden blijven in deze browser. Geen centrale upload of echte providerautorisatie.',title:'Je resultaten, in context',laboratory:'LABORATORIUMRAPPORT',distribution:'Specificiteitsverdelingen',sourceSample:'Bronmeting',quantity:'Meetsectie',peerPoints:'Individuele peerwaarden',measurements:'Meetwaarden en consensus',tableCaption:'Meetwaarden voor de geselecteerde loci',quality:'Kwaliteit, controlebeads en herkomst',clear:'Wis sessie',importTitle:'Importeer een xPONENT-run',importIntro:'Kies het CSV-bestand en het bijbehorende EDS-lotbestand. Bekijk de validatie en bevestig daarna de samplekoppeling. De originele waarden blijven behouden.',drop:'Sleep CSV en EDS hierheen',orChoose:'of kies bestanden · maximaal 20 MB per CSV en 5 MB per EDS',publicExamples:'Publieke mockvoorbeelden:',sourcesNote:' · Geen gegevens van deelnemende labs.',mapping:'Bevestig de EPT-context',scheme:'Schema / editie',round:'Ronde',techConfirm:'Techniek volgens het uitgevoerde protocol',noInference:'De techniek wordt niet afgeleid uit de beadset. C1q/C3d-import is nog niet met echte bestanden gevalideerd.',mapSource:'Te koppelen bronmeting',confirm:'Ik bevestig techniek, lot en de koppeling van deze bronmeting aan dit EPT-sample.',accept:'Import bevestigen',simulation:'UITSLUITEND LOKALE SIMULATIE',providerTitle:'Consensus en vrijgave testen',providerIntro:'Dit simuleert de latere providerroute en verleent geen echte rechten. Download het voorbeeld voor de huidige context en laad het JSON-bestand terug. Peerwaarden worden uitsluitend synthetisch aangemaakt, nooit uit andere wells als labs afgeleid.',template:'Download consensusvoorbeeld',loadConsensus:'Laad consensus-JSON',revoke:'Trek demovrijgave in',footer:'Aanvullende onderzoeksanalyse · geen officiële EPT-beoordeling · gegevens worden niet opgeslagen na vernieuwen.',style:'EFI-stijlgids',awaiting:'Alleen eigen data · consensus ontbreekt',released:'Democonsensus geladen',own:'Eigen lab',peers:'Andere labs · synthetisch',noData:'Geen metingen voor deze selectie.',noTechnique:'Deze techniek is niet gemeten in de huidige import.',noLoci:'Selecteer minimaal één locus.',locked:'Groepscontext vergrendeld. Eigen data zijn zichtbaar. Laad het consensusvoorbeeld om de synthetische peerweergave te testen.',demoReleased:'Synthetische peercontext actief. Deze gegenereerde waarden zijn geen waarnemingen van andere laboratoria.',rows:'rijen',pl:'PL String / beadsamenstelling',mfi:'Eigen MFI',call:'Providerconsensus',nLabs:'Peerlabs',nMeasures:'Peermetingen',excluded:'Niet op log-as',notAssessed:'Niet beoordeeld',positive:'Positief',negative:'Negatief',no_consensus:'Geen consensus',not_assessed:'Niet beoordeeld',noOwn:'Geen eigen brondata',targets:'Moleculaire meetdoelen',controls:'Controlebeads',class:'Klasse',lot:'Lot',localSource:'Publieke xPONENT-mock',userSource:'Lokaal gekozen bestand',previewReady:'Preview gereed. Bevestig de bronmeting, techniek en EPT-context.',accepted:'Import bevestigd; consensuscontext opnieuw vergrendeld.',waitingFiles:'Kies één CSV- en één EDS-bestand voor dezelfde lotrun.',error:'Import niet geaccepteerd',previous:'Het vorige rapport blijft ongewijzigd.',noReference:'Geen geldige positieve peerwaarden.',log:'MFI (logaritmische schaal)',linear:'MFI (lineaire schaal)',ownOnly:'Eigen resultaten; geen peercontext geladen.',refs:'Peerdata exclusief eigen lab; één vendor beschikbaar. Merge en Separate gebruiken dezelfde Werfen-metingen.',synthetic:'SYNTHETISCHE REFERENTIE',ready:'Bevestigd',needsImport:'Importeer eerst een run.',consensusOk:'Democonsensus gevalideerd voor deze context. Synthetische referentie aangemaakt.',revoked:'Demovrijgave ingetrokken; peerdata verwijderd.',ambiguous:'Meerdere beaddefinities voor dezelfde PL String: geen automatische samenvoeging.',nonPositive:'nul / negatief / ontbrekend / ongeldig',noteCounts:'Aantal unieke synthetische labs; herhalingen tellen niet opnieuw.',importing:'Bestanden lokaal valideren…',releasedDate:'Vrijgave',sameVendor:'Eén vendor: Werfen / Immucor',emptyState:'Geen data voor deze selectie.',saveFailed:'Export niet beschikbaar voor deze selectie.',selectedOnly:'Alleen de bevestigde bronmeting is aan deze context gekoppeld.'},
 en:{report:'Report',import:'Import',concept:'Concept',local:'Local workspace',prototype:'Local research prototype',localNotice:'Files remain in this browser. No central upload or real provider authorisation.',title:'Your results, in context',laboratory:'LABORATORY REPORT',distribution:'Specificity distributions',sourceSample:'Source measurement',quantity:'Measurement section',peerPoints:'Individual peer values',measurements:'Measurements and consensus',tableCaption:'Measurements for selected loci',quality:'Quality, control beads and provenance',clear:'Clear session',importTitle:'Import an xPONENT run',importIntro:'Choose the CSV file and matching EDS lot file. Review validation, then confirm sample mapping. Original values are preserved.',drop:'Drop CSV and EDS here',orChoose:'or choose files · maximum 20 MB per CSV and 5 MB per EDS',publicExamples:'Public mock examples:',sourcesNote:' · No participating laboratory data.',mapping:'Confirm the EPT context',scheme:'Scheme / edition',round:'Round',techConfirm:'Technique according to the performed protocol',noInference:'Technique is not inferred from the beadset. C1q/C3d import has not been validated with genuine files.',mapSource:'Source measurement to map',confirm:'I confirm technique, lot and mapping of this source measurement to this EPT sample.',accept:'Confirm import',simulation:'LOCAL SIMULATION ONLY',providerTitle:'Test consensus and release',providerIntro:'This simulates the future provider route and grants no real permissions. Download the example for the current context and load its JSON file. Peer values are generated synthetically, never inferred from other wells as laboratories.',template:'Download consensus example',loadConsensus:'Load consensus JSON',revoke:'Withdraw demo release',footer:'Supplementary research analysis · not official EPT assessment · data are not retained after refresh.',style:'EFI style guide',awaiting:'Own data only · no consensus',released:'Demo consensus loaded',own:'Your laboratory',peers:'Other laboratories · synthetic',noData:'No measurements for this selection.',noTechnique:'This technique was not measured in the current import.',noLoci:'Select at least one locus.',locked:'Group context locked. Own data remain visible. Load the consensus example to test synthetic peer display.',demoReleased:'Synthetic peer context active. These generated values are not observations from other laboratories.',rows:'rows',pl:'PL String / bead composition',mfi:'Own MFI',call:'Provider consensus',nLabs:'Peer labs',nMeasures:'Peer measurements',excluded:'Not on log axis',notAssessed:'Not assessed',positive:'Positive',negative:'Negative',no_consensus:'No consensus',not_assessed:'Not assessed',noOwn:'No own source data',targets:'Molecular targets',controls:'Control beads',class:'Class',lot:'Lot',localSource:'Public xPONENT mock',userSource:'Locally selected file',previewReady:'Preview ready. Confirm source measurement, technique and EPT context.',accepted:'Import confirmed; consensus context locked again.',waitingFiles:'Choose one CSV and one EDS for the same lot run.',error:'Import not accepted',previous:'The previous report is unchanged.',noReference:'No valid positive peer values.',log:'MFI (log scale)',linear:'MFI (linear scale)',ownOnly:'Own results; no peer context loaded.',refs:'Peer data exclude own lab; one vendor available. Merge and Separate use the same Werfen measurements.',synthetic:'SYNTHETIC REFERENCE',ready:'Confirmed',needsImport:'Import a run first.',consensusOk:'Demo consensus validated for this context. Synthetic reference generated.',revoked:'Demo release withdrawn; peer data removed.',ambiguous:'Multiple bead definitions for the same PL String: no automatic pooling.',nonPositive:'zero / negative / missing / invalid',noteCounts:'Number of unique synthetic laboratories; repeats do not increase the count.',importing:'Validating files locally…',releasedDate:'Release',sameVendor:'One vendor: Werfen / Immucor',emptyState:'No data for this selection.',saveFailed:'Export unavailable for this selection.',selectedOnly:'Only the confirmed source measurement is mapped to this context.'}
};
const errors={too_large:['Bestand te groot.','File too large.'],not_xponent:['Geen ondersteunde xPONENT-export.','Not a supported xPONENT export.'],lot_mismatch:['CSV-protocol en EDS-lot komen niet overeen.','CSV protocol and EDS lot do not match.'],unmapped_bead:['Bead zonder EDS-koppeling.','Bead missing from EDS mapping.'],missing_median:['Sectie Median ontbreekt.','Median section missing.'],unsafe_xml:['XML met DTD/entities is niet toegestaan.','XML DTD/entities are not allowed.'],not_eds:['Geen ondersteund EDS-lotbestand.','Not a supported EDS lot file.'],invalid_xml:['EDS bevat ongeldige XML.','EDS contains invalid XML.'],consensus_context:['Consensus hoort bij een andere EPT-context.','Consensus belongs to another EPT context.'],consensus_technique:['Consensus past niet bij techniek/klasse.','Consensus does not match technique/class.'],consensus_release:['Geldige vrijgavedatum en versie vereist.','A valid release date and version are required.'],invalid_consensus:['Alleen het synthetische consensusvoorbeeld wordt ondersteund.','Only the synthetic consensus example is supported.'],unsupported_format:['Formaat nog niet ondersteund.','Format not supported yet.'],missing_quantity:['Meetsectie ontbreekt.','Measurement section missing.'],row_width:['Onverwachte rijlengte in meetsectie.','Unexpected row width in measurement section.'],duplicate_sample:['Dubbele sample/well in meetsectie.','Duplicate sample/well in measurement section.'],csv_quotes:['Ongeldige CSV-aanhalingstekens.','Invalid CSV quoting.']};
dict.nl.techniqueLabel='Techniek';dict.en.techniqueLabel='Technique';
dict.nl.local='Lokale verwerking';dict.en.local='Browser processing';
dict.nl.prototype='Onderzoeksprototype · browserdemo';dict.en.prototype='Research prototype · browser demo';
Object.assign(dict.nl,{skip:'Ga naar inhoud',sourceSamples:'bronmetingen',observations:'meetwaarden',mappingIssues:'mappingmeldingen',status_zero:'nul',status_negative:'negatief',status_missing:'ontbrekend',status_invalid:'ongeldig'});
Object.assign(dict.en,{skip:'Skip to content',sourceSamples:'source measurements',observations:'observations',mappingIssues:'mapping issues',status_zero:'zero',status_negative:'negative',status_missing:'missing',status_invalid:'invalid'});
let state={dashboard:new URLSearchParams(location.search).get('dashboard')==='provider'?'provider':'lab',locale:'nl',data:null,parsed:null,eds:null,provenance:null,context:null,sourceSample:null,sourceWell:null,technique:'SAB_IGG',quantity:'Median',loci:new Set(['A','B','C']),mode:'merge',scale:'log10',showPeers:true,consensus:null,peerRows:[]};
let pendingFiles={},preview=null,importSequence=0;
const t=k=>dict[state.locale][k]||k;
const format=n=>n===null||n===undefined?'-':new Intl.NumberFormat(state.locale,{maximumFractionDigits:2}).format(n);
function errorText(e){const message=errors[e.code]?.[state.locale==='nl'?0:1]||e.message||String(e);return `${message}${e.code?' ['+e.code+']':''}`;}
function sourceKey(s){return encodeURIComponent(JSON.stringify([s.sample,s.well]));}
function activeRows(){return ownRows().filter(r=>!r.control&&r.plString&&r.technique===state.technique&&state.loci.has(r.locus));}
function ownRows(){return state.data?.observations.filter(r=>r.sample===state.sourceSample&&r.well===state.sourceWell)||[];}
function allowedLoci(){return state.data?.hlaClass==='II'?['DRB1','DRB3-4-5','DQ','DP']:['A','B','C'];}
function releaseReset(){state.consensus=null;state.peerRows=[];}
function button(label,value,current,disabled=false){return `<button type="button" data-value="${esc(value)}" aria-pressed="${String(value===current)}" ${disabled?'disabled':''}>${esc(label)}</button>`;}
function refreshText(){
 document.documentElement.lang=state.locale;document.title=`EFI EPT Insights · ${t('local')}`;
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
 $('#language').textContent=state.locale==='nl'?'EN':'NL';$('#language').setAttribute('aria-label',state.locale==='nl'?'Switch to English':'Schakel naar Nederlands');
 $('#concept-link').href=`../docs/concept_${state.locale.toUpperCase()}.html`;$('#style-link').href=`../docs/style_${state.locale.toUpperCase()}.html`;
}
function reference(row){
 if(!state.consensus)return [];
 return selectReference(state.peerRows,{context:state.context,technique:state.technique,hlaClass:state.data.hlaClass,quantity:state.quantity,plString:row.plString,ownLab:'own',selectedLots:[state.data.lot]});
}
Object.assign(dict.nl,{labDashboard:'Deelnemend lab',providerDashboard:'EPT-provider',providerOverview:'Rondzending en vrijgave',providerScope:'Je beheert de consensus binnen je eigen provider, schema, ronde, sample en techniek. Het labrapport staat in het aparte labdashboard.',providerPending:'Consensus nog niet vrijgegeven',providerPage:'Jouw rondzending, in overzicht',locked:'Je ziet alleen je eigen data. Je EPT-provider geeft de groepscontext vrij.'});
Object.assign(dict.en,{labDashboard:'Participating lab',providerDashboard:'EPT provider',providerOverview:'Distribution and release',providerScope:'Manage consensus within your own provider, scheme, round, sample and technique. The laboratory report has its own dashboard.',providerPending:'Consensus not yet released',providerPage:'Your distribution, at a glance',locked:'You can see your own data. Your EPT provider releases the group context.'});
function renderDashboard(){
 const provider=state.dashboard==='provider';
 $('#lab-dashboard').hidden=provider;$('#provider-dashboard').hidden=!provider;$('#dashboard').value=state.dashboard;
 $('#page-title').textContent=t(provider?'providerPage':'title');
 for(const [id,href,label] of [['#primary-nav',provider?'#provider-overview':'#report',provider?'providerOverview':'report'],['#secondary-nav',provider?'#provider-consensus':'#import',provider?'providerTitle':'import']]){const link=$(id);link.href=href;link.textContent=t(label);}
 const fields=state.context?Object.entries(state.context):[];
 $('#provider-context').innerHTML=fields.map(([key,value])=>`<div><dt>${esc(({provider:'Provider',schemeEdition:t('scheme'),round:t('round'),sample:'EPT sample'})[key]||key)}</dt><dd>${esc(value)}</dd></div>`).join('')+`<div><dt>${t('techniqueLabel')}</dt><dd>${esc(state.data?.technique||state.technique)}</dd></div>`;
 $('#provider-release').textContent=state.consensus?t('released'):t('providerPending');
}
$('#dashboard').addEventListener('change',e=>{state.dashboard=e.target.value;const url=new URL(location.href);url.searchParams.set('dashboard',state.dashboard);url.hash='';history.replaceState(null,'',url);render();window.scrollTo(0,0);});
function render(){
 refreshText();renderDashboard();
 const data=state.data, rows=activeRows();
 $('#hero-context').textContent=state.context?`${state.context.provider} · ${state.context.schemeEdition} · ${state.context.round} · ${state.context.sample}`:t('needsImport');
 $('#summary').innerHTML=[
 [data?`${t('class')} ${data.hlaClass}`:'-',data?'Werfen / Immucor':t('noOwn')],
 [rows.length,t('targets')],
 [ownRows().filter(r=>r.control).length,t('controls')],
 [state.consensus?t('released'):t('awaiting'),state.consensus?t('synthetic'):t('local')]
 ].map(([a,b])=>`<div class="summary-card"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join('');
 $('#technique-buttons').innerHTML=TECHNIQUES.map((v,i)=>button(['SAB','C1q','C3d'][i],v,state.technique)).join('');
 $('#locus-buttons').innerHTML=LOCI.map(l=>`<button type="button" data-value="${l}" aria-pressed="${state.loci.has(l)}" ${!allowedLoci().includes(l)?`disabled title="${t('class')} ${data?.hlaClass||'I'}"`:''}>${l}</button>`).join('');
 $('#source-sample').innerHTML=data?`<option>${esc(state.sourceSample)} · ${esc(state.sourceWell)}</option>`:'<option>-</option>';
 $('#source-sample').title=t('selectedOnly');$('#quantity').value=state.quantity;$('#quantity').disabled=!data;
 $('#lot-info').textContent=data?`${t('lot')}: ${data.lot} · ${state.data.adapter}`:'';
 $('#release-badge').textContent=state.consensus?`${t('released')} · ${state.consensus.version}`:t('awaiting');
 $('#view-buttons').innerHTML=['merge','separate'].map(v=>button(v==='merge'?'Merge':'Separate',v,state.mode,!state.consensus)).join('');
 $('#scale-buttons').innerHTML=[button(state.locale==='nl'?'Lineair':'Linear','linear',state.scale),button('Log','log10',state.scale)].join('');
 $('#peer-points').checked=state.consensus?state.showPeers:false;$('#peer-points').disabled=!state.consensus;
 $('#chart-description').textContent=state.consensus?t('refs'):t('ownOnly');
 $('#report-status').textContent=state.consensus?t('demoReleased'):t('locked');
 const viewRows=rows.map(row=>({row,refs:reference(row)}));
 drawChart(viewRows);
 $('#measurement-head').innerHTML=`<tr><th>${t('pl')}</th><th>${t('mfi')}</th><th>${t('call')}</th><th>${t('nLabs')}</th><th>${t('nMeasures')}</th><th>${t('excluded')}</th></tr>`;
 $('#measurement-body').innerHTML=viewRows.length?viewRows.map(({row,refs})=>{
   const stats=referenceStats(refs),assignment=state.consensus?.assignments.find(x=>x.plString===row.plString);
   return `<tr><td class="target">${esc(row.plString)}</td><td>${format(row.value)}${row.status!=='positive'?` <span class="meta">(${esc(t('status_'+row.status))})</span>`:''}</td><td>${state.consensus?t(assignment?.call||'not_assessed'):'-'}</td><td>${state.consensus?stats.nLabs:'-'}</td><td>${state.consensus?stats.nMeasurements:'-'}</td><td>${state.consensus?stats.nExcluded:'-'}</td></tr>`;
 }).join(''):`<tr><td colspan="6">${esc(emptyReason())}</td></tr>`;
 $('#row-count').textContent=`${rows.length} ${t('rows')}`;
 const q={schemaVersion:1,adapter:data?.adapter,source:state.provenance,context:state.context,technique:state.technique,quantity:state.quantity,lot:data?.lot,sourceSample:state.sourceSample,sourceWell:state.sourceWell,controls:ownRows().filter(r=>r.control).map(({sourceBead,value,status,count})=>({sourceBead,value,status,count})),excludedCompositionRows:ownRows().filter(r=>!r.control&&!r.plString).length,issues:data?.issues||[],sourceValuesUnmodified:true,logNonPositivePolicy:'exclude-from-density-and-count',densityMethod:'log10 Gaussian KDE; fixed bandwidth 0.18; 100 steps; min 5; equal peak width',referenceKind:state.consensus?'generated-synthetic':'none',release:state.consensus?{version:state.consensus.version,date:state.consensus.releaseDate}:null};
 $('#quality-content').innerHTML=`<p>${esc(t('selectedOnly'))}</p><pre>${esc(JSON.stringify(q,null,2))}</pre>`;
 ['#export-csv','#export-json','#export-svg','#consensus-template'].forEach(id=>$(id).disabled=!data);
 $('#revoke').disabled=!state.consensus;
}
function emptyReason(){return !state.data?t('needsImport'):state.technique!==state.data.technique?t('noTechnique'):!state.loci.size?t('noLoci'):t('noData');}
const ns='http://www.w3.org/2000/svg';
function el(tag,attrs={},parent,text){const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;if(parent)parent.append(n);return n;}
function marker(parent,x,y,vendor,own=false,size=null){const radius=size??(own?7:3.3);return el(vendor==='oneLambda'?'rect':'circle',vendor==='oneLambda'?{x:x-radius,y:y-radius,width:radius*2,height:radius*2,fill:own?'#DE5757':'#064A89',stroke:own?'#FFFFFF':'none','stroke-width':1}:{cx:x,cy:y,r:radius,fill:own?'#DE5757':'#064A89',stroke:own?'#FFFFFF':'none','stroke-width':1},parent);}
function drawChart(items){
 const host=$('#chart');host.replaceChildren();
 $('#legend').innerHTML=`<span><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" fill="#DE5757"/></svg>Werfen · ${esc(t('own'))}</span>${state.consensus?`<span><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="4" fill="#064A89"/></svg>Werfen · ${esc(t('peers'))}</span>`:''}`;
 if(!items.length){const p=document.createElement('p');p.className='empty';p.textContent=emptyReason();host.append(p);return;}
 const labelWidth=Math.min(470,Math.max(190,...items.map(x=>x.row.plString.length*7.2+20)));
 const width=Math.max(1060,labelWidth+650),top=40,rowHeight=84,height=top+items.length*rowHeight+75,left=labelWidth,right=35,plotWidth=width-left-right;
 const allValues=items.flatMap(({row,refs})=>[row.value,...refs.map(x=>x.value)]);
 const domain=mfiDomain(allValues);const log=state.scale==='log10';const axisMin=log?domain[0]:0,axisMax=domain[1];
 const scale=v=>left+(log?(Math.log10(v)-Math.log10(axisMin))/(Math.log10(axisMax)-Math.log10(axisMin)):(v-axisMin)/(axisMax-axisMin))*plotWidth;
 const svg=el('svg',{xmlns:ns,viewBox:`0 0 ${width} ${height}`,role:'img','aria-labelledby':'svg-title svg-description','data-scale':state.scale},host);
 el('title',{id:'svg-title'},svg,t('distribution'));
 el('desc',{id:'svg-description'},svg,`${state.consensus?t('synthetic'):t('ownOnly')}. ${t(log?'log':'linear')}. ${state.mode}.`);
 el('rect',{width,height,fill:'#FFFFFF'},svg);
 const bottom=top+items.length*rowHeight;
 const ticks=log?Array.from({length:Math.round(Math.log10(axisMax)-Math.log10(axisMin))+1},(_,i)=>axisMin*10**i):[0,axisMax/4,axisMax/2,axisMax*3/4,axisMax];
 for(const tick of ticks){const x=scale(tick);el('line',{x1:x,x2:x,y1:top-15,y2:bottom,stroke:'#DFE4E8'},svg);el('text',{x,y:bottom+25,'text-anchor':'middle','font-size':12},svg,format(tick));}
 el('line',{x1:left,x2:width-right,y1:bottom,y2:bottom,stroke:'#064A89'},svg);
 for(const [index,{row,refs}]of items.entries()){
   const y=top+index*rowHeight+rowHeight/2;
   el('text',{x:labelWidth-18,y:y+4,'text-anchor':'end','font-size':12},svg,row.plString);
   const hasDuplicates=items.filter(x=>x.row.plString===row.plString).length>1;
   // Ambiguous repeated PL rows are displayed independently, with no pooled reference.
   const groups=hasDuplicates?[]:state.mode==='merge'?[refs]:Object.keys(VENDORS).map(v=>refs.filter(x=>x.vendor===v)).filter(x=>x.length);
   groups.forEach((group,gi)=>{
     const offset=groups.length>1?(gi-(groups.length-1)/2)*24:0;
     const density=violin(group.map(x=>x.value),{domain,bandwidth:.18});
     if(density){const a=density.map((p,i)=>`${i?'L':'M'}${scale(p.value).toFixed(2)},${(y+offset-p.width*22).toFixed(2)}`),b=[...density].reverse().map(p=>`L${scale(p.value).toFixed(2)},${(y+offset+p.width*22).toFixed(2)}`);el('path',{d:[...a,...b,'Z'].join(''),fill:'#064A89','fill-opacity':.15,stroke:'none','data-kind':'violin'},svg);}
     if(state.showPeers)chartPoints(group).forEach((point,i)=>{const jitter=Math.sin((i+1)*2.399+index*1.67)*13;const m=marker(svg,scale(point.value),y+offset+jitter,point.vendor);m.dataset.kind='peer';el('title',{},m,`${t('peers')} · ${VENDORS[point.vendor].name} · ${format(point.value)} MFI`);});
   });
   if(row.value>0&&Number.isFinite(row.value)){const m=marker(svg,scale(row.value),y,row.vendor,true);m.dataset.kind='own';el('title',{},m,`${t('own')} · ${format(row.value)} MFI`);}
   else el('text',{x:left+8,y:y+4,'font-size':11},svg,`${row.status}: ${format(row.value)}`);
   if(hasDuplicates)el('text',{x:left+10,y:y+30,'font-size':10},svg,t('ambiguous'));
 }
 el('text',{x:left+plotWidth/2,y:height-13,'text-anchor':'middle','font-size':13,'font-weight':600},svg,t(log?'log':'linear'));
}
function contextFromForm(){return Object.fromEntries(['provider','schemeEdition','round','sample'].map(k=>[k,$('#ctx-'+k).value.trim()]));}
function fillPreview(){
 $('#accept-import').disabled=!preview;$('#confirm-mapping').checked=false;
 if(!preview){$('#import-preview').replaceChildren();$('#preview-sample').innerHTML='';return;}
 const chosen=$('#preview-sample').value;
 $('#preview-sample').innerHTML=preview.data.samples.map(s=>`<option value="${esc(sourceKey(s))}">${esc(s.sample)} · ${esc(s.well)}</option>`).join('');
 if(preview.data.samples.some(x=>sourceKey(x)===chosen))$('#preview-sample').value=chosen;
 const d=preview.data;
 $('#import-preview').innerHTML=`<div class="preview-tags"><span>${esc(d.lot)}</span><span>${t('class')} ${d.hlaClass}</span><span>${d.samples.length} ${t('sourceSamples')}</span><span>${d.observations.length} ${t('observations')}</span><span>${d.issues.length} ${t('mappingIssues')}</span></div><p class="meta">SHA-256 CSV: ${esc(preview.provenance.csv.sha256)}<br>SHA-256 EDS: ${esc(preview.provenance.eds.sha256)}</p>`;
}
async function stageTexts(csvText,edsText,names,builtin=false,sequence=++importSequence,rawHashes=null){
 const parsed=parseXponent(csvText),eds=parseEds(edsText),data=combineImport(parsed,eds,{technique:$('#import-technique').value});
 const [csvHash,edsHash]=rawHashes||await Promise.all([sha256(csvText),sha256(edsText)]);
 if(sequence!==importSequence)return;
 preview={parsed,eds,data,provenance:{kind:builtin?'public-mock':'local-file',csv:{name:names[0],sha256:csvHash},eds:{name:names[1],sha256:edsHash},sourceUrl:builtin?'https://github.com/lcreteig/hlapro':null}};
 fillPreview();$('#import-status').textContent=t('previewReady');
}
async function receiveFiles(list){
 const sequence=++importSequence;preview=null;fillPreview();$('#import-status').textContent=t('importing');
 try {
  const files=[...list];const kinds=files.map(f=>f.name.toLowerCase().endsWith('.csv')?'csv':f.name.toLowerCase().endsWith('.eds')?'eds':null);
  if(kinds.some(x=>!x)||kinds.filter(x=>x==='csv').length>1||kinds.filter(x=>x==='eds').length>1)throw new ImportError('unsupported_format');
  for(const [i,f]of files.entries()) {if(f.size>(kinds[i]==='csv'?20_000_000:5_000_000))throw new ImportError('too_large');const bytes=await f.arrayBuffer();pendingFiles[kinds[i]]={text:new TextDecoder('utf-8',{fatal:true}).decode(bytes),name:f.name,hash:await sha256(bytes)};}
  if(sequence!==importSequence)return;
  if(!pendingFiles.csv||!pendingFiles.eds){$('#import-status').textContent=t('waitingFiles');return;}
  await stageTexts(pendingFiles.csv.text,pendingFiles.eds.text,[pendingFiles.csv.name,pendingFiles.eds.name],false,sequence,[pendingFiles.csv.hash,pendingFiles.eds.hash]);
 }catch(e){preview=null;fillPreview();$('#import-status').textContent=`${t('error')}: ${errorText(e)} ${t('previous')}`;}
}
function acceptPreview(){
 if(!preview)throw new ImportError('no_preview');
 const context=contextFromForm();if(!validateContext(context))throw new ImportError('missing_context');
 const data=combineImport(preview.parsed,preview.eds,{technique:$('#import-technique').value,quantity:'Median'});
 const selected=data.samples.find(s=>sourceKey(s)===$('#preview-sample').value);if(!selected)throw new ImportError('missing_sample');
 const sourceSample=selected.sample,sourceWell=selected.well;
 state={...state,data,parsed:preview.parsed,eds:preview.eds,provenance:preview.provenance,context,sourceSample,sourceWell,quantity:'Median',technique:data.technique,loci:new Set(data.hlaClass==='I'?['A','B','C']:['DRB1','DRB3-4-5','DQ','DP']),consensus:null,peerRows:[]};
 render();$('#import-status').textContent=t('accepted');$('#consensus-status').textContent='';
}
async function loadDemo(hlaClass,initial=false){
 try {
  $('#import-status').textContent=t('importing');const seq=++importSequence;preview=null;fillPreview();pendingFiles={};
  const names=hlaClass==='I'?['LSA1-test.csv','3012456_3065421-SA1.eds']:['LSA2-test.csv','3062145_3045216-SA2.eds'];
  const texts=await Promise.all(names.map(async n=>{const r=await fetch('fixtures/'+n,{cache:'no-store'});if(!r.ok)throw new Error('Fixture unavailable');return r.text();}));
  if(seq!==importSequence)return;
  $('#import-technique').value='SAB_IGG';await stageTexts(...texts,names,true,seq);
  if(initial){$('#confirm-mapping').checked=true;acceptPreview();$('#import-status').textContent=t('localSource');}
 }catch(e){$('#import-status').textContent=errorText(e);}
}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function snapshot(){const rows=activeRows();return {schemaVersion:1,appVersion:VERSION,generatedAt:new Date().toISOString(),locale:state.locale,context:state.context,source:state.provenance,sourceSample:state.sourceSample,sourceWell:state.sourceWell,technique:state.technique,hlaClass:state.data?.hlaClass,quantity:state.quantity,lot:state.data?.lot,mode:state.mode,mfiScale:state.scale,loci:[...state.loci],referenceKind:state.consensus?'generated-synthetic':'none',consensus:state.consensus,method:{density:'Gaussian KDE on log10 positive MFI',bandwidth:.18,steps:100,minCount:5,ownExcluded:true},rows:rows.map(row=>({plString:row.plString,sourceBead:row.sourceBead,value:row.value,status:row.status,count:row.count,vendor:row.vendor,stats:state.consensus?referenceStats(reference(row)):null,peerPoints:state.consensus&&state.showPeers?chartPoints(reference(row)):[]}))};}
function template(){return {schemaVersion:1,kind:'synthetic-provider-consensus',officiallyReleased:true,context:{...state.context},technique:state.data.technique,hlaClass:state.data.hlaClass,releaseDate:new Date().toISOString().slice(0,10),version:'demo-v1',assignments:[...new Set(ownRows().filter(x=>x.plString).map(x=>x.plString))].map(plString=>({plString,call:'not_assessed'}))};}
document.addEventListener('click',e=>{
 const b=e.target.closest('button[data-value]');if(!b||b.disabled)return;
 if(b.parentElement.id==='technique-buttons')state.technique=b.dataset.value;
 if(b.parentElement.id==='locus-buttons'){const v=b.dataset.value;state.loci.has(v)?state.loci.delete(v):state.loci.add(v);}
 if(b.parentElement.id==='view-buttons')state.mode=b.dataset.value;
 if(b.parentElement.id==='scale-buttons')state.scale=b.dataset.value;
 render();
});
$('#language').addEventListener('click',()=>{state.locale=state.locale==='nl'?'en':'nl';render();if(preview)fillPreview();});
$('#peer-points').addEventListener('change',e=>{state.showPeers=e.target.checked;render();});
$('#quantity').addEventListener('change',e=>{try{state.data=combineImport(state.parsed,state.eds,{technique:state.data.technique,quantity:e.target.value});state.quantity=e.target.value;releaseReset();render();}catch(err){$('#import-status').textContent=errorText(err);render();}});
$('#files').addEventListener('change',e=>receiveFiles(e.target.files));
$('#drop-zone').addEventListener('keydown',e=>{if(e.target===e.currentTarget&&['Enter',' '].includes(e.key)){e.preventDefault();$('#files').click();}});
for(const name of ['dragenter','dragover'])$('#drop-zone').addEventListener(name,e=>{e.preventDefault();e.currentTarget.classList.add('dragging');});
for(const name of ['dragleave','drop'])$('#drop-zone').addEventListener(name,e=>{e.preventDefault();e.currentTarget.classList.remove('dragging');if(name==='drop')receiveFiles(e.dataTransfer.files);});
$('#demo-i').addEventListener('click',()=>loadDemo('I'));$('#demo-ii').addEventListener('click',()=>loadDemo('II'));
$('#import-technique').addEventListener('change',()=>{$('#confirm-mapping').checked=false;});
$('#preview-sample').addEventListener('change',()=>{$('#confirm-mapping').checked=false;});
$('#mapping-form').addEventListener('submit',e=>{e.preventDefault();try{acceptPreview();$('#report').scrollIntoView({behavior:'smooth'});}catch(err){$('#import-status').textContent=errorText(err);}});
$('#consensus-template').addEventListener('click',()=>download('synthetic-consensus.json',JSON.stringify(template(),null,2),'application/json'));
$('#consensus-file').addEventListener('change',async e=>{try{const f=e.target.files[0];if(!f)return;if(!state.data)throw new Error(t('needsImport'));if(f.size>1_000_000)throw new ImportError('too_large');const parsed=JSON.parse(await f.text());state.consensus=validateConsensus(parsed,state.context,state.data.technique,state.data.hlaClass);state.peerRows=buildSyntheticPeers(ownRows(),state.context);render();$('#consensus-status').textContent=t('consensusOk');}catch(err){$('#consensus-status').textContent=`${t('error')}: ${errorText(err)}`;}finally{e.target.value='';}});
$('#revoke').addEventListener('click',()=>{releaseReset();render();$('#consensus-status').textContent=t('revoked');});
$('#export-csv').addEventListener('click',()=>{const rows=snapshot().rows.map(r=>({...r,provider:state.context.provider,schemeEdition:state.context.schemeEdition,round:state.context.round,sample:state.context.sample,technique:state.technique,quantity:state.quantity,mfiScale:state.scale,displayMode:state.mode,sourceHash:state.provenance.csv.sha256,referenceKind:state.consensus?'synthetic':'none'}));download('ept-own-results.csv',toCsv(rows,['provider','schemeEdition','round','sample','technique','quantity','plString','value','status','vendor','mfiScale','displayMode','referenceKind','sourceHash']),'text/csv;charset=utf-8');});
$('#export-json').addEventListener('click',()=>download('ept-report.json',JSON.stringify(snapshot(),null,2),'application/json'));
$('#export-svg').addEventListener('click',async()=>{try{const svg=$('#chart svg');if(!svg)throw new Error(t('saveFailed'));const clone=svg.cloneNode(true);const response=await fetch('../docs/assets/montserrat-variable.ttf');if(!response.ok)throw new Error('Font unavailable');const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));const style=el('style',{},null,`@font-face{font-family:Montserrat;src:url(data:font/ttf;base64,${btoa(binary)})}text{font-family:Montserrat,system-ui,sans-serif;fill:#232424;stroke:none}`);clone.insertBefore(style,clone.firstChild);const {rows,...metadata}=snapshot();el('metadata',{},clone,JSON.stringify(metadata));download('ept-report.svg',new XMLSerializer().serializeToString(clone),'image/svg+xml');}catch(e){$('#import-status').textContent=errorText(e);}});
$('#clear-session').addEventListener('click',()=>{state={...state,data:null,parsed:null,eds:null,provenance:null,context:null,sourceSample:null,consensus:null,peerRows:[]};preview=null;pendingFiles={};importSequence++;$('#files').value='';$('#consensus-file').value='';fillPreview();$('#import-status').textContent='';$('#consensus-status').textContent='';render();});
// Local-only diagnostic hook; no identity/remote credentials. The production app must not expose privileged state.
if(['localhost','127.0.0.1'].includes(location.hostname))Object.defineProperty(window,'eptDiagnostics',{value:{snapshot,template},writable:false});
const headerObserver=new ResizeObserver(entries=>{document.documentElement.style.setProperty('--topbar-height',`${Math.ceil(entries[0].target.getBoundingClientRect().height)}px`);});headerObserver.observe($('.topbar'));
render();loadDemo('I',true);
