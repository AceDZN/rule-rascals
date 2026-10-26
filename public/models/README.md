# Local runtime models

These are actual original Tripo GLBs generated in the commissioned paid account, normally exported, inspected and integrated locally. Complete prompts, task URLs, paid-plan rights evidence, hashes and animation checks are in `ASSETS.md`.

| File | Bytes | Contents / normalization |
|---|---:|---|
| `raccoon.glb` | 1,922,172 | 65-joint Mixamo skin; actual idle, walk, run and custom carry clips; source height ≈1, front +Z; game height 1.7 m |
| `watering-helper.glb` | 990,732 | Fixed wheeled watering prop; no skin/clips by design; source height 1, front +Z; game height 1.5 m |
| `guard.glb` | 957,180 | Fixed wheeled guard prop; no skin/clips by design; source height 1, front +Z; game height 1.5 m |

Total: **3,870,084 bytes**. Every file is below 3 MB. Each preserves its original 1K embedded PBR textures; no geometry/texture optimization was needed. Runtime copies match their original export hashes.

The carry clip's exact exported name is `"Walk slowly in place in a seamless loop while carrying a small "` (63 characters, including its final space, excluding the displayed quotes). The generated pose is a low carry rather than a perfect chest-height two-hand grip. Clip copies receive initial horizontal hips-offset alignment in the runtime adapter; GLB files remain unchanged.

The bell and other small props are authored geometry. The three-model generation allowance has been exhausted; no missing bell GLB is requested by the application. Prototype art for the rigid sweeper and load-failure fallback is documented separately.
