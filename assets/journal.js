(() => {
  'use strict';
  const base = document.body.dataset.journalBase || '';
  const key = 'thea:ribbon:v1:' + base;
  const status = (message) => document.querySelectorAll('[data-bookmark-status]').forEach(node => { node.textContent = message; });
  const validBookmark = (value) => {
    if (!value || value.version !== 1 || typeof value.path !== 'string' || typeof value.title !== 'string' || !Number.isFinite(value.position) || value.position < 0) return null;
    try {
      const url = new URL(value.path, location.origin);
      if (url.origin !== location.origin || url.search || url.hash || !url.pathname.startsWith(base + '/entries/') || url.pathname === base + '/entries/') return null;
      return {version: 1, path: url.pathname, title: value.title, position: value.position};
    } catch { return null; }
  };
  let bookmark = null;
  try { bookmark = validBookmark(JSON.parse(localStorage.getItem(key))); } catch { /* Storage may be unavailable or malformed. */ }
  const ribbon = document.querySelector('[data-bookmark-return]');
  if (ribbon && bookmark) {
    const link = ribbon.querySelector('[data-bookmark-link]');
    link.href = bookmark.path + '?resume=1';
    link.textContent = 'Return to my bookmark: ' + bookmark.title;
    ribbon.hidden = false;
  }
  const clear = document.querySelector('[data-bookmark-clear]');
  if (clear) clear.addEventListener('click', () => {
    try {
      localStorage.removeItem(key);
      bookmark = null;
      ribbon.hidden = true;
      status('Your bookmark has been removed.');
    } catch { status('This browser could not remove the bookmark. You can clear it in your browser’s site data settings.'); }
  });
  const entry = document.querySelector('[data-diary-entry]');
  if (entry) {
    document.querySelectorAll('[data-bookmark-tools]').forEach(node => { node.hidden = false; });
    document.querySelectorAll('[data-bookmark-save]').forEach(button => button.addEventListener('click', () => {
      const value = {version: 1, path: location.pathname, title: entry.dataset.entryTitle, position: Math.max(0, window.scrollY)};
      try {
        localStorage.setItem(key, JSON.stringify(value));
        bookmark = value;
        status('Ribbon placed. Return from the journal index in this browser.');
      } catch { status('This browser cannot save your ribbon. Use your browser’s bookmark command to keep this entry.'); }
    }));
    const current = new URL(location.href);
    if (current.searchParams.get('resume') === '1') {
      current.searchParams.delete('resume');
      history.replaceState(null, '', current.pathname + current.search + current.hash);
      if (bookmark && bookmark.path === location.pathname) {
        const restore = () => requestAnimationFrame(() => requestAnimationFrame(() => {
          window.scrollTo(0, Math.min(bookmark.position, Math.max(0, document.documentElement.scrollHeight - window.innerHeight)));
          status('Returned to your ribbon bookmark.');
        }));
        if (document.fonts) document.fonts.ready.then(restore); else restore();
      }
    }
  }
  const search = document.querySelector('[data-journal-search]');
  if (search) {
    search.hidden = false;
    const input = search.querySelector('input');
    const rows = [...document.querySelectorAll('[data-entry-title]')];
    input.addEventListener('input', () => {
      const query = input.value.trim().toLocaleLowerCase();
      let count = 0;
      rows.forEach(row => {
        row.hidden = !row.dataset.entryTitle.toLocaleLowerCase().includes(query);
        if (!row.hidden) count++;
      });
      document.querySelectorAll('[data-chapter]').forEach(chapter => {
        chapter.hidden = ![...chapter.querySelectorAll('[data-entry-title]')].some(row => !row.hidden);
      });
      search.querySelector('[data-search-status]').textContent = query ? (count ? count + (count === 1 ? ' entry found.' : ' entries found.') : 'No entries match that title.') : '';
    });
  }
})();
