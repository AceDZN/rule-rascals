# Independent English and gameplay review

Reviewer role: curriculum semantics, solvability and language bypass. The current commission expands the five-heist slice into one normal campaign of at least 30 progressively harder levels, without a grade selector or grade gates. Source snapshots: `docs/curriculum/grade-8_chapter-5_rules-permission-and-obligation.md` and `docs/curriculum/grade-8_chapter-11_relative-clauses-reference.md`.

**28 October campaign review — current:** the authored campaign has 35 jobs in seven story chapters. The current suite passes 132 tests: the previous 71, 59 independent campaign cases and two lead-owned route/clearance checks. A fresh browser run on the final production preview independently completed levels **1–17** on the current candidate layout with the trolley branch, no resumed/seeded progress, no retries and zero page errors. The game recorded lawful/language-evidence marks for 15 wins; levels 4 and 9 completed without those marks and still opened the next job. The lead owns the current-layout **18–35** input run and consolidated result in `PLAYTEST.md`. Earlier 71-case captures below describe the five-level build; unit fixtures are not counted as browser completion.

**26 October physical follow-up — completed checkpoint:** all 71 regression tests passed. The user's desk, scenery, sign and carry complaints were valid. The shared-layout fixes passed direct held-key desktop checks at three accessible desk faces, a planter, a conservatory wall and a loose ground bag. A fresh normal-input H1 run completed lawfully; H2 bag pickup/drop/pickup and three carry strides followed by supported carry-idle passed. Conservatory signs remained readable outside and inside the faded architecture. This superseded the earlier implication of complete physical signoff. Detailed regression scope and reproducible commands are recorded below.

**Earlier asset-integrated checkpoint:** 41 rule/recovery checks passed before the physical follow-up. That independent browser verified three loaded local GLBs, the raccoon's 65-joint rig, H1 success and watched-carry chase, squeak/cover recovery, catch/retry, paused hint, restart and actual touch controls. Portrait and short-landscape HUD/alert spacing was rechecked then. Those remain evidence for the stated earlier scope; mobile and the entire recovery sequence were not replayed in the latest desktop collision run. No asset-acquisition blocker remains; `ASSETS.md` owns provenance/export details.

**26 October post-model scope — historical:** independent checks covered H1, recovery, controls, touch and sampled clip views. The lead owned the complete five-heist and transfer runs at that checkpoint. The new 28 October production-prefix scope is recorded separately below. No classroom test establishes fun, accessibility across all devices, duration or learning gains.

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

## Post-model independent verification — before the physical follow-up

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

## Reopened collision, label and carry review

The earlier navigation-heavy checks did not expose the missing desk collider. Holding movement keys into visible solids must be covered independently of A* click navigation. At the reopened baseline, simulation listed four planters, the store walls/door and an undersized fountain AABB, while the rendered entry desk, arch posts, decorative pots, tree bases, shelf and bell pedestals lacked matching footprints. The user also reported sign/rib depth interference and floating carry poses. These are real implementation gaps, not an educational-content issue.

The lead created shared render/collision fixtures in `src/world-layout.ts`; the art helper composed supported walk/idle lower-body motion with the acquired carrying upper body. This reviewer owns regression cases and direct-input browser verification, with no source/art edits or new asset requests.

| Regression area | Required check |
| --- | --- |
| Entry desk | Hold normal walk and sprint against front/back/left/right. The player stays outside the counter footprint plus actor radius; badge interaction remains reachable from free floor. |
| Planters and walls | Cardinal/diagonal contact stops penetration while tangent motion can slide. Long requested displacement cannot tunnel through a thin wall or closed gate. |
| Actor clearance | Navigation and movement use compatible player-radius clearance; accepted route segments do not pass through a solid corner. Boundary limits keep the actor on the platform. |
| Conservatory gate | Open doorway centre remains traversable. Both rendered arch posts remain solid; unlocking removes only the door's blocking footprint. |
| Other authored solids | Fountain outer lip, pots/tree bases, shelf and level-specific bell pedestals block their visible solid footprint. Overhead/decorative foliage is not automatically treated as a floor obstacle. |
| Reach and solvability | A prop on a desk/pedestal is approached from free floor within interaction reach. Test drivers must not require the actor to stand at a blocked prop centre. The five jobs and helper escort remain solvable. |
| Carry and contact | Sample actual carrying locomotion, stopping, turning and pushing into a solid across multiple animation phases. Check feet/cargo alignment and actual displacement rather than only active-clip metadata. |
| Labels | Inspect conservatory/arch labels through relevant camera positions, with and without architectural fading. Ribs must not slice task-bearing text. |

The independent sweep also reproduced a remaining bulky-prop gap: before its fix, the player stood at (-6.0417, 6.5208) inside the H2 ground bag at (-6, 6.5). The actual pre-fix capture is `work/reviewer-evidence/physical-10-ground-bag-overlap.png`. Bags, boxes and trolleys now have dynamic ground footprints, removed on pickup. Drop positions must be on free floor, outside actor bodies and on the same reachable side of a solid wall. A blocked drop keeps the item held. Small tokens, keys, maps and badges remain collectible without invisible floor walls.

Offset drops also needed a language safeguard: an outside visitor must not place the H5 bag inside the arch merely by facing north. The drop now stays outside. A bag already left inside still breaches the rule, and observation checks its actual location. Seeing a compliant player does not reveal a hidden bag. Recovery leaves one solid, reachable bag beside a free spawn instead of inside the raccoon. The old semantic drop fixture at (-9,6) was moved to free entrance floor because that coordinate is now correctly inside the counter; the intended rule assertion is unchanged.

The final suite includes the previous 41 checks, 15 scenery collision cases, 13 bulky-prop/drop cases and two chase-memory cases. Tests use public simulation/navigation/layout APIs, not source-text matching. Coverage includes all four desk faces, long-displacement tunnelling, sliding, rounded-corner clearance, inset platform bounds, open/closed gates, fountain lip, pots/tree bases, shelf, bell pedestals, interaction reach, dynamic pickup/drop, and observed versus hidden bag violations. A chasing guard now pursues the last seen position under cover; two regressions ensure hidden player coordinates cannot steer that pursuit and actual sight reacquisition updates a copied position snapshot.

The durable browser regression is `scripts/qa-physical.cjs`. It uses ordinary pointer input to position the actor, then actual held keyboard inputs for contact, sampling actor-disc clearance against static and dynamic footprints every 50 ms. Each release must report zero actual speed. It waits for all three GLBs, uses only read-only state/projection hooks plus ordinary deterministic time stepping, and closes its own isolated browser. No position setter, level skip, inventory mutation or win injection is used.

```sh
npm test
RULE_RASCALS_BROWSER_LIB=/Users/acedzn/.codex/skills/develop-web-game/node_modules/playwright node scripts/qa-physical.cjs
```

| Final desktop check | Observed result |
| --- | --- |
| Desk direct input | W held 800 ms stopped at z=7.1282, outside the front's expanded z=7.12 boundary. A on the right stopped at x=-7.22994, outside x=-7.23. Sprint/S from the back stopped at z=5.2535, before z=5.28. Free tangent sliding remains possible. The narrow tree-side gutter was not used as a browser route; the unit test covers that fourth desk face. |
| Planter/wall contact | Sprint/W stopped at planter z=3.5549 (expanded face 3.52) and wall z=-2.4057 (expanded face -2.43). Every sampled actor position remained clear. |
| Ground bag | Held W approached the bag and stopped at (-5.9133,7.1734), outside its footprint. Pickup removed the footprint; G put the bag on nearby free floor; E picked it up again. |
| H1 progression | Badge, distraction, token pickup, cover waypoints and exit completed with lawful=true, languageEvidence=true and no retry. This is an independent H1 result after the physical changes. |
| Sign readability | Outside and inside conservatory captures show the full opaque label without frame/rib slicing. Architecture still fades. |
| Carry locomotion | Three views 160 ms apart show distinct supported steps at actual speed 2.4 with `carry-walk`; release selects `carry-idle` at speed zero. Additional turn/desk-contact samples show the bag following its hand socket. No floating lower-body freeze or constant offset jump appeared in these samples. Hand/object contact remains approximate, not a rigid-body grasp simulation. |

The final browser run passed with zero page errors. Its report is `work/physical-evidence/results.json`. Candidate captures are `01-desk-front.png`, `07-conservatory-label-inside.png`, `09-ground-bag-contact.png`, `10-free-floor-drop.png`, `11-carry-stride-1.png` and `12-carry-idle.png` in that directory; each was opened and visually inspected. Earlier contact/carry turn samples remain under `work/reviewer-evidence/physical-*`.

This physical follow-up independently drove H1 and the H2 bag loop. Boxes/trolleys have the stated unit coverage; the lead owns the fresh complete five-job/escort/transfer replay and its result in `PLAYTEST.md`. This reviewer does not claim an independently driven H5 run. The latest collision run was desktop; the earlier real touch test remains separately dated/scoped. No new classroom, learning-gain or broad animation-quality claim follows from these checks.

## 28 October campaign expansion — semantic review and acceptance

The campaign advances through ordinary successful jobs. Chapter names are story structure; school grade is curriculum metadata and does not become a selector, permission gate or completion condition. Translation, hints, retries and a missing unaided-language mark affect attempt evidence but do not block the next level after action success. The pure progress tests complete all 35 levels with assisted, retried, non-unaided results and verify the next level opens every time. Invalid/skipped completions cannot unlock later levels; saved progress restores only a valid consecutive prefix.

The earlier proposed beats were reconciled against the actual content in `src/missions.ts`. The shipped simulation contract uses `MissionConfig` flags and ordered `repair`, `scan` and `deliver` tasks. `CURRICULUM.md` maps every job to its exact identifying record and intended decision. Chapter maxima grow from one to three, five, seven, eight, nine and eleven task actions. These are authored complexity measures, not measured player difficulty or a duration claim.

| Chapter / levels | Authored content progression | Added decision |
| --- | --- | --- |
| 1 / 1–5: Exhibition Garden | Original badge/token, optional map, live escort, key/bell history and exclusive helper box transport. | Existing foundation, unchanged exact fixtures. |
| 2 / 6–10: The Glasshouse | Washed/tested/marked near-matches; quiet movement; west and east scans; box-then-token finale. | Preserve actor, action and condition while beginning ordered station work. |
| 3 / 11–15: Robot Workshop | Wrench versus brush, gate restoration, two service actions, scan and delivery combinations. | Tool function is real state; repairs and object histories are separate facts. |
| 4 / 16–20: Exhibition Station | Origin/time contrasts, rejected/accepted requests, lender direction, unopened objects and two-parcel routes. | Keep distinct request routes and actor/receiver roles straight. |
| 5 / 21–25: The Museum Wing | Maker versus repairer, borrowing/donation direction, chronology, both versus one inspector and three exhibits. | Identify by recorded action history through longer mixed plans. |
| 6 / 26–30: Rooftop Run | Time windows, continuous protection, ownership chains, repair versus replacement and additional certification. | Combine multiple boundaries and preserve each object's scan evidence. |
| 7 / 31–35: Festival Night | Three requested objects, six item-specific scans, two service actions and three deliveries. | Longer transfer plans with changed agents and event order; chapter finales omit solution hints. |

Mandatory sequence must be stated in the English. For example, “Scan the parcel at West Checkpoint before you deliver it to Dispatch.” matches a scan prerequisite; “You can scan the parcel” does not make scanning compulsory. “Repair the pump before you deliver the parcel” does not forbid collecting the parcel first. Keep required action order distinct from an unstated restriction on when an item may be picked up.

The following contract boundaries were sent to the lead and checked against the implemented source/tests:

- Bind scan evidence to an actual item id, not only a task index or request cohort. Scanning A must not authorize delivery of unscanned B from the same cohort. If the player swaps objects, the necessary checkpoint must remain achievable without a soft lock.
- A wrong object or station must leave the task recoverable. Do not consume an item before validating its request/history and required scan. Completing one interaction must not advance multiple repair/scan entries accidentally.
- A repair needs the actual required tool at the actual station. A cargo item with a similar label is not that tool. A held tool must not occupy the parcel cargo slot, disappear after an unrelated task or be falsely granted by inspecting its label.
- Posted rules and predicates need the same scope. A `watchedCargo` flag cannot use unrestricted “objects” in the sentence while ignoring carried keys, maps or tools. Name the actual delivery cohort or apply the broader wording consistently. “Only helpers can carry boxes…” must not silently prohibit visitor tokens or tools.
- Keep conditional escort live throughout the named indoor activity. Quiet-store rules depend on actual running in that place. Ground bags inside remain actual bag violations, even if the visitor is no longer wearing one; observers must see the offending object.
- Optional map/trolley branches must both support completion. Changing the task destination or helper route must not accidentally make the trolley, a toy or a map a hidden prerequisite.
- Store exact history independently of coordinates and near-match labels. Request cohorts identify a task group; they must not reveal which individual is correct through a target beacon or a station's answer-check feedback.
- Task progress, inventory, dropped bulky props and helper cargo need explicit catch/retry behavior. Recovery cannot duplicate cargo, inherit another item's scan or leave a required tool inaccessible.

Independent campaign tests live only in `tests/campaign-review.test.ts`; no existing test or source/art file was edited for this expansion review. The independent full-suite checkpoint passed **130/130**, before the lead added two exhaustive layout guards for the current **132** total. The 59 campaign cases include 35 complete-plan tests with three seeded/equipment variants each, plus focused semantic/progress cases. Complete-plan runs never inject a task index, completed-task flag or win. Positioning establishes unit conditions; real `interact` actions acquire items/tools, request the helper and perform station work, while actual simulation steps record helper arch crossings. These are unit results, not browser route completions.

Specific issues found during review and fixed by the lead include ordinary walk speed being misclassified as running in a quiet store; checking only the player's station proximity while a helper held the cargo several metres away; the exit mat stealing the initial badge action; and helper recruitment becoming circular when an escort-required helper started inside the forbidden store. Regressions cover the corrected meanings and initial approaches. Delivered items stay consumed across catch recovery; incomplete cargo returns for recovery, scan evidence stays tied to that same id, tools persist, and a recovered box can make a new actual helper crossing before its pending delivery.

The late Hebrew translation originally omitted identifying record details and actual scan order. The lead added authored record translations for levels 31–35 and interpolated their real station/tool order; this was re-read against the English. Locations in the longer instructions for levels 10, 15, 17 and 19 were moved next to the scan action so they do not falsely describe where a past washing/packing/accepting event occurred. Later records use defining and non-defining clauses appropriately; the curriculum mapping now distinguishes them and makes no broader tense/mastery claim.

The nearby-object selector added during browser QA is an ordinary visible control for dense stations, objects and helpers. Source review confirms that neutral labels are ordered by distance, with no correct-target badge/history in the options. It selects which nearby entity Q/E addresses; it does not set inventory, task progress or wins. Its browser usability belongs to the lead/art input review, not these simulation tests.

No remaining semantic failure was found in the tested contract. The final-prefix browser results below extend this review's current input scope to levels 1–17. Input through 18–35, seven-theme inspection, current production/mobile controls and pacing remain separately evidenced by the lead/art review. The 26 October desktop/touch captures above remain historical scope; they are not new 35-level browser evidence. Browser success also cannot establish learning gains or whether eleven-action finales feel enjoyable to learners.

## Final production preview: independent levels 1–17

Replayed the final preview at `http://localhost:4203` in a fresh isolated Chromium context at 1672×941, after candidate positions had been spaced to leave actual approach clearance. The run began with empty campaign storage and earned each level in sequence. It used pointer waypoints, visible nearby-target selection, Q/E actions, the toy, map and ordinary next-level controls. Projection/text hooks and authored reference records guided read-only planning; `advanceTime` controlled ordinary simulation time. No position, cargo, completion or win setter was used. This is an automated action/route check, not a learner-comprehension experiment.

```sh
RULE_RASCALS_URL=http://localhost:4203 RULE_RASCALS_QA_PREFIX=review-current RULE_RASCALS_BROWSER_LIB=/Users/acedzn/.codex/skills/develop-web-game/node_modules/playwright node --import tsx scripts/qa-browser.cjs --campaign --through=17 --trolley
```

The command finished **PASS** without script changes or a resumed context. All 17 action wins were earned; all had assisted=false and retries=0. Game-recorded lawful=true/languageEvidence=true appeared for levels 1–3, 5–8 and 10–17. Levels **4 and 9** had both flags false, while action completion and next-level progression still succeeded. This verifies that the campaign does not require a language medal for advancement; it does not claim all 17 routes were lawful. No catch/retry happened in this particular prefix run, so it adds no fresh catch-recovery browser claim.

| Current-layout input coverage | Actual result |
| --- | --- |
| 1–5 foundations | Token carry, optional visited-route map, live helper escort, key/history bell and helper-box transfer completed. The trolley was used in the transfer branch, with cargo visibly on it. |
| 6–10 Glasshouse | New near-match records, escort/quiet rules, same-item west/east scans and ordered box/token requests completed. Level 9's action win retained the missing-lawful-evidence distinction. |
| 11–15 Workshop | Wrench/brush swapping, west repair, east repair/clean, door opening, parcel scans, helper box transport and ordered deliveries completed on the final layout. |
| 16–17 Station | Coastal parcel certification east then west and the rejected-token/accepted-bell route both completed. Level 17's final task index was 5/5, and the normal result offered level 18. |

The saved context contains exactly **17 earned completions**, with zero-based current=17 (next job 18). All three real local GLBs were loaded and reported no asset errors; the page-error log is empty. The browser closed after completion. Evidence remains isolated under `work/review-current-*`, with `review-current-qa-results.json`, `review-current-qa-progress.json` and `review-current-campaign-earned-storage.json`; these are local ignored QA artifacts, not production user data.

Forty captures were produced. The following scene/result samples were opened and visually inspected in `work/review-current-browser-evidence/`:

- `01-token-carry.png`, `02-visited-route-map.png`, `03-escort-gate-target.png` and `03-escort-carry.png` show the current actor, distraction cue, paused map and visible escort inside faded architecture.
- `04-bell-cover-target.png` and `05-helper-handoff.png` show the bell, actual planter cover, helper and trolley/cargo relationship.
- `campaign-10-success.png`, `campaign-11-1-repair.png`, `campaign-15-3-scan.png` and `campaign-15-4-deliver.png` show ordinary progression, workshop tools, east certification and a consumed box followed by the next request.
- `campaign-16-1-repair.png` and `campaign-17-success.png` show the Station theme and the earned 17/35 result with level 18 available.

The scene samples have readable rule/objective and nearby-target controls. This capture checkpoint exposed service-point labels covering the raccoon's head at exact station centres. The lead subsequently raised the labels to 2.3 and refined native-select keyboard/distance behavior; the images above document the earlier label height, while the lead/art owns the latest visual recheck. Very close handoffs can still overlap actor silhouettes. The tested actions remain usable, and these images should not be described as perfectly unobscured views.

After this prefix pass, the lead also moved a later four-box-corridor candidate from (7,-4.5) to (7,-5.4) for level 18 clearance and reran its helper approach. Prefix jobs had no solid box in that candidate slot, and this reviewer did not repeat 1–17 after the final visual/select and later-corridor refinements. The current 132-test total includes the two lead-owned exhaustive route checks. This replay was desktop only; later input levels, current mobile behavior and the complete production campaign remain the lead/art's separately reported scope.
