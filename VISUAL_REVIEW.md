# Generated target versus actual game

The built-in image_gen target was generated and inspected **before source implementation**. `docs/visual-targets/target-01.png` is concept art for an intended gameplay frame, not a screenshot of software. The exact submitted prompt and mode are adjacent. It informed the authored 3D world; it is not used as a fake gameplay background.

The lead and art owner inspected actual browser captures, including `docs/evidence/garden-first.png`, `01-token-carry.png`, `03-escort-carry.png`, `04-bell-carry.png` and `05-helper-handoff.png`.

| Target | Actual and revision |
| --- | --- |
| Sunlit cream stone, jade foliage, tomato accents, yellow-scarfed raccoon | Matching broad palette, soft ambient light and real directional shadows. Original low-poly procedural characters and vegetation are visibly simpler than target detail. |
| Oblique third-person composition with visible player, cover, helper and store | Initial overview made the raccoon too small. Camera was moved closer/lower, follows the player, and the raccoon scaled up for readability. The final view remains a wider orthographic toy-garden view than the lower target camera. |
| Raised planters as meaningful cover | Solid authored planter colliders actually block movement and guard sight. The guard cone was changed to clip against the same cover rather than painting through it. |
| Glazed conservatory and a readable side gate | Translucent roof/side glazing, jade ribs, cream entry arch, interior pot shelf and bell pedestals added after first visual review. Front wall/roof ribs can still partially hide the player; further adaptive fading would improve this. |
| Small rule strip and pocket inventory | Small pinned English notice, Hebrew controls and discreet pockets retained. Full rules/translation move to a paused sheet. No answer-selection doors or educational dashboard. |
| Raccoon animation and wheeled helper with useful actions | Visible rigid-part run/carry motion, equipped badge, helper following/cargo, dropped objects and tossed toy. **Required Tripo GLB, skin rig and animation clips are absent.** The prototype's art does not meet that acquisition/rig requirement. |
| Bell on a store shelf and visible observed history | Bell pedestals/interior shelf establish the display area. Persistent English inspection logs identify polishing/placement history. A simple cloth motion suggests polishing; this is not a detailed historical cutscene. |

The final scene fills most of the gameplay viewport and shows actual carry, escort and handoff decisions. It does not reproduce the generated image's photoreal foliage, fur or cinematic detail. A successful functional slice is not evidence of asset completion, measured fun or learning gains.
