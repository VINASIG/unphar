(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  /** @type {string | null} */
  let saved = null;
  try {
    saved = window.localStorage.getItem('vinasig-theme');
  } catch {
    /* Storage can be unavailable. */
  }
  function applyTheme() {
    const dark = saved === 'dark' || (saved !== 'light' && system.matches);
    root.dataset['theme'] = dark ? 'dark' : 'light';
    for (const source of document.querySelectorAll('[data-brand-logo] source'))
      source.setAttribute('media', dark ? 'all' : 'not all');
    if (toggle instanceof HTMLButtonElement) {
      const label =
        root.lang === 'vi'
          ? dark
            ? 'Chuyển sang giao diện sáng'
            : 'Chuyển sang giao diện tối'
          : dark
            ? 'Switch to light theme'
            : 'Switch to dark theme';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
      toggle.setAttribute('aria-pressed', String(dark));
    }
  }
  if (toggle instanceof HTMLButtonElement) {
    toggle.addEventListener('click', () => {
      saved = root.dataset['theme'] === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem('vinasig-theme', saved);
      } catch {
        /* The choice still applies to this page. */
      }
      applyTheme();
    });
    applyTheme();
    toggle.disabled = false;
  }
  system.addEventListener('change', applyTheme);
  window.addEventListener('storage', (event) => {
    if (event.key === 'vinasig-theme') {
      saved = event.newValue;
      applyTheme();
    }
  });
})();

const languageLink = document.querySelector('.language-switch');
if (languageLink instanceof HTMLAnchorElement) {
  const alternatePage = languageLink.href;
  const keepSection = () => {
    const target = new URL(alternatePage);
    target.hash = window.location.hash;
    languageLink.href = target.href;
  };
  keepSection();
  window.addEventListener('hashchange', keepSection);
}
