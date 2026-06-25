#!/usr/bin/env node
/**
 * Captures LLM Knowledge Bundle animation as MP4.
 *
 * Setup (one-time):
 *   cd "/home/shankar/Downloads/LLM Knowledge automation"
 *   npm install puppeteer-core
 *
 * Run:
 *   node capture-video.js
 *
 * Output: ~/llm_knowledge_video.mp4
 */

const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const HTML_FILE = path.resolve(__dirname, 'LLM Knowledge Bundle.html');
const OUTPUT    = path.join(process.env.HOME, 'llm_knowledge_video.mp4');
const FRAME_DIR = '/tmp/llm_frames';
const FPS       = 30;
const DURATION  = 188;   // seconds — must match Stage duration in HTML

async function main() {
  fs.mkdirSync(FRAME_DIR, { recursive: true });

  console.log('Launching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
    defaultViewport: { width: 1280, height: 764 },  // 720 canvas + 44 playbar
  });

  const page = await browser.newPage();

  // Inject fake RAF + clear stored playhead — must happen BEFORE page load
  await page.evaluateOnNewDocument(() => {
    try { localStorage.setItem('llmvideo2:t', '0'); } catch {}

    let callbacks = new Map();
    let nextId    = 1;
    let fakeClock = 0;

    window.requestAnimationFrame = (cb) => {
      const id = nextId++;
      callbacks.set(id, cb);
      return id;
    };

    window.cancelAnimationFrame = (id) => {
      callbacks.delete(id);
    };

    // Advance all pending RAF callbacks by deltaMs
    window.__tick = (deltaMs) => {
      fakeClock += deltaMs;
      const ts  = fakeClock;
      const cbs = [...callbacks.values()];
      callbacks.clear();
      nextId = 1;
      for (const cb of cbs) cb(ts);
    };
  });

  console.log('Loading page (fetching React, fonts…)');
  await page.goto(`file://${HTML_FILE.replace(/ /g, '%20')}`, {
    waitUntil: 'networkidle0',
    timeout: 90_000,
  });

  // Let React fully mount and first frame render
  await new Promise(r => setTimeout(r, 3000));

  const hasTick = await page.evaluate(() => typeof window.__tick === 'function');
  if (!hasTick) throw new Error('RAF override failed — recheck evaluateOnNewDocument timing');

  // Locate the 1280×720 animation canvas div for clean cropping (no playbar)
  const clip = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find(
      d => d.style.width === '1280px' && d.style.height === '720px'
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left * 1.0, y: Math.max(0, r.top) * 1.0, width: 1280.0, height: 720.0 };
  });
  console.log('Canvas clip region:', clip || 'not found — will capture full viewport');

  const totalFrames = Math.ceil(DURATION * FPS);
  const deltaMs     = 1000 / FPS;
  console.log(`\nCapturing ${totalFrames} frames @ ${FPS} fps (${DURATION}s)…\n`);
  const wallStart = Date.now();

  for (let i = 0; i < totalFrames; i++) {
    // Step animation by one frame
    await page.evaluate((d) => window.__tick(d), deltaMs);
    // Flush React state updates (microtask + one macrotask)
    await page.evaluate(() => new Promise(r => setTimeout(r, 0)));

    const screenshotOpts = {
      path: path.join(FRAME_DIR, `frame_${String(i).padStart(6, '0')}.jpg`),
      type: 'jpeg',
      quality: 95,
    };
    if (clip) screenshotOpts.clip = clip;
    await page.screenshot(screenshotOpts);

    if (i > 0 && i % 300 === 0) {
      const elapsed  = (Date.now() - wallStart) / 1000;
      const capFps   = i / elapsed;
      const remaining = Math.round((totalFrames - i) / capFps);
      console.log(`  ${i}/${totalFrames} frames — ${capFps.toFixed(1)} cap-fps, ~${remaining}s left`);
    }
  }

  await browser.close();

  console.log('\nEncoding MP4…');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAME_DIR}/frame_%06d.jpg" ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow ` +
    `-movflags +faststart "${OUTPUT}"`,
    { stdio: 'inherit' }
  );

  execSync(`rm -rf "${FRAME_DIR}"`);
  console.log(`\nDone — ${OUTPUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
