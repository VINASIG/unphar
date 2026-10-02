// Classic script: no PHP stub or serialized metadata is executed.
(() => {
  const limits = Object.freeze({
    input: 32 * 1024 * 1024,
    expanded: 32 * 1024 * 1024,
    entry: 16 * 1024 * 1024,
    count: 2000,
    ratio: 200,
  });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const marker = encoder.encode('__HALT_COMPILER();');
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }

  /** @param {Uint8Array} bytes */
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes)
      crc = (table[(crc ^ byte) & 0xff] ?? 0) ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  /** @param {string} name */
  function safePath(name) {
    if (
      !name ||
      encoder.encode(name).length > 4096 ||
      /^[a-z]:/i.test(name) ||
      name.includes('\\') ||
      Array.from(name).some(
        (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
      ) ||
      name.split('/').some((part) => !part || part === '.' || part === '..')
    )
      throw new Error(
        'The archive contains an unsafe or unsupported file path.',
      );
    return name;
  }

  /** @param {Uint8Array<ArrayBuffer>} bytes */
  function reader(bytes) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    /** @param {number} offset @param {number} size */
    const check = (offset, size) => {
      if (
        !Number.isSafeInteger(offset) ||
        !Number.isSafeInteger(size) ||
        offset < 0 ||
        size < 0 ||
        offset + size > bytes.length
      )
        throw new Error('The archive is truncated or has an invalid length.');
    };
    return {
      /** @param {number} offset */
      u16(offset) {
        check(offset, 2);
        return view.getUint16(offset, true);
      },
      /** @param {number} offset */
      u32(offset) {
        check(offset, 4);
        return view.getUint32(offset, true);
      },
      /** @param {number} offset @param {number} size */
      slice(offset, size) {
        check(offset, size);
        return bytes.slice(offset, offset + size);
      },
      check,
    };
  }

  /** @param {Uint8Array} bytes */
  function stubEnd(bytes) {
    // Byte offsets remain correct when a PHP stub contains multibyte text.
    for (
      let i = 0;
      i <= Math.min(bytes.length - marker.length, 1024 * 1024);
      i++
    ) {
      if (!marker.every((byte, index) => bytes[i + index] === byte)) continue;
      let end = i + marker.length;
      while (bytes[end] === 32 || bytes[end] === 9) end++;
      if (bytes[end] === 63 && bytes[end + 1] === 62) {
        end += 2;
        if (bytes[end] === 13 && bytes[end + 1] === 10) end += 2;
        else if (bytes[end] === 10) end++;
      }
      return end;
    }
    throw new Error('This is not a supported native PHAR archive.');
  }

  /** @param {string} algorithm @param {Uint8Array<ArrayBuffer>} bytes */
  async function hash(algorithm, bytes) {
    try {
      return new Uint8Array(await crypto.subtle.digest(algorithm, bytes));
    } catch {
      throw new Error(
        'PHAR signatures need a secure browser context. Open this site over HTTPS or on localhost.',
      );
    }
  }

  /** @param {number} size @param {number} compressed @param {number} total */
  function checkSize(size, compressed, total) {
    if (
      size > limits.entry ||
      total > limits.expanded ||
      (size > 1024 * 1024 && size > Math.max(compressed, 1) * limits.ratio)
    )
      throw new Error(
        'The expanded archive exceeds the safe processing limits.',
      );
  }

  /** @param {Uint8Array<ArrayBuffer>} raw @param {number} size @param {boolean} compressed @param {number} crc */
  function unpack(raw, size, compressed, crc) {
    let data = raw;
    if (compressed) {
      const inflater = new pako.Inflate({ raw: true, chunkSize: 64 * 1024 });
      /** @type {Uint8Array[]} */
      const chunks = [];
      let inflated = 0;
      inflater.onData = (chunk) => {
        inflated += chunk.length;
        if (inflated > size || inflated > limits.entry)
          throw new Error('The compressed entry exceeds its declared size.');
        chunks.push(chunk);
      };
      inflater.push(raw, true);
      if (inflater.err) throw new Error('The archive deflate data is damaged.');
      data = new Uint8Array(inflated);
      let at = 0;
      for (const chunk of chunks) {
        data.set(chunk, at);
        at += chunk.length;
      }
    }
    if (data.length !== size || crc32(data) !== crc)
      throw new Error('An archive file failed its size or CRC32 check.');
    return data;
  }

  /** @param {Uint8Array<ArrayBuffer>} bytes @returns {Promise<ArchiveEntry[]>} */
  async function parsePhar(bytes) {
    if (bytes.length > limits.expanded + 10 * 1024 * 1024)
      throw new Error('The archive exceeds the safe processing limits.');
    const source = reader(bytes);
    const start = stubEnd(bytes);
    const manifestLength = source.u32(start);
    if (manifestLength > 1024 * 1024)
      throw new Error('The PHAR manifest exceeds its 1 MB format limit.');
    const end = start + 4 + manifestLength;
    source.check(start + 4, manifestLength);
    const manifest = reader(source.slice(start + 4, manifestLength));
    const count = manifest.u32(0);
    if (!count || count > limits.count)
      throw new Error('Choose an archive with 1 to 2,000 files.');
    if (manifest.u16(4) !== 0x0011)
      throw new Error('This PHAR API version is not supported.');
    const flags = manifest.u32(6);
    if (flags & 0x0000f000)
      throw new Error('Whole-archive compression is not supported.');
    let cursor = 10;
    const aliasLength = manifest.u32(cursor);
    cursor += 4;
    manifest.check(cursor, aliasLength);
    cursor += aliasLength;
    const metaLength = manifest.u32(cursor);
    cursor += 4;
    manifest.check(cursor, metaLength);
    cursor += metaLength;
    const names = new Set();
    const records = [];
    let total = 0;
    for (let i = 0; i < count; i++) {
      const nameLength = manifest.u32(cursor);
      cursor += 4;
      const rawName = decoder.decode(manifest.slice(cursor, nameLength));
      cursor += nameLength;
      const directory = rawName.endsWith('/');
      const name = safePath(directory ? rawName.slice(0, -1) : rawName);
      if (names.has(name))
        throw new Error('The archive contains duplicate file paths.');
      names.add(name);
      const size = manifest.u32(cursor);
      const mtime = manifest.u32(cursor + 4);
      const compressed = manifest.u32(cursor + 8);
      const crc = manifest.u32(cursor + 12);
      const entryFlags = manifest.u32(cursor + 16);
      const metadataLength = manifest.u32(cursor + 20);
      cursor += 24;
      manifest.check(cursor, metadataLength);
      cursor += metadataLength;
      total += size;
      checkSize(size, compressed, total);
      if (directory && (size || compressed))
        throw new Error('Invalid PHAR directory entry.');
      records.push({
        name,
        size,
        mtime,
        compressed,
        crc,
        compression: entryFlags & 0x0000f000,
        directory,
      });
    }
    if (cursor !== manifestLength)
      throw new Error('The PHAR manifest length does not match its entries.');
    let dataEnd = end;
    for (const entry of records) {
      source.check(dataEnd, entry.compressed);
      dataEnd += entry.compressed;
    }
    if (flags & 0x00010000) {
      if (decoder.decode(source.slice(bytes.length - 4, 4)) !== 'GBMB')
        throw new Error('The PHAR signature is missing.');
      const kind = source.u32(bytes.length - 8);
      const signature =
        kind === 2
          ? { algorithm: 'SHA-1', length: 20 }
          : kind === 3
            ? { algorithm: 'SHA-256', length: 32 }
            : kind === 4
              ? { algorithm: 'SHA-512', length: 64 }
              : null;
      if (!signature)
        throw new Error('This PHAR signature type is not supported.');
      if (dataEnd !== bytes.length - signature.length - 8)
        throw new Error('Invalid PHAR signature length.');
      const expected = source.slice(dataEnd, signature.length);
      const actual = await hash(signature.algorithm, bytes.slice(0, dataEnd));
      if (!actual.every((byte, index) => byte === expected[index]))
        throw new Error('The PHAR signature does not match its contents.');
    } else if (dataEnd !== bytes.length)
      throw new Error('The unsigned PHAR contains unexpected trailing data.');
    /** @type {ArchiveEntry[]} */
    const entries = [];
    let offset = end;
    for (const entry of records) {
      const raw = source.slice(offset, entry.compressed);
      offset += entry.compressed;
      if (entry.compression === 0x2000)
        throw new Error('BZip2-compressed PHAR files are not supported.');
      if (entry.compression && entry.compression !== 0x1000)
        throw new Error('This PHAR compression is not supported.');
      const data = unpack(
        raw,
        entry.size,
        entry.compression === 0x1000,
        entry.crc,
      );
      if (!entry.directory)
        entries.push({ name: entry.name, data, mtime: entry.mtime });
    }
    if (!entries.length) throw new Error('The archive contains no files.');
    return entries;
  }

  /** @param {ArchiveEntry[]} entries */
  async function buildPhar(entries) {
    if (!entries.length || entries.length > limits.count)
      throw new Error('Choose an archive with 1 to 2,000 files.');
    const names = new Set();
    let total = 0;
    let manifestLength = 18;
    const files = entries.map((entry) => {
      const name = encoder.encode(safePath(entry.name));
      if (names.has(entry.name))
        throw new Error('The archive contains duplicate file paths.');
      names.add(entry.name);
      total += entry.data.length;
      checkSize(entry.data.length, entry.data.length, total);
      if (
        !Number.isInteger(entry.mtime) ||
        entry.mtime < 0 ||
        entry.mtime > 0xffffffff
      )
        throw new Error('A file has an unsupported timestamp.');
      manifestLength += 28 + name.length;
      return { ...entry, name };
    });
    const stub = encoder.encode('<?php __HALT_COMPILER(); ?>\r\n');
    if (manifestLength > 1024 * 1024)
      throw new Error('The PHAR manifest exceeds its 1 MB format limit.');
    const unsigned = new Uint8Array(stub.length + 4 + manifestLength + total);
    const view = new DataView(unsigned.buffer);
    unsigned.set(stub);
    let offset = stub.length;
    /** @param {number} value */
    const u32 = (value) => {
      view.setUint32(offset, value, true);
      offset += 4;
    };
    u32(manifestLength);
    u32(files.length);
    view.setUint16(offset, 0x0011, true);
    offset += 2;
    u32(0x00010000);
    u32(0);
    u32(0);
    for (const entry of files) {
      u32(entry.name.length);
      unsigned.set(entry.name, offset);
      offset += entry.name.length;
      u32(entry.data.length);
      u32(entry.mtime);
      u32(entry.data.length);
      u32(crc32(entry.data));
      u32(0x000001a4);
      u32(0); // Regular file permissions 0644, no metadata/compression.
    }
    for (const entry of files) {
      unsigned.set(entry.data, offset);
      offset += entry.data.length;
    }
    const digest = await hash('SHA-256', unsigned);
    const signed = new Uint8Array(unsigned.length + 40);
    signed.set(unsigned);
    signed.set(digest, unsigned.length);
    new DataView(signed.buffer).setUint32(unsigned.length + 32, 3, true);
    signed.set(encoder.encode('GBMB'), unsigned.length + 36);
    const verified = await parsePhar(signed);
    if (verified.length !== entries.length)
      throw new Error('The generated PHAR failed verification.');
    return signed;
  }

  /** @param {Uint8Array<ArrayBuffer>} bytes @returns {Promise<ArchiveEntry[]>} */
  async function readZip(bytes) {
    if (bytes.length > limits.input)
      throw new Error('Choose an archive up to 32 MB.');
    const source = reader(bytes);
    let end = -1;
    for (
      let i = bytes.length - 22;
      i >= Math.max(0, bytes.length - 65557);
      i--
    ) {
      if (
        source.u32(i) === 0x06054b50 &&
        i + 22 + source.u16(i + 20) === bytes.length
      ) {
        end = i;
        break;
      }
    }
    if (end < 0) throw new Error('This ZIP is damaged or incomplete.');
    const count = source.u16(end + 10);
    const centralLength = source.u32(end + 12);
    const centralStart = source.u32(end + 16);
    let cursor = centralStart;
    if (
      source.u16(end + 4) ||
      source.u16(end + 6) ||
      source.u16(end + 8) !== count ||
      count === 0xffff ||
      centralLength === 0xffffffff ||
      cursor === 0xffffffff
    )
      throw new Error('Split archives and ZIP64 are not supported.');
    if (!count || count > limits.count)
      throw new Error('Choose an archive with 1 to 2,000 entries.');
    if (cursor + centralLength !== end)
      throw new Error('The ZIP directory has an invalid length.');
    let total = 0;
    const names = new Set();
    const records = [];
    for (let i = 0; i < count; i++) {
      if (source.u32(cursor) !== 0x02014b50)
        throw new Error('The ZIP directory is damaged.');
      const flags = source.u16(cursor + 8);
      if (flags & 1) throw new Error('Encrypted ZIP files are not supported.');
      const method = source.u16(cursor + 10);
      if (method !== 0 && method !== 8)
        throw new Error('This ZIP compression is not supported.');
      const crc = source.u32(cursor + 16);
      const compressed = source.u32(cursor + 20);
      const expanded = source.u32(cursor + 24);
      const nameLength = source.u16(cursor + 28);
      const extraLength = source.u16(cursor + 30);
      const commentLength = source.u16(cursor + 32);
      const name = decoder.decode(source.slice(cursor + 46, nameLength));
      const directory = name.endsWith('/');
      const normalized = safePath(directory ? name.slice(0, -1) : name);
      if (names.has(normalized))
        throw new Error('The archive contains duplicate file paths.');
      names.add(normalized);
      total += expanded;
      checkSize(expanded, compressed, total);
      const local = source.u32(cursor + 42);
      if (
        source.u32(local) !== 0x04034b50 ||
        source.u16(local + 8) !== method ||
        source.u16(local + 6) !== flags
      )
        throw new Error('The ZIP headers do not match.');
      if (
        !(flags & 8) &&
        (source.u32(local + 18) !== compressed ||
          source.u32(local + 22) !== expanded ||
          source.u32(local + 14) !== crc)
      )
        throw new Error('The ZIP sizes or checksums do not match.');
      const localNameLength = source.u16(local + 26);
      if (decoder.decode(source.slice(local + 30, localNameLength)) !== name)
        throw new Error('The ZIP file paths do not match.');
      const dataOffset = local + 30 + localNameLength + source.u16(local + 28);
      source.check(dataOffset, compressed);
      if (dataOffset + compressed > centralStart)
        throw new Error('ZIP file data overlaps its directory.');
      const date = source.u16(cursor + 14);
      const time = source.u16(cursor + 12);
      // ZIP DOS timestamps have no timezone. Use UTC consistently with JSZip's writer.
      const mtime = Math.floor(
        Date.UTC(
          1980 + (date >>> 9),
          ((date >>> 5) & 15) - 1,
          date & 31,
          time >>> 11,
          (time >>> 5) & 63,
          (time & 31) * 2,
        ) / 1000,
      );
      records.push({
        name: normalized,
        directory,
        expanded,
        compressed,
        method,
        crc,
        dataOffset,
        mtime,
      });
      cursor += 46 + nameLength + extraLength + commentLength;
      source.check(cursor, 0);
    }
    if (cursor !== end)
      throw new Error('The ZIP entry count does not match its directory.');
    /** @type {ArchiveEntry[]} */
    const entries = [];
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    for (const entry of records) {
      const data = unpack(
        source.slice(entry.dataOffset, entry.compressed),
        entry.expanded,
        entry.method === 8,
        entry.crc,
      );
      if (entry.directory && data.length)
        throw new Error('Invalid ZIP directory entry.');
      if (!entry.directory)
        entries.push({
          name: entry.name,
          data,
          mtime: Math.max(0, entry.mtime),
        });
    }
    if (!entries.length) throw new Error('The archive contains no files.');
    return entries;
  }

  /** @param {Uint8Array<ArrayBuffer>} bytes @returns {Promise<ArchiveResult>} */
  async function convert(bytes) {
    if (bytes.length > limits.input)
      throw new Error('Choose an archive up to 32 MB.');
    if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
      const entries = await readZip(bytes);
      return {
        bytes: await buildPhar(entries),
        names: entries.map((entry) => entry.name),
        format: 'phar',
      };
    }
    const entries = await parsePhar(bytes);
    const zip = new JSZip();
    for (const entry of entries)
      zip.file(entry.name, entry.data, {
        date: new Date(entry.mtime * 1000),
        createFolders: false,
      });
    return {
      bytes: new Uint8Array(await zip.generateAsync({ type: 'uint8array' })),
      names: entries.map((entry) => entry.name),
      format: 'zip',
    };
  }
  Object.defineProperty(globalThis, 'Unphar', {
    value: Object.freeze({
      limits,
      crc32,
      safePath,
      parsePhar,
      buildPhar,
      readZip,
      convert,
    }),
  });
})();
