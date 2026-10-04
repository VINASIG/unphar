(() => {
  const vietnamese = document.documentElement.lang === 'vi';
  /** @template {HTMLElement} T @param {string} id @param {{new (...args: never[]): T}} type @returns {T} */
  function element(id, type) {
    const node = document.getElementById(id);
    if (!(node instanceof type))
      throw new Error(`Missing interface element: ${id}`);
    return node;
  }
  const choose = element('choose-file', HTMLButtonElement);
  const input = element('archive-input', HTMLInputElement);
  const status = element('conversion-status', HTMLElement);
  const progress = element('conversion-progress', HTMLProgressElement);
  const contents = element('archive-contents', HTMLElement);
  const summary = element('contents-summary', HTMLElement);
  const list = element('file-list', HTMLElement);
  const output = element('download-result', HTMLElement);
  const download = element('download-file', HTMLAnchorElement);
  const filename = element('selected-filename', HTMLElement);
  let busy = false;
  let objectUrl = '';
  let dragDepth = 0;
  /** @param {string} text @param {'info' | 'success' | 'error'} [kind] */
  function announce(text, kind = 'info') {
    status.dataset['state'] = kind;
    status.textContent = UnpharCopy.translate(text);
  }
  /** @param {File | undefined} file */
  async function handle(file) {
    if (!file || busy) return;
    busy = true;
    choose.disabled = true;
    input.disabled = true;
    choose.classList.remove('drag');
    progress.hidden = false;
    progress.removeAttribute('value');
    contents.hidden = true;
    output.hidden = true;
    filename.textContent = file.name;
    list.replaceChildren();
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = '';
    }
    announce('Reading and checking your archive...');
    try {
      if (file.size > Unphar.limits.input)
        throw new Error('Choose an archive up to 32 MB.');
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 0);
        });
      });
      const result = await Unphar.convert(
        new Uint8Array(await file.arrayBuffer()),
      );
      for (const name of result.names.sort()) {
        const item = document.createElement('li');
        item.textContent = name;
        list.append(item);
      }
      summary.textContent = vietnamese
        ? `Nội dung tệp nén - ${String(result.names.length)} tệp`
        : `Archive contents - ${String(result.names.length)} ${result.names.length === 1 ? 'file' : 'files'}`;
      contents.hidden = false;
      const stem = file.name.replace(/\.(?:phar|zip)$/i, '') || 'archive';
      const outputName = `${stem}.${result.format}`;
      objectUrl = URL.createObjectURL(
        new Blob([result.bytes], {
          type:
            result.format === 'zip'
              ? 'application/zip'
              : 'application/octet-stream',
        }),
      );
      download.href = objectUrl;
      download.download = outputName;
      download.textContent = vietnamese
        ? `Tải lại ${result.format.toUpperCase()}`
        : `Download ${result.format.toUpperCase()} again`;
      output.hidden = false;
      announce(
        vietnamese
          ? `${outputName} đã sẵn sàng. Đã kiểm tra ${String(result.names.length)} tệp. Kết quả sẽ tự động tải xuống.`
          : `${outputName} is ready. ${String(result.names.length)} ${result.names.length === 1 ? 'file' : 'files'} checked. Your download will start automatically.`,
        'success',
      );
      download.click();
    } catch (error) {
      announce(
        error instanceof Error
          ? error.message
          : 'This archive could not be converted. Try another file.',
        'error',
      );
    } finally {
      busy = false;
      choose.disabled = false;
      input.disabled = false;
      input.value = '';
      progress.hidden = true;
    }
  }
  choose.addEventListener('click', () => {
    input.click();
  });
  input.addEventListener('change', () => {
    void handle(input.files?.[0]);
  });
  choose.addEventListener('dragenter', (event) => {
    event.preventDefault();
    if (busy) return;
    dragDepth++;
    choose.classList.add('drag');
  });
  choose.addEventListener('dragleave', (event) => {
    event.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) choose.classList.remove('drag');
  });
  choose.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (event.dataTransfer)
      event.dataTransfer.dropEffect = busy ? 'none' : 'copy';
  });
  choose.addEventListener('drop', (event) => {
    event.preventDefault();
    dragDepth = 0;
    choose.classList.remove('drag');
    void handle(event.dataTransfer?.files[0]);
  });
  window.addEventListener('pagehide', () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  });
})();
