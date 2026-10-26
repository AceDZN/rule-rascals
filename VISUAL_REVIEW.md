# Generated targets versus actual game

Both saved images are built-in imagegen **design targets**, not software screenshots. Target 01 and its exact prompt were generated and inspected before the initial implementation. Target 02 and its prompt were generated and inspected before the resumed chase/visibility changes. The targets are preserved unchanged in docs/visual-targets.

The resumed pass captured and visually inspected actual gameplay at **1672×941**, the same viewport as both targets. The `rigged-` captures show the current local models, not procedural mascot substitutes. Historical captures remain in docs/evidence for comparison.

| Target cue | Actual result and revision |
| --- | --- |
| Yellow-scarfed raccoon with distinctive mask and tail | Original Tripo model now replaces the primitive mascot.65-joint Mixamo skin and actual idle/walk/run/generated carry clips play locally. Badge, backpack and carried cargo attach to observed bones. A source sprint offset was corrected in playback so the mesh stays aligned with its collider. |
| Cream/jade garden, tomato accents, warm shadows | Broad palette and directional shadows match. The acquired cream watering robot and red guard are distinct original assets. Stone, foliage and garden architecture remain simpler flat-shaded authored geometry. |
| Low oblique composition, large hero, nearby cover/helper/gate | Camera moved closer/lower and follows more closely. The mascot is readable during movement, escort and carry. The playable view deliberately remains a higher orthographic garden diorama so patrols and routes remain visible; it does not reproduce the target's cinematic low camera or subject scale. |
| Meaningful raised-planter cover | Authored planters block both movement and actual guard sight. The rendered cone clips against those obstacles. Visual fading does not change semantic colliders or detection. |
| Conservatory with readable entry and visible mascot | Walls, glazing, ribs and signs fade while player/helper cargo is inside. Foreground boundary trees fade only when they cross the camera-to-player sight ray. These changes repair the raccoon/cargo occlusion found by real screenshot review. |
| Distracted guard and tossed red toy | Dedicated square '?' replaces a persistent chase mark while distracted; cone and meter suppress during that state. Visible toss arc and expanding sound rings communicate the finite distraction even behind scenery. Chase '!' uses a separate large glyph. |
| Small contextual English strip and quiet pockets | Hebrew shell and LTR task text retained. H1 pins its watched-token condition while carrying; H4 pins the watched-bell condition after unlocking. Rules, vocabulary and translation pause play. Dynamic placement keeps long mobile rules above the objective and suspicion meter. |
| Escort, object history and transfer actions | Actual local helper follows through the door and transports the selected box through the arch. Inspected logs supply key/bell/box history. Similar objects do not carry correct-answer beacons. |

Final actual evidence includes rigged-01-token-carry.png, rigged-03-escort-carry.png, rigged-04-bell-carry.png, rigged-05-helper-handoff.png and rigged-05-transfer-success.png. Dedicated gate/cover captures show the corresponding target interactions. The final web-game client image is skill-rigged-gameplay.png. Independent chase/touch captures and review are recorded separately.

The real asset/rig requirement is fulfilled for the acquired raccoon/helper/guard. The generated targets still have finer fur, vegetation, material texture and cinematic lighting than the actual game. Carry contact is approximate at the waist/lower chest, robot motion is rigid, and the bell/history performance is simple authored motion rather than a detailed cutscene. Functional browser completion is not evidence of fun or learning gains.
