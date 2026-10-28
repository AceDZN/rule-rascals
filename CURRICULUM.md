# Curriculum mapping

Rule Rascals is an original action scenario for Hebrew-speaking Israeli grade-8 learners. The saved Workbook snapshots under `docs/curriculum/` are the content authority. The campaign practices interpretation through action; it does not assess productive grammar, speaking, or demonstrate learning gains.

**28 October expansion:** 35 authored jobs now form seven story chapters in one normal campaign. School grade describes the reference material, not a player selector, entry gate or progression requirement. The original five exact fixtures remain the foundation. The later repair/checkpoint/delivery scenarios have independent simulation coverage; full input-driven campaign verification is recorded separately in `PLAYTEST.md`. They are original scenario extensions, not newly verified Workbook modules.

Sources:

- [Rules, Permission, and Obligation](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation)
- [Relative Clauses Reference](https://english.workbook.co.il/grade-8/chapter-11/relative-clauses-reference)

All scenario sentences below are original fixtures. Workbook's junior-high scope informs the design; this is not a claim of Ministry approval or of A2 mastery. A2 is a junior-high exit reference, not a grade-8 result established by this game.

## Foundation jobs 1–5

| Heist | Exact English fixtures | Intended interpretation and world outcome | Misconception checked | Workbook source |
| --- | --- | --- | --- | --- |
| 1 — Badge first | “Visitors must wear a badge.” “Visitors can use the garden path.” “Visitors mustn't carry the token while a guard is watching them.” | A badge must be equipped, not merely carried. The path is permitted. Carry the token outside an attentive guard's view, behind cover or during distraction. Standing still with it also counts as carrying. The toy is one tactic; patrol timing remains valid. Recover the token and return. | `must` is stronger than advice; `can` expresses permission here. The carrying prohibition retains its observation condition, and wearing a badge does not remove it. | [Chapter 5](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation) |
| 2 — A choice stays a choice | “You don't have to take a map.” “You mustn't leave bags in the doorway.” | Both map and no-map recovery routes are valid. A bag elsewhere is allowed; a bag actually blocking the named doorway is a violation when observed. | `don't have to` is neither `must` nor `mustn't`; a prohibition retains its location condition. | [Chapter 5](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation) |
| 3 — Keep the condition | “Visitors mustn't enter the store without a helper.” “Ask the robot who waters the plants.” | Identify the watering helper from observable behavior, approach and request escort. The actual helper must remain near the visitor inside the store. A sweeping robot does not grant escort permission. | The conditional prohibition does not ban all entry. A nearby robot is not necessarily the described helper. | [Chapter 5](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation), [Chapter 11](https://english.workbook.co.il/grade-8/chapter-11/relative-clauses-reference) |
| 4 — Which object? | “Visitors must wear a badge.” “Use the key that opens the side door.” “Take the bell that the gardener polished.” “Visitors mustn't carry a bell while a guard is watching them.” | Distinguish keys by their stated use and bells by the gardener's observed action/history. Watch patrol attention, use cover or distract the guard before carrying the bell. Holding a bell in an attentive guard's view also breaches the rule. Carrying the other bell is a recoverable physical mistake, not completion. Target side/history varies across new attempts. | A defining clause identifies a noun. In `that the gardener polished`, the gardener performs the action; the bell receives it. `while` preserves the actual observation condition, so wearing a badge alone does not authorize a watched bell carry. | [Chapter 5](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation), [Chapter 11](https://english.workbook.co.il/grade-8/chapter-11/relative-clauses-reference) |
| 5 — Transfer delivery | “Only helpers can carry boxes through the arch.” “Visitors must leave large bags outside the arch.” “You don't have to use the trolley.” “Take the box that the helper placed beside the fountain.” | Changed layout, target noun and role permission require a new plan. The player remains a visitor and asks the real helper to transport the chosen box. Helper transport succeeds with or without the trolley. The large bag stays outside. The box must match the placement history. | A visitor badge does not create helper status; optional equipment remains optional; actor/action history identifies the correct object. | [Chapter 5](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation), [Chapter 11](https://english.workbook.co.il/grade-8/chapter-11/relative-clauses-reference) |

Heist 5 adds **Only** to the commissioning draft. “Helpers can carry boxes…” alone grants helper permission without necessarily excluding visitors. The revised fixture makes the intended exclusive role rule explicit. `outside the arch` also names the bag boundary.

### First-job condition added in the resumed pass

The 26 October art/gameplay pass adds the original fixture **“Visitors mustn't carry the token while a guard is watching them.”** to heist 1. This extends the existing [Chapter 5](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation) interpretation task with an observable condition: a visitor may carry the token outside an attentive guard's view, behind cover, or during distraction. Wearing a badge does not remove the separate carrying restriction. Standing still with the token still counts as carrying. The rule does not require using a toy, and it does not apply to heist 2's optional-map choice. The authoritative fixture/logic and ten new semantic regressions pass. Independent post-model browser play verified lawful H1 success, the exact contextual notice, and watched-carry chase followed by distraction, cover recovery and catch/retry.

## Grammar boundaries

- `must + base verb` states obligation, `mustn't` prohibition, `can` permission in this setting, and `don't have to` absence of obligation.
- Restrictions apply to their stated actor, action, place and condition. No rule should silently become broader than its English.
- In the defining clues there are no separating commas. `who` refers to a person or personified robot; `that` identifies a thing. Later history records also contain non-defining clauses, such as “the gardener, who kept it” and “the museum, which lent it to the festival.” These add information about the named agent and keep their commas and `who`/`which`; they do not license substitution with `that`.
- The subject/object distinction is practiced through action history: the gardener polished the bell; the helper placed the box. No separate claim of full syntactic analysis is made.
- Later records add temporal, causal, concessive and ownership contrasts. They are original reading-task vocabulary and narrative context, not a claim that this game assesses every tense or connector in a separate verified Workbook module.

## Support, evidence and scoring

Hebrew onboarding, controls and short error explanations surround explicitly LTR English notices. Reading a notice pauses pressure. Vocabulary/translation is available on demand; opening solution support marks that attempt as assisted. Reading the ordinary English notice is part of the unaided task, not assistance. The transfer heist offers no solution hint identifying the helper or target.

Action completion and language evidence are separate. A stealth bypass can earn action completion without a language-evidence mark. Local event records should include challenge, relevant action/condition, success, support use, retries and unaided flag, with no personal learner data or remote analytics. A correct attempt is evidence of that game's decision, not proof that the learner read or mastered the grammar. Repeated or supported success must not be counted as a first unaided decision.

## Verification status

Mapping and semantic constraints were reviewed against both saved snapshots. The current suite has 132 passing checks: the prior 71, 59 campaign cases in `tests/campaign-review.test.ts` and two lead-owned route/clearance guards. Each job completes through simulation interactions in three positional/equipment variants; fixture positioning is not browser route completion. A later fresh final-production browser replay independently earned levels 1–17 with the trolley branch, no retries and zero page errors. Fifteen wins retained the game's lawful/language-evidence marks; levels 4 and 9 advanced after action completion without those marks. The lead owns current-layout input levels 18–35 and consolidated results in `PLAYTEST.md`. Semantic coverage includes order, tools, item-bound scans, helper proximity/identity, recovery, optional equipment, pause and sequential progression. Neither simulation nor browser success establishes classroom outcomes.

## Authored campaign progression

| Chapter / levels | Language decisions developed from the existing source scope | Action evidence |
| --- | --- | --- |
| Exhibition Garden / 1–5 | Original obligation, permission, optional equipment, helper condition and defining-clause fixtures above. | Established foundation, with exact original distinctions. |
| The Glasshouse / 6–10 | Live escort, quiet indoor movement, actor/history near-matches and ordered scans. | One-to-three task actions; the same item completes its stated scan route. |
| Robot Workshop / 11–15 | Tool function, repair/clean contrast, temporal history and explicit service/delivery order. | Correct real tool opens/restores service; longest plan has five actions. |
| Exhibition Station / 16–20 | Lender/receiver and before/after contrasts, two requests and repeated scans. | Distinct parcel routes stay separate; longest plan has seven actions. |
| The Museum Wing / 21–25 | Maker versus repairer, loan direction, both versus one, record chronology. | Three exhibits are processed in the stated order; longest plan has eight actions. |
| Rooftop Run / 26–30 | Time windows, `throughout`, `instead`, ownership chains and negative records. | Longer mixed certification/delivery routes; longest plan has nine actions. |
| Festival Night / 31–35 | Transfer previously introduced operations into multi-agent, multi-event records. | Three requested objects each keep their own route; final plans contain eleven actions. |

The complete original English rules, history records and ordered task text live together in `src/missions.ts`; the common badge/helper/optional rules are included where their mission flags apply. The following exact record excerpts identify the distinguishing content of each new job. All continue the [Chapter 5 rule-interpretation](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation) and [Chapter 11 reference/relative-clause](https://english.workbook.co.il/grade-8/chapter-11/relative-clauses-reference) scope already cited, without inventing new lesson ids.

| Job | Exact original identifying record or tool fixture | Decision and required action |
| --- | --- | --- |
| 6 · Fresh Delivery | “The helper washed this token.” | Distinguish both action and agent; escorted retrieval and exit delivery. |
| 7 · Quiet Glasshouse | “The gardener tested this bell.” | Distinguish testing from packing and the sweeper's testing; normal walking remains allowed indoors. |
| 8 · West Check | “The gardener marked this token for the exhibition.” | Purpose and agent identify it; west scan precedes exit delivery. |
| 9 · East Then West | “The gardener cleaned this bell after the show.” | `after` differs from `before`; the same watched-cargo item scans east then west. |
| 10 · Glasshouse Finale | “The helper packed this box for dispatch.” | Helper transports the first box; only afterwards scan the washed token west and return it. |
| 11 · The Right Tool | “A wrench repairs a machine.” | Identify tool function, repair west to open the store, retrieve the workshop token. |
| 12 · Dusty Reader | “A brush cleans a reader.” | Cleaning is not wrench repair; restore west, scan the gardener-repaired bell, return it. |
| 13 · Service Line | “The helper sealed this box after testing it.” | West repair, east clean, east scan, helper box delivery to dispatch. |
| 14 · Two Machines | “The gardener tested this bell after repairing it.” | Two ordered repairs, bell delivery, then a twice-counted token's scan/delivery. |
| 15 · Workshop Finale | “The helper packed this box after it had dried.” | Repair/clean before processing the dry box; then return the bell checked before packing. |
| 16 · Platform West | “The helper received this box from the coast after noon.” | Origin and time both matter; scan east then west before dispatch. |
| 17 · Return Service | “The inspector rejected this token because its date was wrong.” | Rejected token first, accepted bell second, with different scan/delivery routes. |
| 18 · Before Departure | “The helper sealed this box before the train arrived.” | Arrival/departure and `before`/`after` identify two boxes processed in explicit order. |
| 19 · The Passenger Request | “The gardener lent this bell to the passenger.” | Reversing lender and borrower changes the target; complete both passenger requests. |
| 20 · Last Train | “The helper signed for this box, but the inspector did not open it.” | Negative action history matters; two box scans precede dispatch, then process the bell. |
| 21 · The Original | “The artist made this bell; the gardener later repaired it.” | Maker and repairer are not interchangeable; certify the original west then east. |
| 22 · On Loan | “The museum borrowed this token from the school.” | Preserve borrowing/donation direction across two different deliveries. |
| 23 · Read the Record | “The helper moved this box to storage after the exhibition.” | Changed destination and event order create a near-match; two requests follow separate routes. |
| 24 · Two Signatures | “Both the curator and the helper inspected this box.” | `both` differs from only one inspector; box and bell histories require different evidence. |
| 25 · Museum Finale | “The school lent this token to the museum.” | Three exhibits, ordered deliveries and lender/receiver direction; map/trolley stay optional. |
| 26 · Rooftop Check | “The helper tested this bell after the storm but before the rain returned.” | Preserve both edges of a time window; three scans of the same bell. |
| 27 · Keep It Dry | “The gardener kept this token indoors throughout the storm.” | Continuous protection differs from moving it inside afterwards; box then token. |
| 28 · Chain of Custody | “The inspector returned this bell to the gardener, who kept it.” | Ownership direction and the recipient's added action; two scans per object. |
| 29 · Almost the Same | “The helper repaired this box instead of replacing it.” | Replacement differs from repair; process this box, a checked-but-unused bell and a saved token. |
| 30 · Rooftop Finale | “The helper checked this bell only after the gardener repaired it.” | Event order and who requested/performed actions identify three objects. |
| 31 · Opening Night | “The helper packed this box after checking every lamp.” | Preserve event order across three records, six item-specific scans and three deliveries. |
| 32 · Backstage | “The gardener gave this box to the helper, who sealed it.” | Recipient and sealing agent; lender direction and an unchanged label distinguish other requests. |
| 33 · Final Inspection | “The helper checked this box, but the inspector has not checked it yet.” | Negative current history, replacement cause and signature agent stay separate. |
| 34 · Precise Handover | “The school gave this token to the museum, which lent it to the festival.” | Institutions have distinct giver/recipient roles; added `which` clause preserves the lender. |
| 35 · The Grand Festival | “The helper sealed this box after the inspector checked it but before the gardener moved it.” | Multi-agent event order, the bell's three-action history and the token's loan/return chain complete the eleven-action finale. |

A permission does not create a mandatory checkpoint. Required station order is explicit in English; it does not add an unstated restriction on when a parcel can be picked up. Scan evidence stays with the physical item. Support, retry or a lost unaided-language mark does not prevent ordinary advancement after action completion. Larger task counts and closer contrasts are authored progression measures; no classroom study has established perceived difficulty, duration or learning gains.
