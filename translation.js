// translation.js
const s = document.strings || {};
function setText(id, key){
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = (s[key] !== undefined) ? s[key] : key;
}

setText('str-scan-overview','scan_overview');
setText('str-exit','exit');
setText('str-save','save');
setText('str-stop','stop');
setText('str-next-line','next_line');
setText('str-data','data');
