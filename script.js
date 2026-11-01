const recordings = [
  ['vayera','',819.409], ['chayei-sarah','',600.137],
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
const lectureNotes = {
  "vayera": {
    "title": "Vayera — Avraham, Sodom, and the Responsibility to Inspire Repentance",
    "slug": "montrose-vayera",
    "summary": "Rabbi Montrose examines Avraham’s prayers for Sodom through the role of righteous people in helping others return to God. He explores a possible explanation for Avraham’s renewed prayer, then discusses divine love, moral accountability, and the responsibility to influence one’s community.",
    "points": [
      "Avraham’s appeal centers on protecting the righteous and the possibility that they could inspire the city to repent.",
      "Rabbi Montrose tentatively suggests that Avraham may have felt responsible for an earlier missed opportunity to influence Sodom’s people after rescuing them.",
      "Prayer for another person’s repentance can seek circumstances that encourage spiritual growth while preserving free choice.",
      "He distinguishes God’s love for every Jew and desire for repentance from special love for the righteous; he rejects treating divine love as a guarantee against judgment.",
      "Righteous people should actively try to improve their surroundings. He highlights the idea of righteous people working within the city to influence others."
    ]
  },
  "chayei-sarah": {
    "title": "Chayei Sarah — Lavan, Religious Appearances, and Sound Judgment",
    "slug": "montrose-chayei-sarah",
    "summary": "Using Lavan’s religious language and conduct as a starting point, Rabbi Montrose warns that Torah knowledge and an impressive religious appearance do not by themselves establish trustworthy guidance. He emphasizes daas—sound judgment in applying Torah, leading others, and recognizing moral boundaries.",
    "points": [
      "Lavan could acknowledge God and offer a beautiful blessing while remaining a harmful influence; religious language alone does not prove integrity.",
      "Torah knowledge needs daas: practical understanding, sound judgment, and the ability to lead by example.",
      "He challenges treating Lavan’s older-sibling-first marriage custom as a binding rule that should prevent younger siblings from marrying.",
      "Evaluate a teacher’s conduct, reverence for God, and judgment alongside scholarship, reputation, and appearance.",
      "He distinguishes respectful disagreement about a position from public personal attacks on leading Torah scholars.",
      "A learned person who lacks sound judgment can be especially misleading because listeners may trust the person’s knowledge and religious presentation."
    ]
  }
};
const titleFor = date => lectureNotes[date] ? lectureNotes[date].title : date === 'adultery'
  ? 'A Torah Perspective on Adultery'
  : new Intl.DateTimeFormat('en', {year:'numeric', month:'long', day:'numeric', timeZone:'UTC'}).format(new Date(`${date}T12:00:00Z`));

function render() {
  const term = search.value.trim().toLowerCase();
  const visible = recordings.filter(([date]) => {
    const title = [titleFor(date), lectureNotes[date]?.summary, ...(lectureNotes[date]?.points || [])].join(' ').toLowerCase();
    return (activeYear === 'all' || date.startsWith(activeYear)) && (!term || title.includes(term) || date.includes(term));
  });
  list.innerHTML = visible.map((item, i) => {
    const [date, time, duration] = item;
    const notes = lectureNotes[date];
    const slug = notes ? notes.slug : date === 'adultery' ? 'montrose-adultery' : `${date}-${time.replaceAll(':','')}`;
    return `<article class="recording" id="${date}">
      <span class="index">${String(i + 1).padStart(2, '0')}</span>
      <div><h3>${titleFor(date)}</h3><p class="meta">${time ? `Recorded ${time} · ` : ''}${formatDuration(duration)}</p></div>
      <audio controls preload="none" aria-label="Play ${titleFor(date)}"><source src="https://github.com/nabeles666-ui/rabbi-montrose/releases/download/audio-archive/${slug}.${notes ? 'mp3' : 'm4a'}" type="${notes ? 'audio/mpeg' : 'audio/mp4'}">Your browser does not support audio playback.</audio>
      ${notes ? `<div class="lecture-notes"><p>${notes.summary}</p><h4>Main points</h4><ul>${notes.points.map(point => `<li>${point}</li>`).join('')}</ul></div>` : ''}
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
