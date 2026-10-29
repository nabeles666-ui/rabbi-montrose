const recordings = [
  ['2015-02-12','10:19:53',606.74], ['2015-02-11','09:51:53',2210.01],
  ['2015-02-05','09:46:08',493.84], ['2015-02-04','09:55:15',1316.01],
  ['2015-01-29','10:13:22',712.97], ['2015-01-28','10:29:23',15.53],
  ['2015-01-21','09:53:20',2360.33], ['2015-01-15','10:34:31',420.49],
  ['2015-01-13','10:27:02',248.27], ['2015-01-01','10:39:11',583.26],
  ['2014-12-25','10:26:00',430.45], ['2014-12-18','10:32:39',490.68],
  ['2014-12-17','09:52:10',2079.56], ['2014-11-27','10:17:19',602.65],
  ['2014-11-20','10:30:38',345.70], ['2014-11-19','09:58:36',2054.08],
  ['2014-11-13','10:36:26',365.44], ['2014-11-12','09:54:46',3039.54],
  ['2014-10-30','10:28:20',448.54], ['2014-10-29','09:51:21',2036.18],
  ['2014-09-03','09:55:24',593.85], ['2014-07-31','10:16:27',745.08],
  ['2014-07-23','09:53:25',3063.59], ['2014-07-16','09:56:57',1899.60],
  ['2014-07-09','09:50:28',1355.21], ['2014-07-03','10:05:07',1251.83],
  ['2014-05-07','09:45:04',2869.82], ['2013-11-20','09:39:43',820.92],
  ['2012-08-26','01:46:21',2167.88], ['2012-05-01','09:51:17',3610.17],
  ['2012-04-30','10:19:36',351.09], ['2012-04-30','09:43:48',1630.83],
  ['adultery','',2465.40]
];

const list = document.querySelector('#recordings');
const search = document.querySelector('#search');
const count = document.querySelector('#visibleCount');
const empty = document.querySelector('#emptyState');
let activeYear = 'all';

const formatDuration = seconds => `${Math.floor(seconds / 60)} min`;
const titleFor = date => date === 'adultery'
  ? 'A Torah Perspective on Adultery'
  : new Intl.DateTimeFormat('en', {year:'numeric', month:'long', day:'numeric', timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));

function render() {
  const term = search.value.trim().toLowerCase();
  const visible = recordings.filter(([date]) => {
    const title = titleFor(date).toLowerCase();
    return (activeYear === 'all' || date.startsWith(activeYear)) && (!term || title.includes(term) || date.includes(term));
  });
  list.innerHTML = visible.map((item, i) => {
    const [date, time, duration] = item;
    const slug = date === 'adultery' ? 'montrose-adultery' : `${date}-${time.replaceAll(':','')}`;
    return `<article class="recording">
      <span class="index">${String(i + 1).padStart(2, '0')}</span>
      <div><h3>${titleFor(date)}</h3><p class="meta">${time ? `Recorded ${time} · ` : ''}${formatDuration(duration)}</p></div>
      <audio controls preload="none" aria-label="Play ${titleFor(date)}"><source src="https://github.com/nabeles666-ui/rabbi-montrose/releases/download/audio-archive/${slug}.m4a" type="audio/mp4">Your browser does not support audio playback.</audio>
    </article>`;
  }).join('');
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
render();
