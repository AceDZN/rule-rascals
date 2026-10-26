# Assets, provenance and animation verification

26 October 2026. Three original Tripo models were generated through the user's signed-in Chrome and normally exported to local GLBs. The raccoon has an actual 65-joint Mixamo skin with idle, walk, run and custom carry animation. The guard and watering helper are fixed wheeled mechanical props, intentionally moved as rigid bodies. Runtime models and embedded textures are local; Tripo is not contacted by the game.

The lead was the sole Chrome operator on this resumed pass, using its own **🦝 Rule Rascals** tab/group and the shared atomic native-UI lock. My Assets was inspected before generation; no matching owned raccoon/garden robot was listed. No other crew's task was cancelled or changed. There was no purchase, upgrade, unexpected agreement, raw API, token extraction or alternative model service. The asset helper inspected downloaded files and used isolated test browsers without the user's Chrome profile.

## Runtime files

| File | Bytes | SHA-256 | Actual contents |
|---|---:|---|---|
| `public/models/raccoon.glb` | 1,922,172 | `dc7d36505d15c069c3ef5b56f9273e891220c6a05a16c84c57775ac640fbba09` | One skinned mesh, 65 Mixamo joints, four actual clips, embedded 1K JPEG maps |
| `public/models/watering-helper.glb` | 990,732 | `ea7c05b9130cad840c078e2ec977f0618bcc9a7fe8f5d56a10e0279bbdcc995d` | One fixed rigid mesh/material, no skin or clips by design, embedded 1K maps |
| `public/models/guard.glb` | 957,180 | `626399cc0731d47f54987d6727a2e08c52ca834c447533d4373d4df195f3038a` | One fixed rigid mesh/material, no skin or clips by design, embedded 1K maps |

**Model total: 3,870,084 bytes (3.87 MB decimal / 3.69 MiB).** Each model is below the 3 MB target. The three source exports were copied unchanged into runtime paths: original and runtime bytes/hashes match. No geometry/texture optimization was needed. These are model-body measurements, not a claim about the entire initial application download; the lead measures the production bundle separately against the 20 MB target. Model GET responses were checked against local bytes/hashes.

Original exports are retained in ignored `work/models-original/`. The earlier static raccoon base (1,092,012 bytes, SHA-256 `29100bf2a5da4e273ffd19f88cb3073951149046c01a51300accd933b3064935`) and interim idle export (1,708,164 bytes, SHA-256 `7173ade2713bedfd022d7b520f0192ef24421d8e39b367f6b5214756c0718004`) are superseded, are not initial runtime downloads and are not claimed as the final four-clip file.

## Source tasks and observed credits

| Operation | Task / UI result | Displayed cost and confirmed balance |
|---|---|---|
| Raccoon original, generation 1/3 | [Task 3bc68067-2954-4d62-b535-93de36cb34ca](https://studio.tripo3d.ai/workspace/generate/3bc68067-2954-4d62-b535-93de36cb34ca). HD / text / H3.1 Best Quality / Geometry & Texture; T-Pose enabled. | 30 credits; 6,735 → 6,705 |
| Chosen raccoon auto-rig | Humanoid / Mixamo. Actual exported skeleton subsequently verified. | 20 credits; 6,585 → 6,565 |
| Watering helper original, generation 2/3 | [Task aee61bab-8a06-42c3-a164-7cdc2581b223](https://studio.tripo3d.ai/workspace/generate/aee61bab-8a06-42c3-a164-7cdc2581b223). Completed; exported normally as GLB with 1K textures. | 30 credits; 6,565 → 6,535 |
| Guard original, generation 3/3 | [Task 56691c09-1875-47a8-9312-aa28108b3035](https://studio.tripo3d.ai/workspace/generate/56691c09-1875-47a8-9312-aa28108b3035). HD/H3.1 Geometry & Texture, T-Pose off; completed. | 30 credits; 6,535 → 6,505 |
| Raccoon custom Text Motion | Five-second request, UI title **Walking in Place with Box**, applied to the chosen raccoon; actual export verified below. | 20 credits; 6,505 → 6,485 |

Observed costs attributable to this crew total **130 credits**. The shared account had unrelated use between observations; account-wide balance changes are not treated as this crew's cost. No additional displayed preset-retargeting charge was reported. The three-model allowance is exhausted; chosen-character rig/motion processing is separate. The bell and other small props remain original authored geometry; no fourth model was generated.

Acquisition records: `docs/asset-evidence/raccoon-generation-2026-10-26.txt` and `robot-generations-2026-10-26.txt`. The normal final raccoon export selected all four animations, skeleton enabled, stay-in-place, GLB and 1K textures. No face rig is used or claimed.

## Exact submitted model prompts

### Raccoon

Rule Rascals original game mascot, single full-body biped raccoon with a yellow neck scarf and small utility belt, friendly cheeky expression, clean separated limbs in a neutral T pose, stylized hand-painted game-ready mesh, sturdy paws and ringed tail clear of legs, clear dark eye mask and rounded ears, facing forward, no badge no tools held no base no scenery no text, suitable for humanoid auto-rig and full-body idle walk run carry animation.

### Watering helper — 377 characters

Rule Rascals original friendly garden helper robot, small cream enamel cylindrical body on two sturdy dark wheels, jade-green reservoir and fixed watering spout, simple warm face screen, compact playful silhouette, stylized hand-painted game-ready prop, no articulated limbs, facing forward, no base no scenery no text, suitable for rigid-body movement through a sunlit garden.

### Guard — 405 characters

Rule Rascals original garden exhibition guard robot, cream enamel barrel body on two sturdy dark wheels, tomato red cap and red chest panel, dark face screen with two warm round eyes, fixed small whistle on chassis, compact stern but funny silhouette, stylized hand-painted game-ready prop, no arms no articulated limbs, facing forward, no base no scenery no text, suitable for rigid-body patrol movement.

### Custom carry motion

Walk slowly in place in a seamless loop while carrying a small box at chest height with both hands. Keep both forearms forward and steady, elbows bent, palms facing up. Short careful alternating footsteps, upright torso, no jumping, no turning, no prop geometry. Start and finish in the same carrying pose.

## Rights basis

The actual signed-in pricing UI showed **Pro · Your Plan**, **12,000 Monthly Credits** and **Private Models · Commercial Use**. `docs/asset-evidence/tripo-pro-plan.png` preserves the observation. No subscription change was made.

The inputs were original commissioned text, without a discovered third-party mesh or existing character reference. Tripo's [commercial-use guide](https://www.tripo3d.ai/help/privacy-policy/how-to-use-tripo-models-commercially) supports game use and distribution of paid-user outputs. [Terms §5.2.2](https://www.tripo3d.ai/terms) describes paid-user output rights including modification, publication, distribution and licensing, subject to the agreement. The verified paid plan, original inputs and those official sources are the recorded basis for placing these outputs in the authorized public repository.

## Geometry, materials and normalization

| Model | Source size X × Y × Z | Game height / yaw | Exported geometry |
|---|---|---|---|
| Raccoon | 0.996521 × 1.000000 × 0.769042 | 1.7 m; front +Z, yaw 0 | 12,089 attribute vertices, 19,754 triangles; 65-joint skin |
| Watering helper | 0.811157 × 1.000000 × 0.956421 | 1.5 m; screen/spout +Z, yaw 0 | 12,261 attribute vertices, 19,091 triangles |
| Guard | 0.846802 × 1.000000 × 0.622986 | 1.5 m; eyes/whistle +Z, yaw 0 | 11,585 attribute vertices, 18,694 triangles |

Feet/wheels are at Y=0 within floating-point tolerance. All models have unit-length vertex normals and no negative world scale. Embedded textures are 1024×1024; base color loads as sRGB, normal and roughness/metalness maps as linear data. Original PBR materials render coherently and are preserved. UI vertex/face counts can differ slightly from exported attribute/index counts; the table uses inspected runtime GLB data.

## Actual raccoon clips and playback

| Intended state | Exact exported name | Duration | Channels |
|---|---|---:|---:|
| Run | `run` | 1.25 s | 195 |
| Walk | `walk` | 2.333333 s | 195 |
| Idle | `idle` | 15.333333 s | 195 |
| Carry | `"Walk slowly in place in a seamless loop while carrying a small "` | 4.958333 s | 195 |

The carry name is **63 characters and ends in U+0020 (a space)**. The quotes in the table delimit the name; they are not part of it. Binary JSON preserves the exact string. Runtime joint names are sanitized by Three.js: use `mixamorigSpine2` / `mixamorigRightHand`, not raw GLB names containing a colon.

The actual four-clip file was played in an isolated Three.js browser and visually inspected. Run, walk and carry each changed 22 bone transforms in the sampled intervals; the earlier idle check changed 51. Captures show actual skin deformation and alternating steps. The generated carry motion is usable as a **low waist/lower-chest carry**, with bent forearms forward; it does not precisely achieve the prompt's high, steady two-hand chest pose. No hand IK or perfect object-contact claim is made.

Tripo's stay-in-place export retained different constant initial horizontal hips positions between clips. `src/model-assets.ts` clones clips in memory and aligns only each observed `mixamorigHips.position` track's initial X/Z to that bone's actual bind X/Z. Y and all relative motion are preserved; original GLB bytes remain unchanged. The run correction was X −0.024063 / Z +0.423438 source units (about 0.72 m of initial forward offset at game scale).

An actual **idle → walk → run → carry** adapter test passed: initial hips X/Z match bind within 1e-6, actor/collider origin stays fixed, and the final browser run records zero page errors. Full elapsed simulation time is advanced in substeps rather than truncated. A translated/rotated actor test also placed a visible cube through the scene's exact hand-socket setup: the grip and actual right-hand bone world positions agree within 3e-15. The latest real token-carry gameplay capture was independently reopened and confirms the earlier detached appearance is resolved.

## Evidence and current limits

Repeatable binary inspection: `node docs/asset-evidence/inspect-glb.mjs public/models/raccoon.glb` (and the two robot paths). `*-runtime-inspection.json` records final files; original-export metadata is preserved separately. Real base, idle, four-clip, centered-transition, hand-socket, helper and guard renders/JSON are in `docs/asset-evidence/`. Initial transient development reload/fetch interruptions were followed by successful instrumented reruns. The final raw-clip preview and centered-transition checks have no unresolved page/request errors.

The lead integrated the three local GLBs and reported a fresh five-job replay with zero page errors. Gameplay outcome evidence belongs in `PLAYTEST.md` and `docs/evidence/`; the asset renders here are not substitutes for that gameplay test. The latest actual token-carry capture was independently inspected for attachment/readability.

The guards/helpers are rigid single-mesh props, so their individual wheels and lids do not articulate. The sweeping robot, small pickups/bell, badge, backpack, architecture, cover, particles and UI remain original authored geometry. The sweeper is a rigid mechanical prototype rather than a Tripo character rig. The garden still has simpler materials/detail and a higher camera than the generated target. The carry pose remains lower and less exact than requested by its motion prompt. These are visible limitations, separate from the now-verified GLBs, full-body raccoon rig and actual clip playback.

The 25 October missing-CUA blocker is historical and preserved in `docs/asset-evidence/tripo-blocker.md`; it was resolved through the lead's tools. Built-in imagegen targets `target-01.png` and `target-02.png` and their exact prompts remain in `docs/visual-targets/`. They are generated design targets, not actual software screenshots or model sources.
