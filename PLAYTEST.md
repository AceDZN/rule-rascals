# Verification record

26 October 2026, local desktop. This record separates semantic checks, browser play and unfulfilled asset requirements. Final regressions confirm a visible large bag is reported by the fixed inspector, its distraction expires, and capture recovery leaves a single bag at the safe entrance. No test injects a level win or replaces authoritative state.

## Automated checks

- `npm test`: **31 / 31** semantic cases pass (28 independent-review cases plus three final inspector/recovery regressions). Cases cover obligation/equipment, both optional choices, scope of doorway prohibition, live helper identity/proximity, actual cover, observed subjects, key function, varied object history, role exclusivity, cargo-specific transport evidence, wrong-delivery decisions, unseen-breach scoring, pause, recovery, distraction and the new bell-carry sight condition.
- `npm run typecheck` and `npm run build`: pass. A normal Vite chunk-size advisory remains for the Three.js bundle; it is not a build error.
- Vite dev is on 5203; static production preview on 4203. Both use strictPort. The production preview returned the actual bundled game.

## Actual browser paths

Playwright used ordinary pointer/keyboard/touch inputs and the public deterministic time hook. The browser never sets simulation state. For efficient capture during the initially overloaded host, continuous RAF was paused, then `window.advanceTime(ms)` drove the same simulation. A normal, continuously running production page was separately measured below.

| Path | Observed result / capture |
| --- | --- |
| All five jobs sequentially | Badge → token → exit; optional map job; observe/ask watering robot → escorted store token → exit; inspect keys → unlock → inspect histories → carry correct bell with distraction → exit; leave bag outside → identify box → request helper transport through arch → final exit. Full run passed with zero page errors. |
| Optional map | Lead completed map-taken branch and opened the paused visited-route map; independent reviewer completed map-skipped branch. Both lawful wins. `02-optional-map-success.png`, `02-no-map-success.png`, `02-visited-route-map.png`. |
| Optional trolley | Full progression completed once without trolley and once with trolley. The same authorized helper transports the correct box in both; the trolley never grants visitor role permission. `05-helper-handoff.png`, `05-transfer-success.png`. The worn backpack and its dropped outside state are also captured in `05-large-bag-worn.png` / `05-large-bag-left-outside.png`. |
| Escort | Actual watering robot follows through the physical doorway; current player/helper positions satisfy the live condition. Sweeper identity rejected in semantic test. `03-escort-carry.png`, `03-escort-success.png`. |
| Bell decision and stealth | Key and two bell histories inspected through Q, door unlocked through E, appropriate bell carried; squeak creates a finite distraction. Replayed after the attentive-guard carrying prohibition was added. `04-bell-carry.png`, `04-bell-success.png`. |
| Observed mistake → catch → recovery | Independent reviewer walked unbadged into patrol view. Badge violation at t=6.40, catch at t=7.12. Retry returned playable spawn with retries=1; badge equip remained usable. `observed-violation-caught.png`. |
| Paused planning help | H opened reading support and marked assisted. Advancing five seconds preserved t=7.15 exactly. `paused-hint.png`. |
| Mobile 390×844 | Full HUD and controls fit without document overflow. Actual touch equipped badge; dpad moved (-9,8) to (-6.25,6.47); sneak toggled; pause preserved t=1.07. `mobile-play.png`, `mobile-pause.png`. |
| Desktop settings / restart | Ordinary controls verified pause/resume, reduced-motion toggle, mute toggle, fullscreen on/off and restart back to intro with retries=1. Zero page errors. `restarted.png`. |
| Resize / reading | Real desktop and mobile layouts, paused notice/inspection, visited-route map and success sheets visually inspected. Controls use physical `event.code`, so movement is independent of Hebrew keyboard characters. |

Curated screenshots are in `docs/evidence/`; generated design art is separately in `docs/visual-targets/`. `docs/ENGLISH_REVIEW.md` records the independent review. Browser runs' local text/console data are kept under ignored `work/`, not shipped as application data.

## Skill client

The required installed `develop-web-game/scripts/web_game_playwright_client.js` was invoked repeatedly. Its hard-coded continuous SwiftShader launch initially timed out on this busy desktop. `scripts/run-skill-native.mjs` imports that **unchanged client** and adapts launch flags to native Metal and transport timeouts. `?deterministic=1` renders on the normal `advanceTime` hook, avoiding continuous redraw between actions. The client's rules-sheet and actual gameplay capture/state outputs completed and were visually inspected. The gameplay state shows badge=true, player movement, mode=play and the equip event; no client error file was emitted. `docs/evidence/skill-client-gameplay.png` is its real canvas capture.

```sh
node scripts/run-skill-native.mjs \
  --url 'http://localhost:5203/?deterministic=1' \
  --click-selector '#start-btn' \
  --actions-json '{"steps":[{"buttons":["left_mouse_button"],"frames":1,"mouse_x":640,"mouse_y":549},{"buttons":[],"frames":1},{"buttons":["left_mouse_button"],"frames":1,"mouse_x":1210,"mouse_y":683},{"buttons":["right"],"frames":12}]}' \
  --iterations 1 --pause-ms 100 --screenshot-dir work/skill-native-gameplay
```

Supplemental full-flow runner:

```sh
npx playwright install chromium
node scripts/qa-browser.cjs
node scripts/qa-browser.cjs --trolley
node scripts/qa-controls.cjs
```

If using a preinstalled compatible Playwright library, set `RULE_RASCALS_BROWSER_LIB` to its module directory. `RULE_RASCALS_URL` overrides the dev/preview URL. On this machine the installed skill's Playwright was used because the project's newer Playwright browser revision was absent. No user Chrome profile/session was accessed by these isolated test browsers.

## Measured production performance

Normal continuous gameplay, native Metal headless Chromium, **1280×800, DPR 1**, five-second sample:

- 602 animation frames in 5008.1 ms: **120.2 fps**; game HUD hook reported 117 fps.
- Encoded resource bodies: **233,361 bytes** across JS, CSS and requested local fonts, plus the small HTML document. The sampled JS response was 156,468 encoded bytes.
- Production build: final main JS about 605 kB raw / 158 kB build gzip estimate; CSS about 19 kB raw. Total dist was under 1 MB before later documentation-only files. The generated target and evidence images are repository documentation, not runtime downloads.
- Zero page errors in full progression and the measured production run.

The continuous performance sample preceded the last small backpack/control/recovery corrections. These are local desktop measurements, not a low-end phone benchmark, a sustained minimum, or a loading guarantee. `node scripts/qa-performance.cjs` can repeat the preview measurement. It expects preview running first.

## Limits and remaining work

**The requested Tripo asset/rig acceptance is unfulfilled.** No signed-in Chrome/CUA control is available. No Tripo GLBs, skin joints, walk/run/carry clips or provenance can be truthfully reported. See `ASSETS.md`; original procedural rigid-part characters are a prototype fallback.

No production URL has been deployed; localhost URLs require the running local servers. No classroom test has established fun, six-to-ten-minute duration, accessibility across assistive devices, or learning gains. Automated routes are fast and exclude reading time. System speech synthesis depends on installed English voices; actual spoken output and all browser/OS voice combinations were not audited. Fullscreen/mute/reduced-motion/restart controls passed the desktop smoke; they were not exhaustively tested across devices. The conservatory structure can partly obscure the player, and the art remains much simpler than the generated target. These limits are not marked complete by passing rule tests.
