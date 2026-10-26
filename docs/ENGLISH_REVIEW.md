# Independent English and gameplay review

Reviewer role: curriculum semantics, solvability and language bypass. Scope is the five-heist Rule Rascals slice. Source snapshots: `docs/curriculum/grade-8_chapter-5_rules-permission-and-obligation.md` and `docs/curriculum/grade-8_chapter-11_relative-clauses-reference.md`.

**Current status — asset-integrated build:** all 41 semantic tests pass, including ten new watched-token regressions with the original 31 cases preserved. The independent browser waited for all three real local GLBs to load and verified the raccoon's 65-joint rig, idle/walk/run/custom-carry clip switching, H1 lawful success, watched-carry chase, squeak/cover recovery, catch/retry, paused hint, restart and actual mobile touch controls. The final portrait/short-landscape HUD and alert spacing was rechecked after fixes. No page errors occurred in these reviewed runs. No asset-acquisition blocker remains; `ASSETS.md` owns provenance/export details.

Independent post-model scope is **H1, recovery, controls, touch and sampled clip views**. The lead owns the complete five-heist and transfer browser runs, including both trolley branches; this reviewer inspected selected lead captures but does not claim to have independently replayed that full post-model sequence. No classroom test establishes fun, accessibility across all devices, six-to-ten-minute duration or learning gains.

Earlier prototype and waiting-for-assets passages below are **historical checkpoints**, followed by the final post-model results at the end. Their missing-rig statements describe the earlier build, not an unresolved current blocker.

## Design review

The functional-rule and defining-clause combination is suitable for the requested action interpretation task. English must determine a plan, while physically plausible stealth, carrying, cover and distraction determine its execution.

Required tightening sent to lead: use “Only helpers can carry boxes through the arch.” The draft “Helpers can carry…” is not an exclusive prohibition for visitors. A visitor badge must never confer helper role. State “Visitors must leave large bags outside the arch” so the boundary is explicit.

For heist 3, helper identity must come from watering behavior and actual role. A guard or sweeping robot standing nearby cannot satisfy escort. The condition must be checked during store occupancy, not permanently unlocked after one conversation.

For heist 4, keys need truthful identifying information about their use. Both bells should remain plausible near-matches, without a correct-target color. Polishing must be observable/replayable, with a consistent history fact. Target identity and side vary on fresh runs. A wrong bell can be carried and returned, but cannot complete the objective or automatically reveal the right bell.

For heist 5, carry permission and optional trolley choice are separate. A helper may carry the box directly or use the trolley; the player does not become a helper by standing near one. Changed layout, box identity/history and cargo rule prevent a memorized badge-and-sprint solution from satisfying the language condition.

## Semantic test cases

| Case | Expected world behavior |
| --- | --- |
| Badge in pocket, not worn | Obligation unmet. |
| Badge worn | Obligation met; does not grant helper role. |
| Map taken / skipped | Both permitted and completable. |
| Bag on path away from doorway | No doorway violation. |
| Bag in doorway | Rule violation; guard reacts only if observed. |
| Visitor outside store without helper | No store-entry violation. |
| Visitor inside store with watering helper near | Conditional rule satisfied. |
| Visitor inside with sweeping robot near | Conditional rule violated. |
| Helper leaves while visitor remains inside | Conditional rule becomes violated. |
| Player hidden behind solid cover | Guard cannot visually enforce unseen violation. |
| Guard sees violation then loses sight | Suspicion/chase can recover; no omniscient tracking through cover. |
| Wrong key used | Door remains locked; retry possible. |
| Wrong bell carried to exit | No completion; return/retry possible without an answer modal. |
| Correct bell history on either side | Either target placement can complete. |
| Visitor carries box through arch | Exclusive helper rule violated; badge is irrelevant to role. |
| Helper carries box, trolley skipped | Valid transport. |
| Helper transports box using trolley | Valid transport. |
| Large bag crosses arch with visitor | Bag obligation unmet. |
| Wrong box, lawful carrier | Physical transport succeeds but target objective does not. |
| Notice/translation open | Simulation pressure paused. |
| Hint/translation used | Attempt marked assisted; no first-unaided credit. |
| Transfer hint requested | No helper/target solution revealed. |

## Browser acceptance plan

Play success, observed violation, cover recovery/catch reset, pause/read/resume/restart and support paths. Complete all five heists through real movement/interactions without injecting win state. Run level 2 and 5 optional branches separately. Confirm the text hook matches visible cargo, helper, guards, target history and outcome. Inspect a touch viewport and Hebrew/LTR text. Report asset/rig status separately from simulation correctness.

## Original prototype audit — historical

Design review complete. Pure simulation API reviewed: `createGame`, `step`, `interact`, `inspect`, `drop`, `getViolations`, `hasEscort`, `visibleTo`, `lineClear`, `canComplete`, `languageEvidence`, `recover` and `squeak`. Tests live in `tests/semantics.test.ts`. Direct positioning is used only to establish unit-test world fixtures; browser signoff must use normal controls.

Initial audit findings sent to lead:

1. Unseen rule violations were not retained for lawful/language evidence, so an unbadged or unescorted stealth bypass could receive that mark. Guard observation and compliance evidence need separate logic.
2. Dropped-bag observation was conflated with seeing the player. A compliant visible player must not reveal a bag behind cover.
3. The transfer arch initially returned a visitor's box and alerted a distant guard without a visible inspector. The final implementation must give that enforcement an actual observing actor/sensor or honor guard sight.
4. Box target identity initially remained `box-a` across seeds; changing only one coordinate leaves an order/identity bypass.
5. Helper transport evidence was a single boolean rather than tied to the transported cargo. Moving a different box must not satisfy the target's transport requirement.
6. The trolley initially changed only a boolean and did not visibly affect transport. Optional success branches alone do not prove a physical trolley interaction.

The lead fixed the six simulation/UI findings. The first independent review's **28/28** semantic cases passed with `npm test`, including regressions for unseen compliance breaches, violation-specific observation, target parity, cargo-specific transport, immediate mistaken-delivery logging and conditional bell carrying. Later inspector and watched-token cases are recorded below. Wrong delivery records a mistake without falsely recording requested assistance. The H planning shortcut now opens a paused rules/hint sheet. The arch inspector is an actual world robot with visibility enforcement. The trolley follows the helper, with cargo placed on the trolley in the rendering source.

Unit tests establish fixture semantics, not full browser solvability. The reviewer opened and inspected `docs/evidence/garden-first.png`: the bright garden, raised solid cover, raccoon proxy, robots and English notice are visible; controls are legible. Guard attention and the small exit label are less obvious than the generated target. The raccoon is a procedural prototype; this screenshot does not meet the outstanding Tripo GLB/rig requirement.

Independent browser setup required the skill-bundled Playwright runtime and a paused animation frame loop on the overloaded host. The test browser uses ordinary pointer/keyboard controls plus `advanceTime` and read-only `projectWorld`/`render_game_to_text` hooks. No state or win injection is used. Play results are recorded below.

The lead added an opening gardener/cloth action lasting six simulation seconds in heist 4, with the gardener starting at the polished bell. English Garden/Delivery logs remain inspectable for recoverable history. This choreography is confirmed in source; this reviewer did not independently observe its motion in the browser.

## Original prototype browser results — historical

Test method: the skill-bundled Playwright runtime launched a separate headless Chromium context. Pointer navigation, keyboard actions, touch taps and touch-start/end input drove the game. `advanceTime` stepped the simulation; read-only projection and text-state hooks supplied coordinates and observations. The final canonical route uses `?deterministic=1` to stop continuous rendering on the overloaded host. No position setter, inventory mutation, level skip or win injection was used for these browser results.

| Scenario | Observed result | Reviewed screenshot |
| --- | --- | --- |
| Heist 1 complete loop | Equip badge with E, navigate around cover to token, take with E, carry to exit. Result: lawful, unaided evidence, no retries. | `work/reviewer-evidence/01-token-approach.png` plus heist-2 result history |
| Heist 2 no-map branch | Badge worn, map skipped, silver token recovered and returned. `map=false`, lawful=true, languageEvidence=true, assisted=false, retries=0. | `work/reviewer-evidence/02-no-map-win.png` |
| Observed violation and recovery | Unbadged raccoon approaches patrol. Badge violation recorded at t=6.40; caught at t=7.12. Retry returns to entrance in play mode, retries=1. Badge can then be equipped. | `work/reviewer-evidence/04-caught.png` |
| Paused planning hint | H opens the rules/hint sheet and marks assistance. Advancing five seconds preserves simulation time 7.15 → 7.15. | `work/reviewer-evidence/05-paused-hint.png` |
| Mobile viewport | 390×844 touch context. Document is exactly 390×844. HUD, notice, objective, context actions, pocket, pad and sneak toggle all lie within the viewport. | `work/reviewer-evidence/03-mobile-play.png` |
| Mobile touch control | Touch action equips badge; holding a touch on the movement pad moves player (-9,8) → (-6.25,6.47). Sneak toggles on/off. Touch pause freezes time 1.07 → 1.07 for a five-second advance; resume works. | `work/reviewer-evidence/06-mobile-pause.png` |

All six listed screenshots were opened and visually inspected. English notice/objective and Hebrew controls are readable in the tested states. No clipped essential controls or unintended document scrolling appeared. The captured desktop page emitted no page errors.

The listed `work/` files are local review evidence and are ignored by Git. The lead may copy selected captures into `docs/evidence/` for publication; the public repository's `PLAYTEST.md` is the final consolidated record.

## Limits of original prototype verification — historical

At that stage this reviewer independently completed the first two heists and the listed failure/recovery/support/mobile paths. The lead owned full five-heist progression, transfer and optional-trolley browser evidence; the unit suite covered both equipment branches. The heist-4 guard-watching condition was independently unit tested, while its full browser path was the lead's verification responsibility. Those checks established behavior in the tested scenarios, not fun, classroom usability or learning gains. Tripo acquisition and a full-body raccoon rig were still outstanding then; the final integrated checks below supersede that asset status.

## Resumed art and gameplay pass — 26 October 2026

Read the renewed handoff, shared contract, game brief and current verification/provenance documents. Reopened the original generated target, current bell-carry and helper-handoff captures, and the mobile gameplay capture. These are existing implementation captures; this inspection is not a new end-to-end playtest. The published baseline reports 31 passing semantic tests: the 28 independent cases plus three inspector/recovery regressions.

Initial recommendations sent to the lead before implementation, in priority order:

1. **Keep the player and cargo visible inside the conservatory.** The current bell-carry capture hides most of the raccoon behind front architecture; the helper-handoff capture hides the helper and box. Fade only architecture between the camera and the player/helper cargo, retaining authored collision and sight geometry. Recheck a carrying frame inside the store and a helper crossing at both desktop and portrait sizes.
2. **Make attention and distraction readable.** Increase contrast of the cover-clipped cone; show a clear question mark or similar attention cue during the finite distraction and a short visible toy toss/sound ripple. The pinned notice should show the already-posted watched-bell rule while a bell is carried, instead of retaining the finished key task. All cues describe attention; none may identify the correct object. Recheck a watched mistake, cover break and successful squeak escape.
3. **Teach one real stealth decision in the first job.** Proposed additional original fixture: “Visitors mustn't carry the token while a guard is watching them.” Scope it to heist 1, using the same actual attentive-guard/cover logic as the bell condition. With the current valid-badge route, the first job is a safe walk and the useful stealth decision arrives late. If accepted, preserve optional-map behavior in job 2 and the helper/optional-trolley distinctions in transfer; add exact semantic tests and a normal-input first-job route.

The lead accepted all three recommendations, to be implemented after first real asset acquisition and a complementary chase target. No game source or art was edited by this reviewer. After real GLBs/animation are integrated, independent signoff must additionally inspect feet height, facing direction, readable raccoon scale, hand/cargo alignment, helper/trolley cargo alignment and the complete success/mistake/recovery/transfer/touch paths. The current external asset status remains open until actual local files and playback are verified.

### First-job semantic regression cases

The accepted original fixture is exactly **“Visitors mustn't carry the token while a guard is watching them.”** The rule is conditional; it forbids carrying in an attentive guard's view, not all carrying, and it does not mandate using the toy. Standing still with the token is still carrying it.

| Case | Required result |
| --- | --- |
| Heist 1 notice | Contains the exact new fixture; pinned notice switches to it while token is carried. |
| Equipped badge + token + attentive unobstructed guard | `watched-token` violation, including stationary holding. Badge obligation and token-carry prohibition are distinct. |
| Same position, guard distracted | No watched-token violation; transport remains possible. |
| Distraction expires while carrier stays visible | The conditional prohibition becomes active again. |
| Solid cover occludes carrier | No watched-token violation; detection and visual cone respect the same cover. |
| Token remains on the ground, or only badge is held | No token-carry violation. |
| Player carries token outside guard view without using toy | Lawful transport remains possible; the toy is a tactic, not a hidden obligation. |
| Seen forbidden carry followed by successful escape | Action success may be recorded, but no first-unaided lawful-language evidence. |
| Heist 2 token, map taken / skipped | New heist-1 rule does not leak into heist 2; both optional-map routes remain eligible. |
| Notice, vocabulary, hint or pause open | Simulation pressure and distraction timers remain frozen. |

The authoritative fixture/state behavior has landed. `tests/review-token.test.ts` adds ten runnable regressions, preserving all 31 baseline cases; `npm test` passes **41/41**. The cases cover the table's semantic conditions. They establish unit world fixtures through positions and normal simulation actions, without injecting a win state. The contextual pin is confirmed in source, with actual DOM/visual verification reserved for the post-model browser pass rather than a source-regex test.

Browser verification must complete the first heist using movement and carrying through a real permitted view/cover/distraction condition; it must also trigger one observed violation and recover. The observed causal sequence and actual model/cargo visibility matter more than an isolated win screen.

### Fresh baseline attention/recovery play, before model integration

Used an isolated Chromium browser with native Metal flags, normal keyboard/pointer inputs, paused RAF and the standard deterministic step hook. No native Chrome, Tripo tab, shared UI lock or game-state mutation was used. This is a fresh run of the existing procedural build; it does not verify the forthcoming GLBs or first-job refinement.

- **First-job chase escape:** deliberately approached the patrol without equipping the badge. A real observed violation started chase at t=6.40. Squeak at t=6.52 cancelled chase; moving behind the right planter reached a safe position. At t=14.23 the player remained in play, suspicion was zero and the guard was patrolling again. The five-second distraction window was sufficient for this short cover escape.
- **Bell job:** completed jobs 1–3, including the no-map route and real helper escort, then inspected both keys and bell histories. With the polished bell, waited at the gate for actual guard attention. At t=32.85 suspicion was 0.22; squeak at t=32.87 started distraction. Carrying through (-2,0) to (-5,5) reached cover at t=38.47, after the distraction expired. Returning the bell won at t=40.0. The result correctly recorded action success with `lawful=false` and `languageEvidence=false` after the deliberate watched-carry breach.
- **Observed feedback issues:** immediately after squeak, the red suspicion meter and world attention mark remained while the guard was already distracted, and the ordinary gold sight cone still implied active detection. One toy landed behind the tree line without a visible confirmation cue. The accepted attention/toss pass should communicate the actual distracted state without revealing the target object.
- **Observed occlusion:** the fresh bell-carry frame again hid almost the whole raccoon inside the conservatory. Once outside, the carrying silhouette and bell were legible. The stale side-key notice remained pinned during watched carrying; the accepted contextual rule pin should resolve that mismatch.

All eight new local captures `work/reviewer-evidence/resume-01-chase-before-squeak.png` through `resume-08-bell-recovered-exit.png` were opened and visually inspected. The complementary generated `docs/visual-targets/target-02.png` and its prompt were also inspected. Its unobscured player/cover/guard relationship and visible toy sound cue remain the comparison target. No page errors occurred in these baseline runs. These observations support keeping the current five-second distraction duration while improving feedback; they do not establish classroom fun or learning gains.

### Early acquired-character review checkpoint — historical

Rechecked the current source and all ten planned first-job cases after resuming. The watched-token fixture, authoritative violation logic and contextual pins are now present. The original 31 baseline tests are preserved and the ten new regressions pass alongside them; no failing or skipped placeholder tests were added. Browser review is waiting for the integrated model/scene build.

Independently opened the acquired raccoon's base-front and idle-at-1.2-seconds inspection captures in `docs/asset-evidence/`. The yellow scarf, clear ringed tail and friendly raccoon silhouette match the target identity. The exported idle pose is visibly different from the neutral base pose. Asset-owner inspection reports a real 65-joint skin and an `idle` clip; that supports a partial rig/playback milestone, not a claim that walk/run/carry or gameplay integration are complete. Runtime scale, feet contact, facing, inventory alignment, clip switching, all required action exports and redistribution status must still be checked against the final asset record and actual game.

For independent post-integration browser checks, the requested read-only metadata was actual model loaded/error state and the exact active clip. Tests must wait for the acquired model rather than capture a procedural fallback while asynchronous loading is unfinished. No game-state setter is needed. That metadata is now implemented and was used in the final checks below.

## Final post-model independent verification

Used a fresh isolated Chromium page with native Metal flags, ordinary keyboard/pointer/touch input, read-only projection/text hooks and deterministic time stepping. Before interaction, polling at 100 ms waited for raccoon and both mechanical asset statuses to be loaded. Runtime metadata reported three Tripo GLBs, no model errors, a 65-joint skinned raccoon and the actual exported idle/walk/run/custom carrying clip names. The guard and watering robot are correctly reported as rigid props, without a skin-rig claim.

| Check | Actual result |
| --- | --- |
| H1 lawful success | Equipped badge; approached token; squeaked before pickup; carried through cover waypoints; returned to exit. Win at t=15.6 with lawful=true, languageEvidence=true, assisted=false and retries=0. The DOM pinned the exact watched-token rule while carrying. |
| Observed token breach → chase → distraction/cover | With badge worn, took the token while watched. At t=8.00 the guard was chasing and the current violation was `watched-token`. Space changed it to distracted, hid the active sight cone/red meter, and showed a readable question mark plus visible sound rings. Reaching cover left the player in play with suspicion=0. |
| Actual catch/retry | Deliberately approached the attentive guard again. Catch displayed a short Hebrew explanation preserving the `while a guard is watching` condition. Retry returned play at the entrance with cargo cleared and retries=1. |
| Paused hint and restart | H opened reading support and marked assistance. Five seconds of stepping preserved t=25.73 exactly. Reduced-motion control toggled. Restart returned intro with retries=2, retaining the earlier retry count. |
| Actual animation switching | Ordinary Shift+D selected `run`; two captures 0.2 s apart show different full-body stride poses. Releasing Shift selected `walk`, and releasing movement selected `idle`. Carrying selected the exact custom exported carrying motion. Sampled final views show grounded scale/facing and no visible constant sprint-offset jump. This is sampled visual evidence, not an exhaustive examination of every animation frame. |
| Touch 390×844 | Touch action equipped the badge; a held touch on the movement pad moved (-9,8) → (-7.35,7.08); sneak toggled on/off. Touch navigation and on-screen toy/action buttons reached and carried the token with all three models loaded. Touch pause froze t=7.50 for a five-second advance and resume worked. |
| Portrait and short landscape fit | Final 390×844 and 844×390 views have no document overflow. The long carrying-rule pin ends about 8 px above the objective; suspicion sits 12 px below it. The short-landscape alert was moved away from the rule/objective and touch controls, then reloaded and visually checked. At 844×390 the alert is y=264–295, below the objective's bottom=152.83 and horizontally clear of the right actions starting at x=609. |

The earlier thin attention-label glyphs and boundary-tree occlusion were reported during this pass and fixed before final captures. Square large-glyph `!`/`?` symbols are now legible; camera-obscuring trees fade without changing authoritative cover/collision rules. The acquired raccoon, token and guard are visibly distinguishable at the tested carry point. Conservatory architecture fading and helper cargo were also checked in selected lead full-progression captures, as visual review rather than an independently driven transfer run.

Candidate final evidence is under ignored `work/reviewer-evidence/`:

- `integrated-final-01-token-carry.png`: real raccoon/custom carry, contextual rule, readable distraction marker and tree fade.
- `integrated-final-03-token-chase.png`: real watched-token chase and attention cue.
- `integrated-final-04-token-distraction.png`: matching world position after Space, with question mark/sound cue.
- `integrated-final-05-cover-recovery.png`: player back in cover with guard attention recovered.
- `integrated-final-06-caught.png` and `integrated-final-07-paused-hint.png`: condition-specific recovery and paused support.
- `integrated-final-10-run-a.png`, `integrated-final-11-run-b.png`, `integrated-final-12-walk.png`, `integrated-final-13-idle.png`: sampled real clip views after the sprint-offset patch.
- `integrated-final-14-mobile-carry-spaced.png` and `integrated-final-16-mobile-landscape.png`: final long-rule/touch layouts after both spacing fixes.

All listed final candidate images were opened and visually inspected. JSON observation reports are saved beside them as `integrated-h1-state.json`, `integrated-recovery-state.json` and `integrated-mobile-state.json`. The independent browser was closed after review. The lead selects/copies curated evidence into `docs/evidence/` and consolidates the full run in `PLAYTEST.md`.

No remaining semantic blocker was found in the tested scope. Optional map/trolley choices, helper identity/proximity, relative-clause history and separate action/language evidence remain intact in the 41-case suite. Final claims should stay at demonstrated behavior and actual acquired asset playback; automated success is not a measured learning or fun result.
