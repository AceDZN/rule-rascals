# Workbook hosting

The standalone campaign keeps its normal saved progression. An explicit `?level=1..35` opens that lesson's job paused with its English rules, ahead of the saved current level, without fabricating completion of earlier jobs. Source-grade labels in the Workbook catalog never limit the campaign.

The host bridge posts only to an embedding parent on Workbook subdomains or localhost. Required raccoon, helper and guard models must finish loading and reach an actual render before `ready`. A required model failure reports `error`, never `ready`. Normal play reports one `level-start` per state and one `level-complete` after actual success; completion duration uses active simulation time and excludes reading/pause. Reading, hints, failed attempts and repeated result review never fabricate completion. Standalone play posts nothing. No score or mastery is invented for the host.

`node --import tsx scripts/qa-workbook.cjs` checks all35 actual iframe links, required models, a genuine first-job completion, paused reading duration, result review/Next and a lesson35 link overriding an earned saved level2. `scripts/qa-workbook-negative.cjs` checks required-model failure and standalone silence. The test parent is a real local HTTP server; a route-fulfilled fake parent is blocked by Chromium private-network isolation and is not used as game failure evidence.

The game build keeps relative asset paths. Workbook's standard `pnpm games:release` uploads the clean tested `dist/` and `workbook/poster.png` to a new immutable R2 version, then updates `packages/catalog-games/src/games/rule-rascals.ts` in AceDZN/acedzn-tools. The poster is an actual final-campaign gameplay capture. No separate backend or game-hosting project is required.

Current verification:136 game tests, build/typecheck,35 real iframe openings, correct event ordering and negative cases pass. Curated evidence is in `docs/evidence/workbook/`.
