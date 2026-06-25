# LLM Knowledge Animation

Interactive animated explainer — *How LLMs Work* — covering pre-training, fine-tuning, RLHF, inference, KV cache, and context windows.

**Live**: https://skarin7.github.io/llm-knowledge-animation/

---

## Project structure

| File | Purpose |
|------|---------|
| `index.html` | Self-contained animation — **edit this for most changes** |
| `animations.jsx` | JSX source used by the design-canvas dev workflow |
| `LLM Knowledge.dc.html` | Design-canvas dev entrypoint (loads `animations.jsx` live) |
| `support.js` | Design-canvas runtime (compiled, do not edit) |
| `capture-video.js` | Puppeteer script to export animation as MP4 |

---

## Run locally

No build step needed. Open directly in browser:

```bash
# Option A — double-click index.html, OR:
python3 -m http.server 8080
# then open http://localhost:8080
```

Controls: `Space` play/pause · `←` `→` seek · `Shift+←/→` seek 1s · `0` reset

---

## Edit the animation

All animation code lives in the `<script id="jsx-src">` block inside `index.html`.
Babel runs in-browser — no compile step, just edit and refresh.

**Quick edit workflow:**
1. Open `index.html` in a text editor
2. Find the scene function you want to change (search `// ══`)
3. Edit, save, refresh browser
4. Run `./deploy.sh` when done

**Scene timing map:**

| Scene | Time (s) |
|-------|----------|
| Title | 0 – 4.2 |
| Roadmap | 4.2 – 7.2 |
| LLM Definition | 7.2 – 11.5 |
| Data & Companies | 11.5 – 18 |
| Stage 1 Pre-training | 18 – 56 |
| Stage 2 Fine-tuning | 56 – 90 |
| Stage 3 RLHF | 90 – 108 |
| Stage 4 Inference | 108 – 140 |
| KV Cache | 140 – 162 |
| Context Window | 162 – 178 |
| Recap | 178 – 188 |

> When adding scenes, update `duration={N}` on the `<Stage>` component and `<TopBar end={N-2}/>`

---

## Deploy to GitHub Pages

```bash
./deploy.sh
```

Live in ~30 seconds at https://skarin7.github.io/llm-knowledge-animation/

---

## Export as MP4 video

### Setup (one-time)
```bash
npm install        # installs puppeteer-core
```

### Generate video
```bash
node capture-video.js
```

Output: `~/llm_knowledge_video.mp4` (1280×720, H.264, ~3 min to capture)

The script:
- Launches headless Chrome with a fake RAF clock (no real-time wait)
- Captures every frame at 30 fps
- Encodes with ffmpeg (must be installed: `sudo apt install ffmpeg`)

**Requirements**: `ffmpeg`, `google-chrome`, `node >= 18`

---

## Design-canvas dev workflow (advanced)

If you have the design-canvas tool:
1. Open `LLM Knowledge.dc.html` in browser — it hot-reloads `animations.jsx`
2. Edit `animations.jsx` directly
3. Export → overwrites `index.html`
4. Run `./deploy.sh`
