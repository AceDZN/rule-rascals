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

First test attempt was blocked by missing local `tsx` (`sh: tsx: command not found`); dependency installation belongs to the lead. Independent browser play has not yet started. Findings are pending fixes/retest, not signed off.
