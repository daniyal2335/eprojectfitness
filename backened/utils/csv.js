export const toCSV = (rows=[])=>{
  if(!rows.length) return '';
  const cols = Object.keys(rows[0]).filter(k => k !== '__v');
  const esc = (v)=> `"${String(v??'').replace(/"/g,'""')}"`;
  const head = cols.join(',');
  const body = rows.map(r => cols.map(c => esc(r[c])).join(',')).join('\n');
  return head+'\n'+body;
};
