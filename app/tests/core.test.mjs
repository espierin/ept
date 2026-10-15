import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseCsv,parseXponent,parseNumeric,canonicalComposition,selectReference,referenceStats,chartPoints,violin,mfiDomain,validateConsensus,toCsv,sha256} from '../core.mjs';
const read=n=>readFileSync(new URL('../fixtures/'+n,import.meta.url),'utf8');
const context={provider:'P1',schemeEdition:'S1-2026',round:'R1',sample:'01'};

test('Class I xPONENT preserves source MFI, half values, controls and bead counts',()=>{
 const x=parseXponent(read('LSA1-test.csv'));
 assert.equal(x.protocol,'3012456_3065421-SA1');assert.equal(x.measurements.Median.samples.length,2);
 assert.equal(x.measurements.Median.samples[0].values['103'].value,8001.5);
 assert.equal(x.measurements.Median.samples[0].values.PC.value,18205.5);
 assert.equal(x.counts.samples[0].values['103'].value,67);
 assert.equal(x.measurements['Net MFI'].samples[1].values['104'].value,92.5);
});
test('Class II exports preserve separate sample/well identities and five analytical beads',()=>{
 const x=parseXponent(read('LSA2-test.csv'));
 assert.equal(x.protocol,'3062145_3045216-SA2');
 assert.equal(x.measurements.Median.samples[0].sample,'S0003');
 assert.equal(x.measurements.Median.samples[0].values['205'].value,104.5);
 assert.equal(x.measurements.Median.beads.length,7);
});
test('CSV handles BOM, escaped quotes and quoted newlines, rejects malformed quotes',()=>{
 assert.deepEqual(parseCsv('\uFEFFa,b\r\n"one\ntwo","say ""hi"""'),[['a','b'],['one\ntwo','say "hi"']]);
 assert.throws(()=>parseCsv('a,"unfinished'),{code:'csv_quotes'});
 assert.throws(()=>parseCsv('"x"junk,y'),{code:'csv_quotes'});
});
test('Missing fields are not zeros, invalid/nonfinite values remain invalid',()=>{
 assert.deepEqual(parseNumeric(''),{value:null,status:'missing'});
 assert.equal(parseNumeric('0').status,'zero');assert.equal(parseNumeric('-2.5').status,'negative');
 for(const v of ['Infinity','NaN','1,2','<script>','1e999'])assert.equal(parseNumeric(v).status,'invalid');
});
test('Unsupported vendor CSV and malformed xPONENT sections are rejected',()=>{
 assert.throws(()=>parseXponent('Sample ID,Raw Value\nS1,100'),{code:'not_xponent'});
 assert.throws(()=>parseXponent(read('LSA1-test.csv').replace('"S001","161"','"S001","161","extra"')),{code:'row_width'});
});
test('EDS molecular compositions preserve confirmed DQ/DP pairs and separate serology',()=>{
 assert.equal(canonicalComposition(['DQB1*02:01','DQA1*02:01']).plString,'HLA-DQA1*02:01~HLA-DQB1*02:01');
 assert.equal(canonicalComposition(['B*14:01','Bw6']).plString,'HLA-B*14:01');
 assert.equal(canonicalComposition(['DRB3*02:02']).locus,'DRB3-4-5');
 assert.equal(canonicalComposition(['DPA1*01:03']).partial,true);
 assert.equal(canonicalComposition(['Bw6']).plString,null);
});
const base={context,technique:'SAB_IGG',hlaClass:'I',quantity:'Median',plString:'HLA-A*01:01',lot:'LOT1',targetId:'T1',primary:true};
const query={context,technique:'SAB_IGG',hlaClass:'I',quantity:'Median',plString:'HLA-A*01:01',ownLab:'own',selectedLots:['LOT1']};
test('References exclude own laboratory across vendors and never mix provider/sample/technique/quantity',()=>{
 const rows=[{...base,lab:'own',vendor:'werfen',value:2},{...base,lab:'own',vendor:'oneLambda',value:3},{...base,lab:'peer',vendor:'werfen',value:4},
 {...base,lab:'wrong-provider',vendor:'werfen',context:{...context,provider:'P2'},value:5},
 {...base,lab:'wrong-assay',vendor:'werfen',technique:'SAB_C1Q',value:6},
 {...base,lab:'wrong-quantity',vendor:'werfen',quantity:'Net MFI',value:7}];
 assert.deepEqual(selectReference(rows,query).map(x=>x.lab),['peer']);
});
test('Dual-vendor labs contribute two measurements but one unique lab; duplicate exports do not inflate',()=>{
 const a={...base,lab:'p1',vendor:'werfen',value:10};
 const selected=selectReference([a,{...a},{...a,vendor:'oneLambda',value:100}],query);
 assert.equal(selected.length,2);assert.equal(referenceStats(selected).nLabs,1);
 assert.equal(referenceStats(selected).nMeasurements,2);
 assert.throws(()=>selectReference([a,{...a,value:11}],query),{code:'ambiguous_primary'});
});
test('Chart point payload contains no lab, sample, run or target identity',()=>{
 const points=chartPoints([{...base,lab:'restricted-code',vendor:'werfen',value:10}]);
 assert.deepEqual(points,[{value:10,vendor:'werfen'}]);
 assert.ok(!JSON.stringify(points).includes('restricted-code'));
});
test('Merged density is calculated from pooled observations, not two offset vendor densities',()=>{
 const low=[10,11,12,13,14,15], high=[1000,1100,1200,1300,1400,1500];
 const a=violin(low,{domain:[1,10000]}),merged=violin([...low,...high],{domain:[1,10000]});
 assert.notDeepEqual(a,merged);assert.equal(merged.length,101);
 assert.ok(merged.every(x=>x.value>0&&Number.isFinite(x.density)&&x.width>=0&&x.width<=1));
 assert.equal(merged[0].width,0);assert.equal(merged.at(-1).width,0);
});
test('Log domain includes values below ten; small and constant cohorts do not create violins',()=>{
 assert.deepEqual(mfiDomain([0,-1,null,.05,200]),[.01,1000]);
 assert.equal(violin([1,2,3],{domain:[1,100]}),null);
 assert.equal(violin([7,7,7,7,7],{domain:[1,100]}),null);
});
test('Consensus fixture is scoped and needs explicit nonfuture release',()=>{
 const v={schemaVersion:1,kind:'synthetic-provider-consensus',context,technique:'SAB_IGG',hlaClass:'I',officiallyReleased:true,releaseDate:'2026-01-01',version:'1',assignments:[{plString:'HLA-A*01:01',call:'not_assessed'}]};
 assert.equal(validateConsensus(v,context,'SAB_IGG','I').version,'1');
 assert.throws(()=>validateConsensus(v,{...context,round:'R2'},'SAB_IGG','I'),{code:'consensus_context'});
 assert.throws(()=>validateConsensus(v,context,'SAB_C1Q','I'),{code:'consensus_technique'});
 assert.throws(()=>validateConsensus({...v,releaseDate:'2099-01-01'},context,'SAB_IGG','I'),{code:'consensus_release'});
});
test('CSV export quotes cells and neutralises spreadsheet formulas; SHA256 accepts original bytes',async()=>{
 const csv=toCsv([{label:'=cmd()',value:123}],['label','value']);assert.ok(csv.includes('"\'=cmd()"'));assert.ok(csv.startsWith('\uFEFF'));
 assert.ok(toCsv([{value:-2.5}],['value']).includes('"-2.5"'));
 assert.equal(await sha256(new TextEncoder().encode('abc')),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});
