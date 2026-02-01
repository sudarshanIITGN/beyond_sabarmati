"use client";

export default function Home() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Question Explorer</title>

<style>
:root { --primary: #2563eb; --bg: #f8fafc; --text: #0f172a; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 20px; }
.container { max-width: 1300px; margin: 0 auto; }

.header { margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }

.controls {
  background: white; padding: 20px; border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.control-group { display: flex; flex-direction: column; gap: 8px; }
label { font-weight: 600; font-size: 0.8rem; color: #64748b; text-transform: uppercase; }
input, select { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; }

.table-container { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th { background: #f1f5f9; padding: 15px; text-align: left; font-size: 0.8rem; border-bottom: 2px solid #e2e8f0; }
td { padding: 20px 15px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }

.id-badge { background: #eff6ff; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold; }
.genre-badge { background: #fef3c7; color: #92400e; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; }
.context-area { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px; margin-bottom: 15px; white-space: pre-wrap; }
.question-text { font-size: 1.1rem; font-weight: 500; margin-bottom: 15px; display: block; }
.options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; }
.option-box { background: #f1f5f9; padding: 10px 15px; border-radius: 6px; border: 1px solid #e2e8f0; }

.status-msg { padding: 50px; text-align: center; font-size: 1.1rem; color: #64748b; }

@media (max-width: 768px) {
.controls {
  grid-template-columns: 1fr;
}

table, thead, tbody, th, td, tr {
 display: block;
}

thead {
  display: none;
}

tr {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 10px;
}

.options-grid {
  grid-template-columns: 1fr;
}

body {  padding: 10px;
  }
}
.table-container {
  overflow-x: auto;
}
</style>
</head>

<body>
<div class="container">

<div class="header">
<h1>Question Bank Explorer</h1>
<p>Filter and search questions (powered by Neon DB)</p>
</div>

<div class="controls">
  <div class="control-group">
    <label>Genre</label>
    <select id="genreFilter" onchange="filterData()">
      <option value="">Select a Genre...</option>
    </select>
  </div>

  <div class="control-group">
    <label>Search Text</label>
    <input id="searchText" onkeyup="filterData()" placeholder="Keyword or option..." />
  </div>

  <div class="control-group">
    <label>Question ID</label>
    <input id="searchId" onkeyup="filterData()" placeholder="ID..." />
  </div>
</div>

<div class="table-container">
<table>
<thead>
<tr>
<th>ID</th>
<th>Genre</th>
<th>Question</th>
</tr>
</thead>
<tbody id="tableBody">
<tr><td colspan="3" class="status-msg">Loading questions…</td></tr>
</tbody>
</table>
</div>

</div>

<script>
let rawData = [];

async function loadData() {
  const res = await fetch('/api/questions'); 

  rawData = await res.json();
  populateGenreFilter();
  filterData();
}

function populateGenreFilter() {
  const genres = [...new Set(rawData.map(q => q.genre).filter(Boolean))].sort();
  const sel = document.getElementById('genreFilter');
  genres.forEach(g => {
    const o = document.createElement('option');
    o.value = g;
    o.textContent = g;
    sel.appendChild(o);
  });
}

function filterData() {
  const text = document.getElementById('searchText').value.toLowerCase();
  const id = document.getElementById('searchId').value.toLowerCase();
  const genre = document.getElementById('genreFilter').value;
  const tbody = document.getElementById('tableBody');

  const filtered = rawData.filter(q => {
    const t = !text || q.question_text.toLowerCase().includes(text) || q.options.some(o => o.toLowerCase().includes(text));
    const i = !id || q.question_id.toLowerCase().includes(id);
    const g = !genre || q.genre === genre;
    return t && i && g;
  });

  tbody.innerHTML = '';

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="3" class="status-msg">No matching questions.</td></tr>';
    return;
  }

  filtered.forEach(q => {
    const row = document.createElement('tr');
    row.innerHTML = \`
      <td><span class="id-badge">\${q.question_id}</span></td>
      <td><span class="genre-badge">\${q.genre || 'General'}</span></td>
      <td>
        \${q.context ? '<div class="context-area">'+q.context+'</div>' : ''}
        <span class="question-text">\${q.question_text}</span>
        <div class="options-grid">
          \${q.options.map(o => '<div class="option-box">'+o+'</div>').join('')}
        </div>
      </td>
    \`;
    tbody.appendChild(row);
  });
}

window.onload = loadData;
</script>

</body>
</html>
        `,
      }}
    />
  );
}
