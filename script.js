const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

// Blog / updates feed
const postsGrid = document.getElementById('posts-grid');
const postsEmpty = document.getElementById('posts-empty');

function escapeHtml(value = '') {
  return value.replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[ch]));
}

function renderPosts(posts) {
  if (!postsGrid) return;
  postsGrid.innerHTML = '';
  if (!posts.length) {
    if (postsEmpty) postsEmpty.hidden = false;
    return;
  }
  if (postsEmpty) postsEmpty.hidden = true;

  posts.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(post => {
    const card = document.createElement('article');
    card.className = 'post-card reveal visible';
    const image = post.image
      ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}">`
      : '';
    const paragraphs = escapeHtml(post.content || '').split(/\n+/).filter(Boolean)
      .map(p => `<p>${p}</p>`).join('');
    card.innerHTML = `
      ${image}
      <div class="post-card-body">
        <div class="post-date">${new Date(post.date).toLocaleDateString(undefined, {year:'numeric', month:'short', day:'numeric'})}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <div class="post-content">${paragraphs}</div>
      </div>
    `;
    postsGrid.appendChild(card);
  });
}

if (postsGrid) {
  fetch('posts.json', { cache: 'no-store' })
    .then(r => r.ok ? r.json() : [])
    .then(data => renderPosts(Array.isArray(data) ? data : []))
    .catch(() => renderPosts([]));
}
