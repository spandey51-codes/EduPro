// ── Custom cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .course-card, .instructor-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.background = 'var(--gold)';
    ring.style.opacity = '0.9';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    ring.style.opacity = '0.5';
  });
});

// ── Courses data ──
const courses = [
  { id:1, cat:'design', emoji:'🎨', c1:'#4a1a6b', c2:'#c44ab5', badge:'Bestseller', category:'UI/UX Design', name:'Advanced UI/UX Design System', lessons:42, hours:28, price:'$89', old:'$149' },
  { id:2, cat:'dev', emoji:'⚡', c1:'#1a3a6b', c2:'#4a90c4', badge:'New', category:'Web Development', name:'React 19 & TypeScript Mastery', lessons:68, hours:45, price:'$99', old:'$179' },
  { id:3, cat:'data', emoji:'🧠', c1:'#1a5a3a', c2:'#4a9c6b', badge:'Popular', category:'Machine Learning', name:'ML Engineering with Python', lessons:55, hours:38, price:'$109', old:'$199' },
  { id:4, cat:'dev', emoji:'☁️', c1:'#3a1a1a', c2:'#c44a4a', badge:'Hot', category:'Cloud & DevOps', name:'AWS & Kubernetes in Practice', lessons:38, hours:24, price:'$79', old:'$139' },
  { id:5, cat:'data', emoji:'📊', c1:'#1a2a5a', c2:'#4a6ac4', badge:'', category:'Data Science', name:'Data Analysis & Visualization', lessons:46, hours:31, price:'$69', old:'$119' },
  { id:6, cat:'design', emoji:'✏️', c1:'#4a3a1a', c2:'#c49a4a', badge:'Trending', category:'Product Design', name:'Figma: Design Systems at Scale', lessons:33, hours:21, price:'$59', old:'$99' },
];

let activeFilter = 'all';

function renderCourses(filter) {
  const grid = document.getElementById('coursesGrid');
  const filtered = filter === 'all' ? courses : courses.filter(c => c.cat === filter);
  grid.innerHTML = filtered.map(c => `
    <div class="course-card" data-cat="${c.cat}">
      <div class="course-thumb" style="--c1:${c.c1};--c2:${c.c2}">
        <div class="course-thumb-overlay"></div>
        <span class="course-thumb-icon">${c.emoji}</span>
        ${c.badge ? `<span class="course-badge">${c.badge}</span>` : ''}
      </div>
      <div class="course-body">
        <div class="course-cat">${c.category}</div>
        <div class="course-name">${c.name}</div>
        <div class="course-meta">
          <span>📚 ${c.lessons} lessons</span>
          <span>⏱ ${c.hours}h</span>
          <span>⭐ 4.9</span>
        </div>
        <div class="course-footer">
          <div class="course-price"><span class="old">${c.old}</span>${c.price}</div>
          <button class="enroll-btn" onclick="enrollClick(this)">Enroll →</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCourses(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('coursesGrid');
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(10px)';
  setTimeout(() => {
    renderCourses(cat);
    grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
  }, 200);
}

function enrollClick(btn) {
  const orig = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.background = 'var(--sage)';
  btn.style.borderColor = 'var(--sage)';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 2000);
}

renderCourses('all');

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i % 4) * 0.1 + 's';
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── Count-up animation ──
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const isDecimal = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;
    el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

// ── Smooth active nav link ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--cream)' : '';
  });
});
