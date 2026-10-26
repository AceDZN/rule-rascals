# Pickup locomotion regression and fix

26 October 2026. The raccoon now keeps stepping while carrying, adopts a supported stance when stopped, and matches its gait rate to actual world travel speed. The source GLB is unchanged. The fix composes acquired animation tracks on the existing skin; it does not replace the character with a moving static mesh.

## What failed

The exported custom carry was not a reliable walking loop. Its latter-half feet moved only about 0.032 m in Z. Resuming movement in that phase looked like skating or floating even though animation time advanced. Setting its rate to zero while stationary could also freeze an arbitrary gait phase. The earlier checks established valid joints and changing tracks, but did not test sustained gait after stop/resume.

The badge case uses ordinary locomotion. That needed rate matching too, and the lead corrected simulation speed to actual displacement so a blocked player selects idle instead of continuing a running pose against a collider.

Actual deformed foot/toe vertices were measured, rather than relying on a cached bind-pose bounding box. Across the source clips the lowest sampled sole was already below the Y=0 floor, not above it. No arbitrary downward hips or actor offset was applied.

## Runtime changes

`src/model-assets.ts` keeps the four exported clips and adds two explicitly identified in-memory composites:

- `carry-walk`: real acquired walk hips/legs plus the acquired custom carry spine/arms. Source upper-body time is fitted to the cyclic walk duration.
- `carry-idle`: real acquired idle hips/legs plus a sampled bent-arm pose from the acquired carry clip. The actor switches to this stance at rest.

`src/actors.ts`, owned by the lead, selects the moving/stationary carry states and scales playback from actual displacement speed. Final rates are walk/derived-walk speed ÷ 0.72 and run speed ÷ 2.5. Normal 3.15 m/s movement uses the run source as a 1.26× jog; sprint 5 m/s uses 2× run; carry 2.4 m/s uses 3.333× derived walk. A real game pause advances zero simulation time.

The original model still has 65 joints, four exported clips and the recorded SHA-256. Metadata separately lists the two runtime-derived clips. No asset generation, rig change or new Tripo expense was involved.

## Continuous verification

An isolated actual-actor fixture ran on continuous `requestAnimationFrame` timing at full world speeds. It covered pre-badge idle, badge equip, movement, stop, cargo pickup, carry movement, carry stop, resume, sprint and pause. This is an animation regression fixture, not a level-completion recording.

- `raccoon-continuous-gait.webm` is the real continuous capture with loading and the paused tail trimmed. It retains the badge/carry action sequence. Its initial jog/sprint rate estimate was subsequently refined; the final-rate check below covers those states.
- `raccoon-continuous-frame-index.json` lists extracted video frames and visually verified stage labels. Direct asynchronous screenshot calls had transport lag, so those mislabeled captures were replaced with video frame extractions.
- Raw per-frame state and foot measurements remain in ignored `work/gait-measurements/raccoon-continuous-gait-final.json`. `raccoon-gait-regression-summary.json` contains compact metrics.

After resuming carry, left/right foot excursion remains approximately 0.45–0.48 m, instead of the raw carry's ~0.032 m late drift. Settled carry-idle thigh variation is about 0.007 rad; true pause variation is exactly zero. Contact-filtered support-foot world Z velocity is approximately −0.003 to −0.012 m/s during moving carry, indicating close rate matching. The final fixture recorded zero page errors.

The final run divisor was independently checked in a fresh continuous actual-actor run: **659 frames**, normal jog **1.26×**, sprint **2×**, zero page errors, and unchanged paused pose. Contact-filtered support-foot world Z velocity medians are approximately **−0.014 m/s jog** and **+0.025 m/s sprint**, improved from roughly −1 / −1.5 m/s with the initial run-rate estimate. These are descriptive estimates using consecutive samples of the same low foot with small vertical velocity, not a foot-IK guarantee.

Exact frames were captured from inside RAF immediately after rendering, avoiding screenshot transport lag:

- `gait-final-jog-a.png` / `gait-final-jog-b.png`
- `gait-final-sprint-a.png` / `gait-final-sprint-b.png`
- `gait-final-stopped.png`

Their timestamps, stages, rates and compact measurements are in `raccoon-final-jog-sprint-summary.json`; full samples are retained locally in ignored `work/gait-measurements/`. The paired frames were opened and inspected and show different stepping phases. The stopped frame shows a supported stance.

## Limits

Sampling used 730 actual skin vertices with meaningful foot/toe weights. No positive sole gap appeared in the tested sequence, but the source paw shape still penetrates the ground by roughly 0.02–0.16 m at some gait/blend phases. No foot IK or exact two-hand object contact is implemented. The carry pose remains low; the test cube demonstrates attachment rather than a perfect box grip. The main game's full input, collision and heist regressions are recorded by the lead in PLAYTEST.md.
