import Phaser from 'phaser';

export interface EnvironmentInfo {
  themeName: string;
  bgColor: number;
  floorColor: number;
  gridLineColor: number;
  wallColor: number;
  propKeys: string[];
}

export class EnvironmentManager {
  private static themeMap: Record<number, EnvironmentInfo> = {
    1: { themeName: 'CITY STREET', bgColor: 0x0f172a, floorColor: 0x1e293b, gridLineColor: 0xeab308, wallColor: 0x334155, propKeys: ['prop_car', 'prop_bench'] },
    2: { themeName: 'DOWNTOWN ALLEY', bgColor: 0x0f172a, floorColor: 0x1e293b, gridLineColor: 0x64748b, wallColor: 0x475569, propKeys: ['prop_car', 'prop_bench', 'prop_box'] },
    3: { themeName: 'AUTO WORKSHOP', bgColor: 0x18181b, floorColor: 0x27272a, gridLineColor: 0x3f3f46, wallColor: 0x52525b, propKeys: ['prop_box', 'prop_car'] },
    4: { themeName: 'REPAIR BAY', bgColor: 0x18181b, floorColor: 0x27272a, gridLineColor: 0x00f0ff, wallColor: 0x3f3f46, propKeys: ['prop_box', 'prop_bench'] },
    5: { themeName: 'CARGO WAREHOUSE', bgColor: 0x1c1917, floorColor: 0x292524, gridLineColor: 0x78350f, wallColor: 0x44403c, propKeys: ['prop_box', 'prop_box'] },
    6: { themeName: 'STORAGE BAY B', bgColor: 0x1c1917, floorColor: 0x292524, gridLineColor: 0xd97706, wallColor: 0x57534e, propKeys: ['prop_box', 'prop_cart'] },
    7: { themeName: 'CONSTRUCTION SITE', bgColor: 0x1c1917, floorColor: 0x451a03, gridLineColor: 0xf97316, wallColor: 0x78350f, propKeys: ['prop_cone', 'prop_box'] },
    8: { themeName: 'SCAFFOLD TOWER', bgColor: 0x1c1917, floorColor: 0x451a03, gridLineColor: 0xfacc15, wallColor: 0x92400e, propKeys: ['prop_cone', 'prop_bench'] },
    9: { themeName: 'TRAIN STATION PLATFORM', bgColor: 0x090d16, floorColor: 0x1e293b, gridLineColor: 0xeab308, wallColor: 0x334155, propKeys: ['prop_bench', 'prop_bench'] },
    10: { themeName: 'SUBWAY TERMINAL', bgColor: 0x090d16, floorColor: 0x1e293b, gridLineColor: 0x00f0ff, wallColor: 0x475569, propKeys: ['prop_bench', 'prop_box'] },
    11: { themeName: 'SUPERMARKET STORAGE', bgColor: 0x0f172a, floorColor: 0x334155, gridLineColor: 0x38bdf8, wallColor: 0x475569, propKeys: ['prop_cart', 'prop_box'] },
    12: { themeName: 'GROCERY LOADING DOCK', bgColor: 0x0f172a, floorColor: 0x334155, gridLineColor: 0x60a5fa, wallColor: 0x64748b, propKeys: ['prop_cart', 'prop_box'] },
    13: { themeName: 'AUTO GARAGE', bgColor: 0x18181b, floorColor: 0x27272a, gridLineColor: 0xef4444, wallColor: 0x52525b, propKeys: ['prop_car', 'prop_box'] },
    14: { themeName: 'TUNING SHOP', bgColor: 0x18181b, floorColor: 0x27272a, gridLineColor: 0xf59e0b, wallColor: 0x3f3f46, propKeys: ['prop_car', 'prop_bench'] },
    15: { themeName: 'HEAVY FACTORY', bgColor: 0x0f172a, floorColor: 0x1e1b4b, gridLineColor: 0x6366f1, wallColor: 0x312e81, propKeys: ['prop_box', 'prop_reactor'] },
    16: { themeName: 'ASSEMBLY LINE', bgColor: 0x0f172a, floorColor: 0x1e1b4b, gridLineColor: 0xa855f7, wallColor: 0x4c1d95, propKeys: ['prop_reactor', 'prop_box'] },
    17: { themeName: 'SCRAP JUNKYARD', bgColor: 0x1c1917, floorColor: 0x292524, gridLineColor: 0xb45309, wallColor: 0x44403c, propKeys: ['prop_car', 'prop_box'] },
    18: { themeName: 'CRUSHING YARD', bgColor: 0x1c1917, floorColor: 0x292524, gridLineColor: 0xef4444, wallColor: 0x57534e, propKeys: ['prop_car', 'prop_cone'] },
    19: { themeName: 'MAGNETIC LAB', bgColor: 0x030712, floorColor: 0x0b0f19, gridLineColor: 0x00f0ff, wallColor: 0x1e293b, propKeys: ['prop_reactor', 'prop_reactor'] },
    20: { themeName: 'ULTIMATE MAGNET CORE', bgColor: 0x030712, floorColor: 0x090514, gridLineColor: 0xff0077, wallColor: 0x3b0764, propKeys: ['prop_reactor', 'prop_reactor'] }
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
