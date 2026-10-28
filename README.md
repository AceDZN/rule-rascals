# Rule Rascals · שובבים לפי הכללים

An original 3D English heist campaign for Hebrew-speaking learners, with 35 progressively more complex levels and no grade-based limit. A raccoon equips a visitor badge, uses cover and distractions, identifies a helper, unlocks a store, recovers the correct bell and completes a changed box-delivery job.

**Play locally:** [development](http://localhost:5203/) or [production preview](http://localhost:4203/), while the local servers are running. The campaign uses three original local Tripo GLBs: a raccoon with a 65-joint Mixamo skin and real idle/walk/run/carry source clips and two runtime carry composites, a watering helper and a guard. The wheeled robots move as rigid props. See [ASSETS.md](ASSETS.md) for measured files, prompts, credit use and rights. No production deployment has been made.

## Run

Node 24 and npm:

```sh
npm ci
npm run dev
```

Development uses **5203**, preview **4203**, both with `strictPort`. Never stop another project's process to free a port.

```sh
npm test
npm run build
npm run preview
```

Vercel-ready static build: import this repository, use Vite, build `npm run build`, output `dist`. `vercel.json` supplies those settings. Relative asset URLs work without a backend. Deployment remains future user work.

## Play

- WASD or arrows: move relative to the camera. Shift: run. C: sneak.
- Click a clear path: navigate around solid obstacles. Touch: drag the movement pad.
- E / action button: equip, take, unlock, request help or use the nearby service point. Choose a specific nearby object in the context selector when several are in reach.
- Q: inspect the nearby object or robot. M: open an acquired map of visited routes. G: drop cargo, leave the large bag, or ask the helper to put down its box.
- Space: toss the squeaky distraction. It has a finite cooldown.
- R: posted rules and reading support. Escape: pause/resume. F: fullscreen.
- Sound, reduced motion and restart are available in the controls/pause menu.

Time stops during rule reading, inspection, vocabulary and translation. Planning hints are available between chapter finales. Every fifth level withholds a solution hint. English text is LTR; the Hebrew shell is RTL. A system English voice can read the visible notice when speech synthesis is available; voice availability depends on the browser/OS.

The first token and the later bell must be carried out of attentive guard view. Cover, patrol timing and the squeaky toy create routes. The badge confers visitor status only. The watering robot is the actual helper. A map and trolley are optional. Helper-only arch rules require actual helper transport of the specified box; a visitor wearing a badge is still a visitor.

## Rules and evidence

Pure TypeScript content and simulation live in `src/content.ts` and `src/simulation.ts`. Rendering uses Three.js with real 3D depth, shadows, authored colliders, line-of-sight occlusion and a guard patrol/suspicion/chase/return state machine. A fixed visible inspector observes the transfer arch. Original procedural scenery is batched by material. Foreground trees and conservatory structure fade when they obstruct the player; their authored collisions and sight rules stay intact. Shared scenery footprints and dynamic bulky-prop collision keep movement and click navigation outside solid objects. Drops use free floor beside the carrier. Local GLTFLoader/AnimationMixer playback and bone sockets drive the raccoon, equipment and held cargo.

The opening five jobs practice must / mustn't / can / don't have to, conditional entry, and defining relative clauses. [CURRICULUM.md](CURRICULUM.md) maps original scenario sentences to the saved Workbook sources. Completion and language evidence are separate; supported or repeated attempts are not first unaided decisions. This game has not established learning gains or productive grammar mastery.

A minimal event log stays in this browser's `localStorage` under `rule-rascals-local-events`. It contains game actions, support and retry flags, and results; no student identity and no remote analytics. Clear site storage to remove it. There is no runtime AI, backend, account or API key.

`window.render_game_to_text()` describes current observable world state. `window.advanceTime(ms)` advances the same simulation deterministically and respects reading/pause. These are QA hooks, not win-state setters. `?deterministic=1` renders only when stepped for repeatable browser QA.

## Build evidence and art status

- [PLAYTEST.md](PLAYTEST.md): commands, browser paths and limits.
- [VISUAL_REVIEW.md](VISUAL_REVIEW.md): generated target versus actual implementation.
- [docs/evidence](docs/evidence): real browser gameplay captures.
- [docs/visual-targets](docs/visual-targets): built-in imagegen target and exact prompt, generated and inspected before implementation.
- [ASSETS.md](ASSETS.md): actual Tripo provenance, rig/clip inspection, rights and file measurements.
- [docs/ENGLISH_REVIEW.md](docs/ENGLISH_REVIEW.md): independent semantic/gameplay review.

Current semantic and physics suite: **132 passing tests**. The suite includes all 35 campaign completions through simulation interactions. Ordinary input-driven browser sessions also earned all35 levels, with save/reload/replay verified; an independent fresh run completed1–17 using the trolley. See the verification record for exact scope and outcome marks.

Three.js is MIT; bundled Heebo is OFL. License texts are included under `public/licenses/`. Original game characters, scenario text and procedural geometry are authored for this project; no existing game art is copied.

## 35-level campaign (28 October expansion)

The game now contains 35 authored levels, unlocked sequentially through ordinary completion. There is no grade selector or grade ceiling. Help, translation, mistakes and retries never block advancement. The chapter map lets players resume their next mission or replay completed ones; progress and best medals are saved locally in this browser (`rule-rascals-campaign-v2`). Reload resumes the chosen level from its beginning.

| Levels | Place | Added demands |
|---|---|---|
|1–5|Exhibition Garden|Badge, permission, optional equipment, escort, object history and helper transport|
|6–10|Glasshouse|Close description matches, indoor running rule, ordered scans and two deliveries|
|11–15|Robot Workshop|Choose wrench/brush, restore actual service points, repair before entry, combine checks and deliveries|
|16–20|Exhibition Station|Sender/receiver and before/after contrasts, different routes for different parcels|
|21–25|Museum Wing|Borrow/lend direction, original/copy, both/only and three exhibits|
|26–30|Rooftop Run|Longer temporal and ownership records, multiple certifications, three deliveries|
|31–35|Festival Night|Eleven-action combined plans with three distinct targets and reversed checkpoint routes|

Press **E at a service point** to repair, clean, scan or deliver the current task. Pick up a tool case to equip it; taking the other tool swaps them. A wrench repairs; a brush cleans. Scans belong to the actual object, and each delivery consumes that object. The helper must bring a held parcel to the service point. Seven procedural chapter themes reuse the tested solid floor plan and the three acquired character models, with different architecture/dressing/palettes. Original five-job evidence is historical; current campaign verification is recorded in PLAYTEST.md.

The full campaign browser run reached the actual level35 festival victory. Reload/replay preserves35 completed levels, and the two-cycle resource check stays bounded at202 GPU geometries. See [actual campaign evidence](docs/evidence/campaign-play/) and the [seven-theme visual review](docs/CAMPAIGN_VISUAL_REVIEW.md).
