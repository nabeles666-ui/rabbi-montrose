const list = document.querySelector('#recordings');
const search = document.querySelector('#search');
const count = document.querySelector('#visibleCount');
const empty = document.querySelector('#emptyState');
let activeYear = 'all';
let recordings = [];

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const formatDuration = seconds => `${Math.max(1, Math.round((Number(seconds) || 0) / 60))} min`;
const getYear = value => String(value ?? '').match(/\b(?:19|20)\d{2}\b/)?.[0] || 'Undated';
const isVideo = url => /\.(?:mp4|mov|mkv|avi|wmv|webm|m4v|mpg|mpeg|vob|mts|m2ts)(?:\?|$)/i.test(url || '');

function normalizeLikely(item) {
  return {
    id: `likely-${item.id}`,
    date: getYear(item.path),
    time: '',
    duration: Number(item.duration_seconds) || 0,
    title: item.filename,
    summary: 'Machine transcript and summary; attribution requires human review.',
    topics: [],
    audio: item.media,
    transcript: item.transcript ? `g-raid4-likely/${item.transcript}` : null,
    summaryUrl: item.summary ? `g-raid4-likely/${item.summary}` : null,
    speakerNote: '? Likely Rabbi Montrose from filename or folder context — not human verified.',
    unverified: true
  };
}

function player(item) {
  const title = escapeHtml(item.title);
  const source = escapeHtml(item.audio);
  if (isVideo(item.audio)) {
    return `<video controls preload="none" aria-label="Play ${title}"><source src="${source}">Your browser does not support video playback.</video>`;
  }
  return `<audio controls preload="none" aria-label="Play ${title}"><source src="${source}">Your browser does not support audio playback.</audio>`;
}

function render() {
  const term = search.value.trim().toLowerCase();
  const visible = recordings.filter(item => {
    const haystack = [item.title, item.summary, ...(item.topics || []), item.date, item.time, item.speakerNote].join(' ').toLowerCase();
    const yearMatch = activeYear === 'all' || (activeYear === 'likely' ? item.unverified : item.date.startsWith(activeYear));
    return yearMatch && (!term || haystack.includes(term));
  });
  list.innerHTML = visible.map((item, i) => `<article class="recording${item.unverified ? ' unverified' : ''}" id="${escapeHtml(item.id)}">
    <span class="index">${String(i + 1).padStart(2, '0')}</span>
    <div><h3>${escapeHtml(item.title)}${item.unverified ? ' <span class="question" title="Likely attribution; not verified">?</span>' : ''}</h3><p class="meta">${item.time ? `Recorded ${escapeHtml(item.time)} · ` : ''}${formatDuration(item.duration)}</p></div>
    ${player(item)}
    <div class="lecture-notes">
      <p>${escapeHtml(item.summary)}</p>
      ${item.topics?.length ? `<p class="topics"><strong>Topics:</strong> ${item.topics.map(escapeHtml).join(' · ')}</p>` : ''}
      <p class="resource-links">${item.transcript ? `<a class="transcript-link" href="${escapeHtml(item.transcript)}" target="_blank" rel="noopener">Read transcript →</a>` : ''}${item.summaryUrl ? ` <a class="transcript-link" href="${escapeHtml(item.summaryUrl)}" target="_blank" rel="noopener">Read summary →</a>` : ''}</p>
      <p class="attribution">${escapeHtml(item.speakerNote || '')}</p>
    </div>
  </article>`).join('');
  count.textContent = visible.length;
  empty.hidden = visible.length !== 0;
}

search.addEventListener('input', render);
document.querySelectorAll('[data-year]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filters .active')?.classList.remove('active');
  button.classList.add('active');
  activeYear = button.dataset.year;
  render();
}));
document.addEventListener('play', event => {
  if (!['AUDIO', 'VIDEO'].includes(event.target.tagName)) return;
  document.querySelectorAll('audio, video').forEach(media => { if (media !== event.target) media.pause(); });
}, true);

Promise.all([
  fetch('data/recordings.json?v=20261102').then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }),
  fetch('g-raid4-likely/catalog.json?v=20261109').then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
]).then(([curated, likely]) => {
  recordings = [...curated.map(item => ({...item, unverified: false})), ...likely.map(normalizeLikely)];
  render();
}).catch(error => {
  empty.hidden = false;
  empty.textContent = `The archive index could not be loaded (${error.message}).`;
});
