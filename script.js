const list = document.querySelector('#recordings');
const search = document.querySelector('#search');
const count = document.querySelector('#visibleCount');
const empty = document.querySelector('#emptyState');
let activeYear = 'all';
let recordings = [];

const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const formatDuration = seconds => `${Math.max(1, Math.round(seconds / 60))} min`;

function render() {
  const term = search.value.trim().toLowerCase();
  const visible = recordings.filter(item => {
    const haystack = [item.title, item.summary, ...(item.topics || []), item.date, item.time].join(' ').toLowerCase();
    return (activeYear === 'all' || item.date.startsWith(activeYear)) && (!term || haystack.includes(term));
  });
  list.innerHTML = visible.map((item, i) => `<article class="recording" id="${escapeHtml(item.id)}">
    <span class="index">${String(i + 1).padStart(2, '0')}</span>
    <div><h3>${escapeHtml(item.title)}</h3><p class="meta">${item.time ? `Recorded ${escapeHtml(item.time)} · ` : ''}${formatDuration(item.duration)}</p></div>
    <audio controls preload="none" aria-label="Play ${escapeHtml(item.title)}"><source src="${escapeHtml(item.audio)}">Your browser does not support audio playback.</audio>
    <div class="lecture-notes">
      <p>${escapeHtml(item.summary)}</p>
      ${item.topics?.length ? `<p class="topics"><strong>Topics:</strong> ${item.topics.map(escapeHtml).join(' · ')}</p>` : ''}
      ${item.transcript ? `<p><a class="transcript-link" href="${escapeHtml(item.transcript)}">Read automated transcript →</a></p>` : ''}
      <p class="attribution">${escapeHtml(item.speakerNote || '')}</p>
    </div>
  </article>`).join('');
  count.textContent = visible.length;
  empty.hidden = visible.length !== 0;
}

search.addEventListener('input', render);
document.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filters .active').classList.remove('active');
  button.classList.add('active');
  activeYear = button.dataset.year;
  render();
}));

fetch('data/recordings.json?v=20261102')
  .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then(data => { recordings = data; render(); })
  .catch(error => {
    empty.hidden = false;
    empty.textContent = `The archive index could not be loaded (${error.message}).`;
  });
