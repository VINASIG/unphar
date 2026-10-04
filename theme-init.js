(() => {
  let saved = null;
  try {
    saved = window.localStorage.getItem('vinasig-theme');
  } catch {
    /* Preferences remain optional. */
  }
  document.documentElement.dataset['theme'] =
    saved === 'light' || saved === 'dark'
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
})();
