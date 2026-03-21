// PHAR parsing/building notes:
// - Stub ends with "__HALT_COMPILER(); ?>" + CRLF (we tolerate LF/null when parsing).
// - Manifest field offsets (little-endian): len[4], count[4], api[2], flags[4],
//   aliasLen[4], alias, metaLen[4], meta, then per-file entries:
//   nameLen[4], name, uncSize[4], mtime[4], compSize[4], crc32[4], flags[4], metaLen[4], meta.
// - File data follows manifest; order matches entries.
// - For ZIP -> PHAR we set: api=0x0011, flags=0, no alias/meta, no compression, crc32 manual,
//   signature type 0x00000001 + 20 zero bytes + "GBMB".

(() => {
  const unifiedZone = document.getElementById('unifiedZone');
  const unifiedInput = document.getElementById('unifiedInput');
  const statusUnified = document.getElementById('statusUnified');
  const barUnified = document.getElementById('barUnified');
  const listUnified = document.getElementById('listUnified');
  const footerUnified = document.getElementById('footerUnified');

  const baseName = (name) => name.replace(/\.[^/.]+$/, '');

  const escapeHtml = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const setStatus = (el, text, type = 'info') => {
    el.classList.toggle('error', type === 'error');
    el.classList.toggle('success', type === 'success');
    const label = type === 'error' ? 'Error' : type === 'success' ? 'Done' : 'Status';
    el.innerHTML = `<span class="label">${label}</span> ${escapeHtml(text)}`;
  };

  const setProgress = (barEl, pct) => {
    barEl.style.width = `${pct}%`;
  };

  const resetProgressSoon = (barEl, ms = 1200) => {
    setTimeout(() => {
      barEl.style.width = '0%';
    }, ms);
  };

  // CRC32
  const crcTable = (() => {
    const tab = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      tab[i] = c >>> 0;
    }
    return tab;
  })();
  const crc32 = (u8) => {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < u8.length; i++) crc = crcTable[(crc ^ u8[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  };

  // ============ PHAR → ZIP ============
  function findStubEnd(u8) {
    const marker = '__HALT_COMPILER(); ?>';
    const text = new TextDecoder().decode(u8);
    const idx = text.indexOf(marker);
    if (idx < 0) return -1;
    let end = idx + marker.length;
    if (text[end] === '\r' && text[end + 1] === '\n') end += 2;
    else if (text[end] === '\n') end += 1;
    if (text[end] === '\u0000') end += 1;
    return end;
  }
  const readUtf8 = (u8, start, len) => new TextDecoder().decode(u8.slice(start, start + len));

  function parseManifest(u8, manifestOffset) {
    const dv = new DataView(u8.buffer);
    const manifestLen = dv.getUint32(manifestOffset, true);
    const fileCount = dv.getUint32(manifestOffset + 4, true);
    const apiVersion = dv.getUint16(manifestOffset + 8, true);
    const globalFlags = dv.getUint32(manifestOffset + 10, true);
    let cursor = manifestOffset + 14;
    const aliasLen = dv.getUint32(cursor, true); cursor += 4;
    const alias = readUtf8(u8, cursor, aliasLen); cursor += aliasLen;
    const globalMetaLen = dv.getUint32(cursor, true); cursor += 4 + globalMetaLen;

    const entries = [];
    for (let i = 0; i < fileCount; i++) {
      const nameLen = dv.getUint32(cursor, true); cursor += 4;
      const name = readUtf8(u8, cursor, nameLen); cursor += nameLen;
      const uncompressed = dv.getUint32(cursor, true); cursor += 4;
      const mtime = dv.getUint32(cursor, true); cursor += 4;
      const compressed = dv.getUint32(cursor, true); cursor += 4;
      const crc = dv.getUint32(cursor, true); cursor += 4;
      const flags = dv.getUint32(cursor, true); cursor += 4;
      const metaLen = dv.getUint32(cursor, true); cursor += 4 + metaLen;
      entries.push({ name, uncompressed, compressed, flags, mtime });
    }
    // In PHAR spec, manifestLen includes the length field itself; so data starts at manifestOffset + manifestLen.
    const dataStart = manifestOffset + 4 + manifestLen;
    return { entries, dataStart, globalFlags, apiVersion, alias };
  }

  function decompressEntry(entry, bytes) {
    const compression = entry.flags & 0xF000;
    if (compression === 0x1000) {
      try { return pako.inflate(bytes); }
      catch { return pako.inflateRaw(bytes); }
    }
    if (compression === 0x2000) throw new Error('BZip2 compression is not supported.');
    return bytes;
  }

  async function parsePharToZip(arrayBuffer) {
    const u8 = new Uint8Array(arrayBuffer);
    const stubEnd = findStubEnd(u8);
    if (stubEnd < 0) throw new Error('PHAR stub marker "__HALT_COMPILER(); ?>" not found.');

    const { entries, dataStart } = parseManifest(u8, stubEnd);
    let dataPtr = dataStart;
    const zip = new JSZip();
    for (const entry of entries) {
      const end = dataPtr + entry.compressed;
      if (end > u8.length) throw new Error('Unexpected end of file while reading data.');
      const slice = u8.slice(dataPtr, end);
      dataPtr = end;
      const content = decompressEntry(entry, slice);
      const date = entry.mtime ? new Date(entry.mtime * 1000) : undefined;
      zip.file(entry.name, content, { binary: true, date });
    }
    return zip;
  }

  function isZipMagic(u8) {
    return u8.length >= 4 && u8[0] === 0x50 && u8[1] === 0x4B &&
      (u8[2] === 0x03 && u8[3] === 0x04 ||
        u8[2] === 0x05 && u8[3] === 0x06 ||
        u8[2] === 0x07 && u8[3] === 0x08);
  }

  async function detectFormat(file) {
    const n = file.name.toLowerCase();
    if (n.endsWith('.phar')) return 'phar';
    if (n.endsWith('.zip')) return 'zip';

    const head = new Uint8Array(await file.slice(0, Math.min(8, file.size)).arrayBuffer());
    if (isZipMagic(head)) return 'zip';

    const buf = await file.arrayBuffer();
    if (findStubEnd(new Uint8Array(buf)) >= 0) return 'phar';

    return null;
  }

  function renderFileList(title, paths) {
    if (!paths.length) {
      listUnified.textContent = '';
      return;
    }
    const wrap = document.createElement('div');
    const strong = document.createElement('strong');
    strong.textContent = title;
    wrap.appendChild(strong);
    wrap.appendChild(document.createElement('br'));
    paths.forEach((p, i) => {
      wrap.appendChild(document.createTextNode(p));
      if (i < paths.length - 1) wrap.appendChild(document.createElement('br'));
    });
    listUnified.innerHTML = '';
    listUnified.appendChild(wrap);
  }

  async function handlePhar(file) {
    listUnified.innerHTML = '';
    footerUnified.textContent = '';
    setProgress(barUnified, 0);
    setStatus(statusUnified, 'Reading PHAR...');
    const buffer = await file.arrayBuffer();
    setProgress(barUnified, 20);
    try {
      const zip = await parsePharToZip(buffer);
      const names = Object.keys(zip.files).filter((k) => !zip.files[k].dir).sort();
      renderFileList('Files in PHAR:', names);

      setStatus(statusUnified, 'Packaging ZIP...');
      setProgress(barUnified, 70);
      const blob = await zip.generateAsync({ type: 'blob' });
      setProgress(barUnified, 100);
      saveAs(blob, `${baseName(file.name)}.zip`);
      setStatus(statusUnified, 'ZIP downloaded.', 'success');
      footerUnified.textContent = '';
      resetProgressSoon(barUnified);
    } catch (err) {
      setStatus(statusUnified, err.message || String(err), 'error');
      footerUnified.textContent = 'If the PHAR uses BZip2 compression, it is not supported.';
      listUnified.innerHTML = '';
      setProgress(barUnified, 0);
    }
  }

  // ============ ZIP → PHAR ============
  const PHAR_STUB = "<?php\n// PocketMine-MP Plugin\n__HALT_COMPILER(); ?>\r\n";

  async function zipToPhar(zip) {
    const files = [];
    zip.forEach((relPath, entry) => { if (!entry.dir) files.push(entry); });
    if (!files.length) throw new Error('ZIP contains no files.');

    const fileData = [];
    for (const f of files) {
      const data = new Uint8Array(await f.async('uint8array'));
      const crc = crc32(data);
      fileData.push({
        name: f.name,
        data,
        size: data.length,
        crc,
        mtime: f.date ? Math.floor(f.date.getTime() / 1000) : Math.floor(Date.now() / 1000)
      });
    }

    const enc = new TextEncoder();
    const preLen = 4 /* count */ + 2 /* api */ + 4 /* flags */ + 4 /* aliasLen */ + 4 /* metaLen */;
    let manifestBodyLen = preLen;
    for (const f of fileData) manifestBodyLen += 28 + enc.encode(f.name).length;
    const manifestBuf = new ArrayBuffer(4 + manifestBodyLen);
    const dv = new DataView(manifestBuf);
    let offset = 0;
    dv.setUint32(offset, manifestBodyLen, true); offset += 4;
    dv.setUint32(offset, fileData.length, true); offset += 4;
    dv.setUint16(offset, 0x0011, true); offset += 2;
    dv.setUint32(offset, 0x00000000, true); offset += 4;
    dv.setUint32(offset, 0, true); offset += 4; // aliasLen
    dv.setUint32(offset, 0, true); offset += 4; // metadataLen

    for (const f of fileData) {
      const nameBytes = enc.encode(f.name);
      dv.setUint32(offset, nameBytes.length, true); offset += 4;
      new Uint8Array(manifestBuf, offset, nameBytes.length).set(nameBytes); offset += nameBytes.length;
      dv.setUint32(offset, f.size, true); offset += 4;
      dv.setUint32(offset, f.mtime, true); offset += 4;
      dv.setUint32(offset, f.size, true); offset += 4; // compressed size (none)
      dv.setUint32(offset, f.crc, true); offset += 4;
      dv.setUint32(offset, 0x00000000, true); offset += 4; // flags
      dv.setUint32(offset, 0, true); offset += 4; // per-file metadata len
    }

    const dataLen = fileData.reduce((s, f) => s + f.size, 0);
    const dataBuf = new Uint8Array(dataLen);
    let dOff = 0;
    for (const f of fileData) { dataBuf.set(f.data, dOff); dOff += f.size; }

    const sigBuf = new ArrayBuffer(4 + 20 + 4);
    const sigDv = new DataView(sigBuf);
    sigDv.setUint32(0, 0x00000001, true);
    const magic = new Uint8Array(sigBuf, 24, 4); magic.set([0x47, 0x42, 0x4D, 0x42]); // GBMB

    const blob = new Blob([
      enc.encode(PHAR_STUB),
      manifestBuf,
      dataBuf,
      sigBuf
    ], { type: 'application/octet-stream' });

    const parsedZip = await parsePharToZip(await blob.arrayBuffer());
    const parsedCrcs = {};
    await Promise.all(Object.keys(parsedZip.files).map(async (name) => {
      const zf = parsedZip.files[name];
      if (zf.dir) return;
      const data = new Uint8Array(await zf.async('uint8array'));
      parsedCrcs[name] = crc32(data);
    }));
    let matched = 0;
    for (const f of fileData) if (parsedCrcs[f.name] === f.crc) matched++;

    return { blob, fileData, matched, total: fileData.length };
  }

  async function handleZip(file) {
    setProgress(barUnified, 0);
    setStatus(statusUnified, 'Reading ZIP...');
    listUnified.innerHTML = '';
    footerUnified.textContent = '';
    const buffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);

    const items = [];
    zip.forEach((path, entry) => { if (!entry.dir) items.push(path); });
    items.sort();
    renderFileList('Files in ZIP:', items);

    setProgress(barUnified, 30);
    try {
      setStatus(statusUnified, 'Building PHAR manifest...');
      const { blob, matched, total } = await zipToPhar(zip);
      setProgress(barUnified, 80);
      setStatus(statusUnified, 'Writing file data...');
      setProgress(barUnified, 100);
      saveAs(blob, `${baseName(file.name)}.phar`);
      setStatus(statusUnified, 'PHAR downloaded.', 'success');
      footerUnified.textContent = `CRC32 check after repack: ${matched}/${total} files matched.`;
      resetProgressSoon(barUnified);
    } catch (err) {
      setStatus(statusUnified, err.message || String(err), 'error');
      setProgress(barUnified, 0);
    }
  }

  const handleUnified = async (file) => {
    if (!file) return;
    const mode = await detectFormat(file);
    if (mode === 'phar') return handlePhar(file);
    if (mode === 'zip') return handleZip(file);
    setStatus(statusUnified, 'Could not detect format. Use a .phar or .zip extension, or a valid ZIP/PHAR file.', 'error');
    setProgress(barUnified, 0);
    listUnified.innerHTML = '';
    footerUnified.textContent = '';
  };

  let dragDepth = 0;
  const attachDZ = (zone, input, handler) => {
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        input.click();
      }
    });
    zone.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dragDepth++;
      zone.classList.add('drag');
    });
    zone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dragDepth = Math.max(0, dragDepth - 1);
      if (!dragDepth) zone.classList.remove('drag');
    });
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      dragDepth = 0;
      zone.classList.remove('drag');
      void handler(e.dataTransfer.files[0]);
    });
    input.addEventListener('change', (e) => {
      const f = e.target.files[0];
      input.value = '';
      void handler(f);
    });
  };

  attachDZ(unifiedZone, unifiedInput, handleUnified);
})();
