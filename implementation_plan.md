# Implementation Plan - Magnet Mania Visual & Gameplay Redesign

This plan redefines **MAGNET MANIA** from an abstract demo into a polished, stylized 2.5D casual game featuring a **Human Character** equipped with a magnetic gauntlet/device, **10 Real-World Environment Themes**, **Dynamic Arc Beam Magnetic Force Visuals**, and **Enhanced Level Progression**.

---

## User Review Required

> [!IMPORTANT]
> The abstract ball player will be replaced with a **Human Hero Character** with a glowing magnetic glove & suit, supporting animations (Idle, Walk, Attract, Damage, Celebration).
> The neon grid background will be replaced with **10 Real-World Environment Themes** (Street, Workshop, Warehouse, Construction Site, Train Station, Supermarket, Garage, Factory, Junkyard, Magnetic Facility).

---

## Open Questions

1. **Camera Angle**:
   - Target: Polished 2.5D top-down / 3/4 angled view where walls, floor tiles, and props create physical depth while keeping 2D Phaser Arcade physics fast and responsive. Is this presentation ideal? *(Recommended)*

---

## Proposed Changes

### Art & Procedural Graphic Generation

#### [NEW] [src/game/systems/ArtGenerator.ts](file:///d:/projects/magnet%20mania/src/game/systems/ArtGenerator.ts)
- Generate procedural sprite sheets & graphics for:
  - **Human Character**: Young hero with stylized magnetic suit, visor, magnetic backpack, and glowing magnetic glove.
  - **10 Environment Props**: Parked cars, benches, street lights, workbenches, tool racks, wooden pallets, cardboard boxes, traffic cones, hazard barrels, train seats, shopping carts, scrap metal.
  - **Realistic Items**: Gold coins, silver tokens, energy cells, power batteries, wrenches, rusty scrap metal, magnetic bombs, sharp gears.

---

### Player Entity & Magnetic Physics

#### [NEW] [src/game/entities/HumanPlayer.ts](file:///d:/projects/magnet%20mania/src/game/entities/HumanPlayer.ts)
- Replaces ball entity with a Human Character container:
  - Rotates gauntlet toward mouse/touch target.
  - Controls animations (`idle`, `walk`, `attract`, `damaged`, `celebrate`).
  - Emits magnetic energy arcs and particles from gauntlet during attraction.

#### [MODIFY] [src/game/scenes/GameScene.ts](file:///d:/projects/magnet%20mania/src/game/scenes/GameScene.ts)
- Render dynamic **curved magnetic force lines** (cyan/blue lightning bezier arcs) between the player's magnetic glove and all attracted objects inside radius.
- Implement camera shake on damage and floating text popups.
- Integrate 20-level environment themes and level progression objectives.

---

### Environment & Level Architecture

#### [NEW] [src/game/systems/EnvironmentManager.ts](file:///d:/projects/magnet%20mania/src/game/systems/EnvironmentManager.ts)
- Renders rich themed environments for all 20 levels:
  1. **Levels 1-2**: City Street (Asphalt, sidewalk tiles, street lamps, bench, fire hydrant).
  2. **Levels 3-4**: Auto Workshop (Concrete floor, workbenches, oil barrels, tires).
  3. **Levels 5-6**: Cargo Warehouse (Wood floor, pallets, stacked boxes, steel racks).
  4. **Levels 7-8**: Construction Site (Dirt ground, caution barriers, scaffolding).
  5. **Levels 9-10**: Train Station (Tiled floor, track lines, station benches).
  6. **Levels 11-12**: Supermarket (Linoleum floor, shopping aisles, carts).
  7. **Levels 13-14**: Auto Garage (Tire tracks, car lift, fuel drums).
  8. **Levels 15-16**: Heavy Factory (Metal floor plates, steaming pipes, hazard tape).
  9. **Levels 17-18**: Scrap Junkyard (Rusted metal piles, scrap containers).
  10. **Levels 19-20**: Ultimate Magnet Core Facility (Futuristic plasma channels, core reactors).

---

### HUD & Progression Screens

#### [MODIFY] [src/game/scenes/MainMenuScene.ts](file:///d:/projects/magnet%20mania/src/game/scenes/MainMenuScene.ts)
- Update Main Menu background with animated city street / magnetic workshop environment backdrop.

#### [NEW] [src/game/scenes/LevelSelectScene.ts](file:///d:/projects/magnet%20mania/src/game/scenes/LevelSelectScene.ts)
- Level selection grid showing levels 1 to 20, unlocked status, environment theme badges, and 1-3 star progress.

#### [MODIFY] [src/game/scenes/GameScene.ts](file:///d:/projects/magnet%20mania/src/game/scenes/GameScene.ts)
- Redesign HUD with top-left Hearts (❤️ ❤️ ❤️), top-center Level Title, top-right Score & Stars (⭐ 1250), Magnet Power progress bar (`MAGNET POWER [████████░░ 80%]`), and dynamic `COMBO x3` popup.
- Level Completed screen showing Star ratings (1-3 stars), score breakdown, completion time, and Next Level Environment preview card.

---

## Verification Plan

### Automated Verification
- Run `npx tsc --noEmit` to verify type safety across all new modules.
- Run `npm run build` to ensure static production bundle compiles cleanly.

### Browser Verification
- Launch `npm run dev` and test via `browser_subagent`:
  1. Main menu loads with updated theme artwork.
  2. Level Select screen shows 20 levels with environment badges.
  3. Human Player character moves in 2.5D environment with walking animation.
  4. Magnetic force curved beams pull coins and energy cells towards glove.
  5. Collecting bad objects triggers camera shake and damage animation.
  6. Completing level displays 1-3 stars, score summary, and next level preview.
