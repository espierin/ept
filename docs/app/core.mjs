export const VERSION = '0.1.0';
export const LOCI = ['A','B','C','DRB1','DRB3-4-5','DQ','DP'];
export const TECHNIQUES = ['SAB_IGG','SAB_C1Q','SAB_C3D'];
export const VENDORS = { werfen: {name:'Werfen / Immucor', shape:'circle'}, oneLambda: {name:'One Lambda', shape:'square'} };
export class ImportError extends Error { constructor(code, detail='') { super(detail || code); this.code=code; } }
const fail = (code, detail) => {throw new ImportError(code, detail);};

// Strict RFC4180-style CSV state machine, including quoted newlines and escaped quotes.
export function parseCsv(text) {
  text=String(text).replace(/^\uFEFF/,'');
  if(text.length>20_000_000) fail('too_large');
  const rows=[]; let row=[],cell='',quoted=false,closed=false;
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(quoted) { if(c==='"') {if(text[i+1]==='"'){cell+='"';i++;}else {quoted=false;closed=true;}} else cell+=c; continue; }
    if(c==='"') {if(cell.trim() || closed) fail('csv_quotes'); quoted=true;cell='';continue;}
    if(c===',' || c==='\n' || c==='\r') {
      row.push(cell.trim());cell='';closed=false;
      if(c!==',') {if(c==='\r'&&text[i+1]==='\n')i++;rows.push(row);row=[];}
      continue;
    }
    if(closed && c.trim()) fail('csv_quotes');
    cell+=c;
  }
  if(quoted) fail('csv_quotes');
  if(cell || row.length) {row.push(cell.trim());rows.push(row);}
  if(rows.length>100_000) fail('too_many_rows');
  return rows;
}
export function parseNumeric(value) {
  if(value===undefined || value===null || String(value).trim()==='') return {value:null,status:'missing'};
  const s=String(value).trim();
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(s)) return {value:null,status:'invalid'};
  const n=Number(s);
  return Number.isFinite(n)?{value:n,status:n>0?'positive':n===0?'zero':'negative'}:{value:null,status:'invalid'};
}
export function parseXponent(text) {
  const rows=parseCsv(text);
  if(!rows.some(r=>r[0]==='Program' && /xponent/i.test(r[1]||''))) fail('not_xponent');
  const sections=new Map(), metadata={};let current=null;
  for(const row of rows) {
    if(row[0]==='DataType:') {current=row[1];if(sections.has(current))fail('duplicate_section');sections.set(current,[]);}
    else if(current) sections.get(current).push(row);
    else if(row[0] && row.length>1) metadata[row[0]]=row[1];
  }
  if(!metadata.ProtocolName)fail('missing_protocol');
  if(!sections.has('Median'))fail('missing_median');
  function section(name) {
    const input=sections.get(name)||[];
    const hi=input.findIndex(r=>r[0]==='Location'&&r[1]==='Sample');
    if(hi<0)fail('bad_section',name);
    const header=input[hi];if(new Set(header).size!==header.length)fail('duplicate_column');
    const beads=header.slice(2).filter(x=>x!=='Total Events');
    if(!beads.length || beads.some(x=>!x))fail('bad_section');
    const samples=[];const seen=new Set();
    for(const row of input.slice(hi+1)) {
      if(!row.some(Boolean))continue;
      if(row.length!==header.length)fail('row_width',`${name}: ${row[0]}`);
      const key=`${row[0]}|${row[1]}`;
      if(!row[1] || seen.has(key))fail('duplicate_sample');seen.add(key);
      samples.push({well:row[0],sample:row[1],values:Object.fromEntries(beads.map(b=>[b,parseNumeric(row[header.indexOf(b)])]))});
    }
    return {beads,samples};
  }
  const measurements={Median:section('Median')};
  if(sections.has('Net MFI'))measurements['Net MFI']=section('Net MFI');
  const counts=sections.has('Count')?section('Count'):null;
  return {adapter:'werfen-xponent-v1',vendor:'werfen',protocol:metadata.ProtocolName,metadata:{date:metadata.Date||null,batch:metadata.Batch||null},measurements,counts};
}

export function canonicalComposition(annotations) {
  const molecular=annotations.map(x=>x.trim().replace(/^HLA-/,''))
    .filter(x=>/^(?:A|B|C|DRB[1-5]|DQA1|DQB1|DPA1|DPB1)\*\d{2,3}:\d{2,3}(?::\d{2,3}){0,2}[A-Z]?$/.test(x));
  if(!molecular.length)return {plString:null,locus:null,annotations};
  const unique=[...new Set(molecular)].sort();
  const genes=unique.map(x=>x.split('*')[0]);
  const isDq=genes.length===2 && genes.includes('DQA1') && genes.includes('DQB1');
  const isDp=genes.length===2 && genes.includes('DPA1') && genes.includes('DPB1');
  const locus=isDq?'DQ':isDp?'DP':genes.every(x=>x===genes[0])?(/DRB[345]/.test(genes[0])?'DRB3-4-5':genes[0]==='DQA1'||genes[0]==='DQB1'?'DQ':genes[0]==='DPA1'||genes[0]==='DPB1'?'DP':genes[0]):'mixed';
  return {plString:unique.map(x=>'HLA-'+x).join(isDq||isDp?'~':'+'),locus,annotations,partial:(locus==='DQ'||locus==='DP')&&!isDq&&!isDp};
}
export function parseEds(text, Parser=globalThis.DOMParser) {
  if(!Parser)fail('xml_parser');
  if(text.length>5_000_000 || /<!DOCTYPE|<!ENTITY/i.test(text))fail('unsafe_xml');
  const doc=new Parser().parseFromString(text,'application/xml');
  if(doc.querySelector('parsererror'))fail('invalid_xml');
  const root=doc.documentElement;
  if(!['ev2SA1','ev2SA2'].includes(root.localName))fail('not_eds');
  const get=(node,tag)=>[...node.children].find(x=>x.localName===tag)?.textContent.trim();
  const lot=get(root,'LotID');if(!lot)fail('missing_lot');
  const beads=new Map();
  for(const node of [...doc.getElementsByTagNameNS('*','AntigenID')]) {
    const sourceId=node.getAttribute('ID');if(!sourceId||beads.has(sourceId))fail('duplicate_bead');
    const annotations=[...node.getElementsByTagNameNS('*','Antigen')].map(x=>x.textContent.trim());
    const control=annotations.length===0 && /^(NC|PC)$/i.test(sourceId);
    const composition=canonicalComposition(annotations);
    beads.set(sourceId,{sourceId,control,controlRole:control?sourceId:null,...composition});
  }
  if(!beads.size)fail('empty_eds');
  return {lot,hlaClass:root.localName==='ev2SA1'?'I':'II',beads};
}
export function combineImport(parsed,eds,{technique,quantity='Median'}={}) {
  if(!TECHNIQUES.includes(technique))fail('unknown_technique');
  if(parsed.protocol!==eds.lot)fail('lot_mismatch',`${parsed.protocol} ≠ ${eds.lot}`);
  const measurement=parsed.measurements[quantity];if(!measurement)fail('missing_quantity');
  const observations=[],issues=[];
  for(const s of measurement.samples) {
    const countSample=parsed.counts?.samples.find(x=>x.well===s.well&&x.sample===s.sample);
    for(const id of measurement.beads) {
      const bead=eds.beads.get(id);if(!bead)fail('unmapped_bead',id);
      const datum=s.values[id];
      const targetId=bead.plString?`${eds.lot}::${id}::${bead.plString}`:null;
      const row={vendor:'werfen',technique,hlaClass:eds.hlaClass,lot:eds.lot,sourceBead:id,targetId,plString:bead.plString,locus:bead.locus,sample:s.sample,well:s.well,value:datum.value,status:datum.status,count:countSample?.values[id]?.value??null,quantity,control:bead.control,annotations:bead.annotations};
      if(!bead.control&&!bead.plString)issues.push({sample:s.sample,sourceBead:id,code:'unresolved_composition'});
      if(bead.partial)issues.push({sample:s.sample,sourceBead:id,code:'partial_heterodimer'});
      observations.push(row);
    }
  }
  return {schemaVersion:1,adapter:parsed.adapter,vendor:'werfen',technique,hlaClass:eds.hlaClass,lot:eds.lot,quantity,samples:measurement.samples.map(s=>({sample:s.sample,well:s.well})),observations,issues};
}

export const CONTEXT_KEYS=['provider','schemeEdition','round','sample'];
export function validateContext(context) {
  return CONTEXT_KEYS.every(k=>typeof context[k]==='string'&&context[k].trim().length>0&&context[k].length<=120);
}
export function validateConsensus(input,context,technique,hlaClass) {
  if(!input || input.schemaVersion!==1 || input.kind!=='synthetic-provider-consensus')fail('invalid_consensus');
  if(!validateContext(context)||!CONTEXT_KEYS.every(k=>input.context?.[k]===context[k]))fail('consensus_context');
  if(input.technique!==technique||input.hlaClass!==hlaClass)fail('consensus_technique');
  if(input.officiallyReleased!==true || !/^\d{4}-\d{2}-\d{2}$/.test(input.releaseDate||'') || !input.version)fail('consensus_release');
  const date=new Date(input.releaseDate+'T00:00:00Z');
  if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==input.releaseDate||date>Date.now())fail('consensus_release');
  if(!Array.isArray(input.assignments)||input.assignments.length>10000)fail('invalid_assignments');
  const allowed=new Set(['positive','negative','no_consensus','not_assessed']);const seen=new Set();
  for(const a of input.assignments) {if(typeof a.plString!=='string'||!allowed.has(a.call)||seen.has(a.plString))fail('invalid_assignments');seen.add(a.plString);}
  return structuredClone(input);
}

// Lab IDs exist only in the analysis layer. chartPoints deliberately strips them.
export function selectReference(rows,{context,technique,hlaClass,quantity,plString,ownLab,selectedLots=null}={}) {
  const seen=new Map();
  for(const row of rows) {
    if(!CONTEXT_KEYS.every(k=>row.context?.[k]===context?.[k])||row.technique!==technique||row.hlaClass!==hlaClass||row.quantity!==quantity||row.plString!==plString||row.lab===ownLab)continue;
    if(selectedLots&&!selectedLots.includes(row.lot))continue;
    if(row.primary!==true)continue;
    const key=`${row.lab}|${row.vendor}|${row.targetId}`;
    if(seen.has(key)) {
      const prev=seen.get(key);
      if(prev.value!==row.value || prev.lot!==row.lot)fail('ambiguous_primary');
      continue;
    }
    seen.set(key,row);
  }
  return [...seen.values()];
}
export function referenceStats(rows) {
  const positive=rows.filter(x=>Number.isFinite(x.value)&&x.value>0);
  return {nLabs:new Set(rows.map(x=>x.lab)).size,nMeasurements:rows.length,nPositive:positive.length,nExcluded:rows.length-positive.length,byVendor:Object.fromEntries(Object.keys(VENDORS).map(v=>[v,rows.filter(r=>r.vendor===v).length]))};
}
export function chartPoints(rows) {return rows.filter(r=>r.value>0&&Number.isFinite(r.value)).map(r=>({value:r.value,vendor:r.vendor}));}
export function quantile(sorted,p) {if(!sorted.length)return null;const x=(sorted.length-1)*p;const i=Math.floor(x);return sorted[i]+(sorted[Math.min(i+1,sorted.length-1)]-sorted[i])*(x-i);}
export function violin(values,{domain,bandwidth=0.18,steps=100,minCount=5}={}) {
  const xs=values.filter(x=>Number.isFinite(x)&&x>0).map(Math.log10).sort((a,b)=>a-b);
  if(xs.length<minCount || xs[0]===xs.at(-1))return null;
  if(!domain || !(domain[0]>0&&domain[1]>domain[0]) || !(bandwidth>0))fail('density_config');
  const lo=Math.log10(domain[0]),hi=Math.log10(domain[1]);
  const points=Array.from({length:steps+1},(_,i)=>{
    const x=lo+(hi-lo)*i/steps;
    const density=xs.reduce((s,v)=>s+Math.exp(-0.5*((x-v)/bandwidth)**2),0)/(xs.length*bandwidth*Math.sqrt(2*Math.PI));
    return {value:10**x,density};
  });
  // Close at valid positive bounds; rendering never extrapolates below zero.
  points[0].density=0;points.at(-1).density=0;
  const peak=Math.max(...points.map(x=>x.density));
  return points.map(x=>({...x,width:x.density/peak}));
}
export function mfiDomain(values) {
  const positive=values.filter(v=>Number.isFinite(v)&&v>0);
  if(!positive.length)return [1,10000];
  const min=Math.floor(Math.log10(positive.reduce((a,b)=>Math.min(a,b),Infinity))),max=Math.ceil(Math.log10(positive.reduce((a,b)=>Math.max(a,b),0)));
  return [10**min,10**Math.max(min+1,max)];
}
export function buildSyntheticPeers(ownRows,context) {
  // This fixture is generated, not observations from other participants or other wells.
  return ownRows.flatMap((row,j)=>row.control||!row.plString||!(row.value>0)?[]:Array.from({length:18},(_,i)=>({
    ...row,lab:`synthetic-${i+1}`,context:{...context},primary:true,
    value:Math.max(0.1,Number((row.value*Math.exp(Math.sin(i*2.1+j)*0.85+Math.cos(i*0.9)*0.25)).toFixed(2)))
  })));
}
export function quoteCsv(value) {let s=String(value??'');if(typeof value==='string'&&/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function toCsv(rows,columns) {return '\uFEFF'+[columns.map(quoteCsv).join(','),...rows.map(r=>columns.map(k=>quoteCsv(r[k])).join(','))].join('\r\n');}
export function importerFor(text) {if(/xPONENT/i.test(text.slice(0,300)))return parseXponent;fail('unsupported_format');}
export async function sha256(input) {const b=await crypto.subtle.digest('SHA-256',typeof input==='string'?new TextEncoder().encode(input):input);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
