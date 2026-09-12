import Phaser from 'phaser';

export type SceneryType = 'forest' | 'space' | 'mountain' | 'city';

export interface EnvironmentInfo {
  themeName: string;
  sceneryType: SceneryType;
  bgColor: number;
  floorColor: number;
  gridLineColor: number;
  wallColor: number;
  propKeys: string[];
}

export class EnvironmentManager {
  private static themeMap: Record<number, EnvironmentInfo> = {
    // 🌲 Theme 1: Lush Swaying Green Grass Meadow & Moving Sky Clouds (Levels 1 - 5)
    1: { themeName: 'SUNRISE GRASS MEADOW', sceneryType: 'forest', bgColor: 0x38bdf8, floorColor: 0x15803d, gridLineColor: 0x4ade80, wallColor: 0x166534, propKeys: ['prop_tree_oak', 'prop_tree_birch', 'prop_tree_pine', 'prop_tree_sakura', 'prop_flower_red', 'prop_flower_yellow', 'prop_grass_tuft'] },
    2: { themeName: 'WINDY PRAIRIE RUN', sceneryType: 'forest', bgColor: 0x38bdf8, floorColor: 0x166534, gridLineColor: 0x86efac, wallColor: 0x15803d, propKeys: ['prop_tree_oak', 'prop_tree_pine', 'prop_flower_yellow', 'prop_grass_tuft', 'prop_tree_birch', 'prop_tree_sakura'] },
    3: { themeName: 'MORNING FLOWER MEADOW', sceneryType: 'forest', bgColor: 0x38bdf8, floorColor: 0x15803d, gridLineColor: 0xfde047, wallColor: 0x166534, propKeys: ['prop_tree_birch', 'prop_tree_oak', 'prop_tree_pine', 'prop_flower_red', 'prop_grass_tuft', 'prop_tree_sakura'] },
    4: { themeName: 'EMERALD BREEZE WOODS', sceneryType: 'forest', bgColor: 0x38bdf8, floorColor: 0x166534, gridLineColor: 0x34d399, wallColor: 0x15803d, propKeys: ['prop_tree_pine', 'prop_tree_oak', 'prop_flower_yellow', 'prop_tree_birch', 'prop_grass_tuft', 'prop_tree_sakura'] },
    5: { themeName: 'GOLDEN SKY MEADOW', sceneryType: 'forest', bgColor: 0x38bdf8, floorColor: 0x15803d, gridLineColor: 0x4ade80, wallColor: 0x166534, propKeys: ['prop_tree_oak', 'prop_tree_pine', 'prop_tree_birch', 'prop_flower_red', 'prop_grass_tuft', 'prop_tree_sakura'] },

    // 🌌 Theme 2: Cosmic Space & Nebulae / Stars (Levels 6 - 10)
    6: { themeName: 'COSMIC VOID', sceneryType: 'space', bgColor: 0x030712, floorColor: 0x0b0f19, gridLineColor: 0x00f0ff, wallColor: 0x1e1b4b, propKeys: ['prop_crystal_cosmic', 'prop_rock_mossy', 'prop_tree_sakura', 'prop_crystal_cosmic'] },
    7: { themeName: 'NEBULA STARFIELD', sceneryType: 'space', bgColor: 0x030712, floorColor: 0x0f172a, gridLineColor: 0xa855f7, wallColor: 0x312e81, propKeys: ['prop_crystal_cosmic', 'prop_tree_birch', 'prop_rock_mossy', 'prop_flower_red'] },
    8: { themeName: 'STARDUST GALAXY', sceneryType: 'space', bgColor: 0x050515, floorColor: 0x090514, gridLineColor: 0xff0077, wallColor: 0x4c1d95, propKeys: ['prop_crystal_cosmic', 'prop_rock_mossy', 'prop_tree_oak', 'prop_crystal_cosmic'] },
    9: { themeName: 'SATURN RING WAY', sceneryType: 'space', bgColor: 0x030712, floorColor: 0x0b0f19, gridLineColor: 0xf59e0b, wallColor: 0x1e293b, propKeys: ['prop_crystal_cosmic', 'prop_tree_pine', 'prop_rock_mossy', 'prop_flower_yellow'] },
    10: { themeName: 'DEEP SPACE CORE', sceneryType: 'space', bgColor: 0x020308, floorColor: 0x070913, gridLineColor: 0x38bdf8, wallColor: 0x0f172a, propKeys: ['prop_crystal_cosmic', 'prop_rock_mossy', 'prop_tree_sakura', 'prop_crystal_cosmic'] },

    // 🏔️ Theme 3: Snow Mountain & Floral Valley (Levels 11 - 15)
    11: { themeName: 'SNOW PEAK PASS', sceneryType: 'mountain', bgColor: 0x0f172a, floorColor: 0x1e293b, gridLineColor: 0x38bdf8, wallColor: 0x334155, propKeys: ['prop_tree_sakura', 'prop_tree_pine', 'prop_flower_red', 'prop_tree_oak', 'prop_rock_mossy'] },
    12: { themeName: 'SAKURA VALLEY', sceneryType: 'mountain', bgColor: 0x1e1b4b, floorColor: 0x312e81, gridLineColor: 0xf472b6, wallColor: 0x4c1d95, propKeys: ['prop_tree_sakura', 'prop_tree_oak', 'prop_flower_yellow', 'prop_tree_pine', 'prop_flower_red'] },
    13: { themeName: 'ALPINE MEADOW', sceneryType: 'mountain', bgColor: 0x0f172a, floorColor: 0x1e293b, gridLineColor: 0xa7f3d0, wallColor: 0x047857, propKeys: ['prop_tree_pine', 'prop_tree_sakura', 'prop_flower_red', 'prop_rock_mossy', 'prop_tree_birch'] },
    14: { themeName: 'FLOWER RIDGE', sceneryType: 'mountain', bgColor: 0x1e1b4b, floorColor: 0x312e81, gridLineColor: 0xf43f5e, wallColor: 0x881337, propKeys: ['prop_tree_sakura', 'prop_flower_red', 'prop_flower_yellow', 'prop_tree_oak', 'prop_tree_birch'] },
    15: { themeName: 'SUNSET PEAKS', sceneryType: 'mountain', bgColor: 0x1e1b4b, floorColor: 0x311042, gridLineColor: 0xfb923c, wallColor: 0x581c87, propKeys: ['prop_tree_pine', 'prop_tree_sakura', 'prop_flower_red', 'prop_rock_mossy', 'prop_tree_oak'] },

    // 🏙️ Theme 4: Cyber City Metro (Levels 16 - 20)
    16: { themeName: 'CYBER CITY RUN', sceneryType: 'city', bgColor: 0x030712, floorColor: 0x0f172a, gridLineColor: 0x00f0ff, wallColor: 0x1e293b, propKeys: ['prop_neon_palm', 'prop_cyber_billboard', 'prop_tree_oak', 'prop_neon_palm'] },
    17: { themeName: 'NEON METROPOLIS', sceneryType: 'city', bgColor: 0x030712, floorColor: 0x0f172a, gridLineColor: 0xff0077, wallColor: 0x311042, propKeys: ['prop_cyber_billboard', 'prop_neon_palm', 'prop_tree_birch', 'prop_cyber_billboard'] },
    18: { themeName: 'SKYLINE HIGHWAY', sceneryType: 'city', bgColor: 0x050716, floorColor: 0x0b0f19, gridLineColor: 0xeab308, wallColor: 0x1e293b, propKeys: ['prop_neon_palm', 'prop_cyber_billboard', 'prop_tree_pine', 'prop_neon_palm'] },
    19: { themeName: 'MAGNETIC LAB METRO', sceneryType: 'city', bgColor: 0x030712, floorColor: 0x0b0f19, gridLineColor: 0x00f0ff, wallColor: 0x1e293b, propKeys: ['prop_cyber_billboard', 'prop_neon_palm', 'prop_rock_mossy', 'prop_cyber_billboard'] },
    20: { themeName: 'ULTIMATE CYBER CORE', sceneryType: 'city', bgColor: 0x030712, floorColor: 0x090514, gridLineColor: 0xff0077, wallColor: 0x3b0764, propKeys: ['prop_neon_palm', 'prop_cyber_billboard', 'prop_tree_sakura', 'prop_neon_palm'] }
  };

  public static getEnvironmentInfo(levelId: number): EnvironmentInfo {
    return this.themeMap[levelId] || this.themeMap[1];
  }

  public static renderLevelEnvironment(scene: Phaser.Scene, levelId: number): EnvironmentInfo {
    const info = this.getEnvironmentInfo(levelId);
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;

    // 1. Base Floor Graphics
    const floorG = scene.add.graphics();
    floorG.fillStyle(info.floorColor, 1);
    floorG.fillRect(0, 0, width, height);

    // Grid / Tile Pattern
    floorG.lineStyle(1, info.gridLineColor, 0.15);
    for (let x = 0; x < width; x += 60) {
      floorG.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 60) {
      floorG.lineBetween(0, y, width, y);
    }

    // 2. Perimeter Wall Borders (2.5D Physical Depth)
    floorG.fillStyle(info.wallColor, 1);
    floorG.fillRect(0, 0, width, 70); // Top wall HUD area
    floorG.fillRect(0, height - 20, width, 20); // Bottom wall border
    floorG.fillRect(0, 0, 20, height); // Left wall border
    floorG.fillRect(width - 20, 0, 20, height); // Right wall border

    floorG.lineStyle(2, info.gridLineColor, 0.6);
    floorG.strokeRect(20, 70, width - 40, height - 90);

    // 3. Spawn Static Background Props for Location Feel
    info.propKeys.forEach((key, index) => {
      const px = index === 0 ? 120 : width - 150;
      const py = index === 0 ? 140 : height - 120;
      const propSprite = scene.add.sprite(px, py, key).setAlpha(0.85);
      // Give static prop physics body to block player slightly or act as obstacle
      scene.physics.add.existing(propSprite, true);
    });

    return info;
  }
}
