# Rule Rascals — שובבים לפי הכללים

Read COMMON.md first. Your repo: `/Users/acedzn/dev/AceDZN-exp/rule-rascals`. Dev 5203, preview 4203. Public origin AceDZN/rule-rascals; verify. You own this game only. Build here with two helper agents and the required imagegen-first, Chrome/Tripo workflow.

## The game

A playful 3D stealth heist in a robot-run garden exhibition. A raccoon wants to retrieve the town festival bell. Sneak past patrols, carry objects, wear a helper badge, squeak distractions, follow an authorized helper through a gate, and escape with the correct prize. Guards enforce posted natural-language rules about who can do what, where and under which conditions. English tells you a valid plan; it never opens a door because you selected a verb on a worksheet.

Mechanics from Untitled Goose Game (837470) × Monaco: What's Yours Is Mine (113020); original setting/art/levels. Pair cosine .426; centroid NN .845, isolation 9.0%, relatedness passes shared-tag rule. These are seed-blend metrics, not new-game novelty or learning results.

First minute: inspect “Visitors must wear a badge”; find a badge, equip it; see a narrow guard patrol, dash between planters, read “Visitors mustn't enter the store without a helper”; identify the actual helper by “the robot who waters the plants”, follow that robot into the store; squeak a toy to divert a patrol; grab the bell. A mistake triggers an amusing chase and a short stash reset, not a punitive reading test. Stop time when inspecting a rule or vocabulary. Optional medals begin after planning.

## Visual identity

Bright late-afternoon garden, chalky jade foliage, cream plaster, black-ink outlines, tomato-red accents and a yellow raccoon scarf. Slightly low oblique follow camera, playable compact outdoor scene with raised planters and a glass conservatory. Elastic run/stop/carry animation, crisp shadows and readable guard attention. Distinct from kitchen orange/aubergine and the station's dark teal mechanical diorama. Keep cover physically meaningful; the scene is a playground, not a corridor of quiz doors. Small pinned rule strip, subtle pocket inventory, immediate contextual actions, no persistent text wall.

## Curriculum

Grade 8:

- https://english.workbook.co.il/grade-8/chapter-5/rules-permission-and-obligation
- https://english.workbook.co.il/grade-8/chapter-11/relative-clauses-reference

Read saved docs/curriculum. Preserve meanings:

- must = required; mustn't = forbidden; can here = permitted, not physical ability.
- don't have to / optional leaves a choice; never treat it as a prohibition or enforce it as an obligation.
- preserve conditions like without a helper and during opening hours. A prohibition on unaccompanied entry is not a total prohibition on entry.
- who identifies people; which/that identify things in defining clauses, no comma separation. Do not teach that that replaces who/which in every grammatical context.
- distinguishing “the robot who waters plants” from “the robot who I helped” means identifying agent/receiver, not just matching a repeated noun.

Primary learning is interpreting functional rules and identifying descriptions in order to act. No claim of productive grammar mastery from this alone.

## Authoritative simulation rules

Kinematic player and 2–3 deterministic robot patrols suffice. Guards have a state machine (patrol, suspicious, chase, return); occlusion/cover and distance affect sight. Rule conditions evaluate actual player role/badge/cargo/position and the authorized helper's proximity. The badge authorizes visitor status; helper escort requires the real helper, not any nearby robot. A helper follows a short scripted watering route, or can be politely requested to escort via one complete English request. Record exact logic and content together.

Guards only detect violations they can observe; normal physical cover and distraction matter. Rules are not arbitrary invisible force fields. Bell recovery is possible through a lawful escort route; alternate stealth solutions can earn a different action medal if valid. Do not call a complete run a language success when it bypassed all text via brute force. Learning telemetry tags which relevant conditions/descriptions were used and whether support was opened.

## Five escalating heists in a compact garden

1. **Badge first.** “Visitors must wear a badge.” “You can use the garden path.” Take and wear a badge, sneak past patrol to recover a small token, exit. First understand movement, cover and equip, with no relative-clause complication.
2. **Optional is optional.** Add “You don't have to take a map.” Both map and no-map runs win; a map reveals only visited layout and never the correct target. A separate rule “You mustn't leave bags in the doorway” produces a consequence only for an actual blocking bag. Test both optional branches. Do not turn reading speed into pressure.
3. **Keep the condition.** “Visitors mustn't enter the store without a helper.” Follow the real helper through the door. Identification: “Ask the robot who waters the plants.” There are at least two robots so description matters; one sweeps, one waters. Without-helper entry triggers a recoverable chase when observed; escorted entry is valid.
4. **Which object?** “Use the key that opens the side door.” A short original clue identifies a bell among two near-matches: “Take the bell that the gardener polished.” Show the gardener polishing during observation, but vary which bell carries that history. Use a distraction to gain access; taking the other bell remains a funny but incomplete physical heist, not a quiz answer modal. Keep clues sufficient and consistent.
5. **Transfer heist.** New arrangement and rules: “Helpers can carry boxes through the arch.” “Visitors must leave large bags outside.” “You don't have to use the trolley.” Target: “Take the box that the helper placed beside the fountain.” Player obtains the right authorized role/escort as explicitly described; resolve carry permissions and identify the correct box, then escape. If a visitor cannot carry a box through the arch, offer the helper carrying the box after a request; do not let merely wearing a visitor badge imply helper status. No hint identifying correct target. Old memorized badge-and-sprint sequence cannot win; the text supplies a changed viable plan.

Reviewer may tighten heist 5 to preserve compact scope, but optional/forbidden distinction and a changed object description must remain. Five challenges total 6–10 minutes. Single-player; no online co-op required.

## Tripo assets

In your own user Chrome tab, search owned assets then generate up to three models: (1) original biped raccoon adventurer in A pose, **Tripo rig and walk/run/carry**; (2) friendly watering robot helper, rig if using articulated character animation; (3) brass festival bell if no suitable owned prop. Build accurate cover/architecture/colliders and rule signs procedurally. If the helper is a wheeled rigid mechanical prop with no articulated animation, document that and animate it as a rigid body; don't claim it has a character rig. Never copy the goose character/art. No purchases, record task URLs, credits, license/ownership, GLBs and hashes in ASSETS.md.

Character prompt: “Rule Rascals original game mascot, single full-body biped raccoon with a yellow neck scarf and small utility belt, friendly cheeky expression, clean separated limbs in a neutral A pose, stylized hand-painted game-ready mesh, sturdy paws and ringed tail clear of legs, no tools held no base no scenery no text, suitable for humanoid auto-rig and full-body walk run carry animation.”

## Generate the target first

Use built-in imagegen via the provided skill. Save prompt/output in docs/visual-targets before implementation.

> Use case: ui-mockup. Asset type: functional gameplay design target for a browser 3D stealth game. Create one believable 16:9 gameplay frame of Rule Rascals. A cheeky biped raccoon with a yellow scarf and small visitor badge crouches behind a raised jade-green planter in a sunlit cream-plaster exhibition garden. A glass conservatory and a side gate establish a compact navigable 3D playground. A friendly wheeled watering robot is about to pass through the gate, while a second guard robot looks toward a squeaky toy near the path. A small brass festival bell sits visibly on a shelf inside the store. Crisp dark outlines, warm pale stone, textured chalky foliage, tomato-red accents, elastic animation feel, polished achievable Three.js rendering. Camera is an oblique third-person view showing cover, the player, helper and gate in one coherent play space. A small pinned English rule strip reads exactly “Visitors mustn't enter without a helper.” A tiny world sign near the entrance reads “Wear a badge.” Bottom-left pocket UI shows a badge and squeaky toy; bottom-right tiny text “E · Follow”. The physical game world fills at least 85 percent of frame. No title screen, browser chrome, educational quiz options, card dashboard or giant text blocks. Show the stealth decision and impending action clearly; original characters and environment, no existing game IP.

Optional second frame: same garden during a funny recoverable chase, raccoon carrying the wrong bell and guard pointing toward the correct rule sign. Preserve camera/palette/HUD, and ensure any feedback does not reveal a textual identification answer automatically.

## Acceptance

Real 3D sneaking, carrying/equipping, cover/detection, distraction and escort; guards react to actual rules; five escalating heists incl. transfer; optional-map and optional-trolley routes both allowed. Test must/mustn't/optional, escort conditions, role identity, relative-clause object history and all level solutions. Browser complete win → next level, observed violation → chase → recovery, pause/read/restart, hint and mobile. Tripo raccoon with actual full-body rig/animation and at least one prop/helper integrated. Compare actual gameplay to generated target; document truthful differences. Build/typecheck/tests, public main pushed, live play URL and known limitations. Keep building until the slice is playable, not just a cute model walking around.
