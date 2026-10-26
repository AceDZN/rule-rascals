# Curriculum mapping

Rule Rascals is an original action scenario for Hebrew-speaking Israeli grade-8 learners. The saved Workbook snapshots under `docs/curriculum/` are the content authority. This slice practices interpretation through action; it does not assess productive grammar, speaking, or demonstrate learning gains.

Sources:

- [Rules, Permission, and Obligation](https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation)
- [Relative Clauses Reference](https://english.workbook.co.il/grade-8/chapter-11/relative-clauses-reference)

All scenario sentences below are original fixtures. Workbook's junior-high scope informs the design; this is not a claim of Ministry approval or of A2 mastery. A2 is a junior-high exit reference, not a grade-8 result established by this game.

## Five heists

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
- In these defining clauses there are no separating commas. `who` refers to the personified robot character; `that` identifies the key, bell or box. This does not teach that `that` replaces every `who` or `which`, particularly in non-defining clauses.
- The subject/object distinction is practiced through action history: the gardener polished the bell; the helper placed the box. No separate claim of full syntactic analysis is made.

## Support, evidence and scoring

Hebrew onboarding, controls and short error explanations surround explicitly LTR English notices. Reading a notice pauses pressure. Vocabulary/translation is available on demand; opening solution support marks that attempt as assisted. Reading the ordinary English notice is part of the unaided task, not assistance. The transfer heist offers no solution hint identifying the helper or target.

Action completion and language evidence are separate. A stealth bypass can earn action completion without a language-evidence mark. Local event records should include challenge, relevant action/condition, success, support use, retries and unaided flag, with no personal learner data or remote analytics. A correct attempt is evidence of that game's decision, not proof that the learner read or mastered the grammar. Repeated or supported success must not be counted as a first unaided decision.

## Verification status

Mapping and semantic constraints reviewed against both saved snapshots. The current suite passes 41 cases: the preserved 31 baseline checks plus ten watched-token regressions. Implementation/browser verification is recorded in `docs/ENGLISH_REVIEW.md` and `PLAYTEST.md`; a semantic pass alone does not verify acquired models or classroom outcomes.
