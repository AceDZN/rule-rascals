# Independent English and gameplay review

Reviewer role: curriculum semantics, solvability and language bypass. Scope is the five-heist Rule Rascals slice. Source snapshots: `docs/curriculum/grade-8_chapter-5_rules-permission-and-obligation.md` and `docs/curriculum/grade-8_chapter-11_relative-clauses-reference.md`.

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

## Status

Design review complete. Pure simulation API reviewed: `createGame`, `step`, `interact`, `inspect`, `drop`, `getViolations`, `hasEscort`, `visibleTo`, `lineClear`, `canComplete`, `languageEvidence`, `recover` and `squeak`. Tests live in `tests/semantics.test.ts`. Direct positioning is used only to establish unit-test world fixtures; browser signoff must use normal controls.

Initial audit findings sent to lead:

1. Unseen rule violations were not retained for lawful/language evidence, so an unbadged or unescorted stealth bypass could receive that mark. Guard observation and compliance evidence need separate logic.
2. Dropped-bag observation was conflated with seeing the player. A compliant visible player must not reveal a bag behind cover.
3. The transfer arch initially returned a visitor's box and alerted a distant guard without a visible inspector. The final implementation must give that enforcement an actual observing actor/sensor or honor guard sight.
4. Box target identity initially remained `box-a` across seeds; changing only one coordinate leaves an order/identity bypass.
5. Helper transport evidence was a single boolean rather than tied to the transported cargo. Moving a different box must not satisfy the target's transport requirement.
6. The trolley initially changed only a boolean and did not visibly affect transport. Optional success branches alone do not prove a physical trolley interaction.

The lead fixed the six simulation/UI findings. The final semantic suite currently passes **28/28** with `npm test`, including regressions for unseen compliance breaches, violation-specific observation, target parity, cargo-specific transport, immediate mistaken-delivery logging and conditional bell carrying. Wrong delivery records a mistake without falsely recording requested assistance. The H planning shortcut now opens a paused rules/hint sheet. The arch inspector is an actual world robot with visibility enforcement. The trolley follows the helper, with cargo placed on the trolley in the rendering source.

Unit tests establish fixture semantics, not full browser solvability. The reviewer opened and inspected `docs/evidence/garden-first.png`: the bright garden, raised solid cover, raccoon proxy, robots and English notice are visible; controls are legible. Guard attention and the small exit label are less obvious than the generated target. The raccoon is a procedural prototype; this screenshot does not meet the outstanding Tripo GLB/rig requirement.

Independent browser setup required the skill-bundled Playwright runtime and a paused animation frame loop on the overloaded host. The test browser uses ordinary pointer/keyboard controls plus `advanceTime` and read-only `projectWorld`/`render_game_to_text` hooks. No state or win injection is used. Play results are recorded below.

The lead added an opening gardener/cloth action lasting six simulation seconds in heist 4, with the gardener starting at the polished bell. English Garden/Delivery logs remain inspectable for recoverable history. This choreography is confirmed in source; this reviewer did not independently observe its motion in the browser.

## Independent browser results

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

## Review limits

This reviewer independently completed the first two heists and the listed failure/recovery/support/mobile paths. The lead owns full five-heist progression, transfer and optional-trolley browser evidence; the unit suite covers both equipment branches. The latest heist-4 guard-watching condition was independently unit tested, while its final full browser path is the lead's verification responsibility. These checks establish implemented behavior in the tested scenarios, not fun, classroom usability or learning gains. Real Tripo model acquisition and a full-body raccoon rig remain an external asset requirement separate from semantic correctness.
