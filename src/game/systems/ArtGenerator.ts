import Phaser from 'phaser';

export class ArtGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    this.generateHeroTextures(scene);
    this.generateObstacleTextures(scene);
    this.generateItemAndPowerupTextures(scene);
    this.generateTrackTextures(scene);
  }

  // 1. HIGH-DETAIL SUBWAY HERO RUNNER SPRITES
  private static generateHeroTextures(scene: Phaser.Scene): void {
    const drawHeroPose = (key: string, frameIndex: number, isPulse: boolean = false, isDamage: boolean = false) => {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      const w = 64;
      const h = 72;

      // Shadow under feet
      g.fillStyle(0x000000, 0.35);
      g.fillEllipse(32, 64, 36, 12);

      // Backpack Magnetic Reactor Core
      g.fillStyle(0x334155, 1);
      g.fillRoundedRect(14, 20, 36, 22, 6);
      g.fillStyle(isDamage ? 0xef4444 : 0x00f0ff, 1);
      g.fillCircle(32, 31, 7); // Core glow
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(32, 31, 3);

      // Legs / Sneakers (Running Leg Cycle)
      const legOffset = Math.sin((frameIndex * Math.PI) / 2) * 8;
      // Left leg
      g.fillStyle(0x1e293b, 1);
      g.fillRoundedRect(22 + legOffset, 42, 8, 18, 3);
      g.fillStyle(0x00f0ff, 1); // Sneaker trim
      g.fillRect(22 + legOffset, 56, 8, 4);

      // Right leg
      g.fillStyle(0x0f172a, 1);
      g.fillRoundedRect(34 - legOffset, 42, 8, 18, 3);
      g.fillStyle(0x00f0ff, 1); // Sneaker trim
      g.fillRect(34 - legOffset, 56, 8, 4);

      // Torso / Magnetic Jacket
      g.fillStyle(0x0f172a, 1);
      g.fillRoundedRect(18, 22, 28, 24, 6);
      g.lineStyle(2.5, isDamage ? 0xef4444 : 0x00f0ff, 1);
      g.strokeRoundedRect(18, 22, 28, 24, 6);

      // Head / Hair / Visor
      g.fillStyle(0xffdbac, 1); // Skin tone
      g.fillCircle(32, 16, 12);

      // Cool Spiky Hair
      g.fillStyle(0x334155, 1);
      g.fillTriangle(20, 14, 32, 2, 28, 14);
      g.fillTriangle(26, 14, 36, 2, 34, 14);
      g.fillTriangle(32, 14, 44, 4, 40, 14);

      // Magnetic Visor Goggles
      g.fillStyle(isDamage ? 0xef4444 : 0x00f0ff, 0.95);
      g.fillRoundedRect(22, 12, 20, 7, 3);
      g.fillStyle(0xffffff, 0.8);
      g.fillRect(24, 13, 6, 2);

      // Magnetic Gauntlet (Left Arm extended forward)
      if (isPulse) {
        // Shockwave extended pose
        g.fillStyle(0x334155, 1);
        g.fillRect(40, 24, 18, 8);
        g.fillStyle(0x00f0ff, 1);
        g.fillCircle(56, 28, 9);
        g.lineStyle(2, 0xffffff, 1);
        g.strokeCircle(56, 28, 9);
      } else {
        // Standard gauntlet
        g.fillStyle(0x334155, 1);
        g.fillRoundedRect(42, 26, 12, 8, 3);
        g.fillStyle(0x00f0ff, 1);
        g.fillCircle(52, 30, 6);
      }

      g.generateTexture(key, w, h);
      g.destroy();
    };

    drawHeroPose('hero_run1', 0);
    drawHeroPose('hero_run2', 1);
    drawHeroPose('hero_run3', 2);
    drawHeroPose('hero_run4', 3);
    drawHeroPose('hero_pulse', 0, true);
    drawHeroPose('hero_damage', 0, false, true);

    // Magnetic Repel Shockwave Ring Texture
    const waveG = scene.make.graphics({ x: 0, y: 0 }, false);
    waveG.lineStyle(4, 0x00f0ff, 1);
    waveG.strokeCircle(40, 40, 36);
    waveG.lineStyle(2, 0xffffff, 0.8);
    waveG.strokeCircle(40, 40, 28);
    waveG.generateTexture('pulse_shockwave', 80, 80);
    waveG.destroy();

    // Shield Aura Texture
    const shieldG = scene.make.graphics({ x: 0, y: 0 }, false);
    shieldG.fillStyle(0x38bdf8, 0.25);
    shieldG.fillCircle(36, 36, 34);
    shieldG.lineStyle(3, 0x38bdf8, 0.9);
    shieldG.strokeCircle(36, 36, 34);
    shieldG.generateTexture('shield_aura', 72, 72);
    shieldG.destroy();
  }

  // 2. 3D-PERSPECTIVE OBSTACLES (Subway Trains, Parked Vehicles, Crates, Barriers, Bombs)
  private static generateObstacleTextures(scene: Phaser.Scene): void {
    // A. Oncoming Subway Train
    const trainG = scene.make.graphics({ x: 0, y: 0 }, false);
    trainG.fillStyle(0xef4444, 1); // Front Red Engine
    trainG.fillRoundedRect(4, 4, 92, 80, 10);
    trainG.fillStyle(0x1e293b, 1);
    trainG.fillRoundedRect(12, 12, 76, 36, 6); // Windshield
    // Headlights
    trainG.fillStyle(0xfef08a, 1);
    trainG.fillCircle(20, 64, 8);
    trainG.fillCircle(80, 64, 8);
    trainG.lineStyle(2, 0xffffff, 0.9);
    trainG.strokeCircle(20, 64, 8);
    trainG.strokeCircle(80, 64, 8);
    trainG.lineStyle(3, 0xffffff, 1);
    trainG.strokeRoundedRect(4, 4, 92, 80, 10);
    trainG.generateTexture('obs_train', 100, 88);
    trainG.destroy();

    // B. Parked Car / Taxi
    const carG = scene.make.graphics({ x: 0, y: 0 }, false);
    carG.fillStyle(0x2563eb, 1);
    carG.fillRoundedRect(4, 4, 76, 50, 8);
    carG.fillStyle(0x93c5fd, 0.8);
    carG.fillRoundedRect(16, 10, 52, 26, 4); // Roof
    carG.fillStyle(0x0f172a, 1); // Wheels
    carG.fillCircle(14, 52, 6);
    carG.fillCircle(66, 52, 6);
    carG.generateTexture('obs_car', 84, 60);
    carG.destroy();

    // C. Cargo Crate Stack
    const crateG = scene.make.graphics({ x: 0, y: 0 }, false);
    crateG.fillStyle(0xd97706, 1);
    crateG.fillRoundedRect(4, 4, 52, 52, 6);
    crateG.lineStyle(3, 0x78350f, 1);
    crateG.strokeRoundedRect(4, 4, 52, 52, 6);
    crateG.lineBetween(4, 4, 56, 56);
    crateG.lineBetween(56, 4, 4, 56);
    crateG.generateTexture('obs_crate', 60, 60);
    crateG.destroy();

    // D. Construction Barrier
    const barG = scene.make.graphics({ x: 0, y: 0 }, false);
    barG.fillStyle(0xf97316, 1);
    barG.fillRoundedRect(4, 8, 64, 24, 4);
    barG.fillStyle(0xffffff, 1);
    barG.fillRect(16, 8, 12, 24);
    barG.fillRect(40, 8, 12, 24);
    barG.fillStyle(0x334155, 1); // Feet
    barG.fillRect(8, 32, 6, 16);
    barG.fillRect(58, 32, 6, 16);
    barG.generateTexture('obs_barrier', 72, 50);
    barG.destroy();

    // E. Magnetic Bomb (Bad Object)
    const bombG = scene.make.graphics({ x: 0, y: 0 }, false);
    bombG.fillStyle(0xef4444, 1);
    bombG.fillCircle(20, 20, 16);
    bombG.lineStyle(2, 0xffffff, 1);
    bombG.strokeCircle(20, 20, 16);
    bombG.lineStyle(3, 0xffffff, 1);
    bombG.lineBetween(12, 12, 28, 28);
    bombG.lineBetween(28, 12, 12, 28);
    bombG.generateTexture('obs_bomb', 40, 40);
    bombG.destroy();

    // F. Heavy Wrench / Scrap
    const wrenchG = scene.make.graphics({ x: 0, y: 0 }, false);
    wrenchG.fillStyle(0xb45309, 1);
    wrenchG.fillRect(16, 4, 8, 28);
    wrenchG.fillCircle(20, 6, 8);
    wrenchG.fillStyle(0x0f172a, 1);
    wrenchG.fillCircle(20, 6, 4);
    wrenchG.generateTexture('obs_scrap', 40, 36);
    wrenchG.destroy();
  }

  // 3. COLLECTIBLES & POWER-UPS
  private static generateItemAndPowerupTextures(scene: Phaser.Scene): void {
    // Gold Coin
    const coinG = scene.make.graphics({ x: 0, y: 0 }, false);
    coinG.fillStyle(0xffb700, 1);
    coinG.fillCircle(15, 15, 13);
    coinG.lineStyle(2, 0xffea00, 1);
    coinG.strokeCircle(15, 15, 13);
    coinG.fillStyle(0xffffff, 0.9);
    coinG.fillCircle(11, 11, 4);
    coinG.generateTexture('item_coin', 30, 30);
    coinG.destroy();

    // Energy Prism Crystal
    const crysG = scene.make.graphics({ x: 0, y: 0 }, false);
    crysG.fillStyle(0x00f0ff, 1);
    crysG.fillTriangle(15, 2, 28, 28, 2, 28);
    crysG.lineStyle(2, 0xffffff, 0.9);
    crysG.strokeTriangle(15, 2, 28, 28, 2, 28);
    crysG.generateTexture('item_crystal', 30, 30);
    crysG.destroy();

    // Power-up: 🛡️ Shield Capsule
    const pShieldG = scene.make.graphics({ x: 0, y: 0 }, false);
    pShieldG.fillStyle(0x0284c7, 1);
    pShieldG.fillCircle(18, 18, 16);
    pShieldG.lineStyle(2, 0x38bdf8, 1);
    pShieldG.strokeCircle(18, 18, 16);
    pShieldG.fillStyle(0xffffff, 1);
    pShieldG.fillTriangle(18, 6, 28, 26, 8, 26);
    pShieldG.generateTexture('power_shield', 36, 36);
    pShieldG.destroy();

    // Power-up: 🧲 Super Magnet
    const pMagG = scene.make.graphics({ x: 0, y: 0 }, false);
    pMagG.fillStyle(0xca8a04, 1);
    pMagG.fillCircle(18, 18, 16);
    pMagG.lineStyle(2, 0xfacc15, 1);
    pMagG.strokeCircle(18, 18, 16);
    pMagG.fillStyle(0xef4444, 1);
    pMagG.fillRect(10, 10, 6, 16);
    pMagG.fillStyle(0x2563eb, 1);
    pMagG.fillRect(20, 10, 6, 16);
    pMagG.generateTexture('power_magnet', 36, 36);
    pMagG.destroy();

    // Power-up: ⚡ Turbo Speed Boost
    const pBoostG = scene.make.graphics({ x: 0, y: 0 }, false);
    pBoostG.fillStyle(0x16a34a, 1);
    pBoostG.fillCircle(18, 18, 16);
    pBoostG.lineStyle(2, 0x4ade80, 1);
    pBoostG.strokeCircle(18, 18, 16);
    pBoostG.fillStyle(0xfef08a, 1);
    pBoostG.fillTriangle(22, 4, 10, 18, 18, 18);
    pBoostG.fillTriangle(14, 32, 26, 18, 18, 18);
    pBoostG.generateTexture('power_boost', 36, 36);
    pBoostG.destroy();
  }

  // 4. PARALLAX TRACK TILES
  private static generateTrackTextures(scene: Phaser.Scene): void {
    const tileG = scene.make.graphics({ x: 0, y: 0 }, false);
    tileG.fillStyle(0x1e293b, 1);
    tileG.fillRect(0, 0, 1280, 60);
    tileG.lineStyle(2, 0x00f0ff, 0.4);
    tileG.lineBetween(0, 0, 1280, 0);
    tileG.lineBetween(0, 60, 1280, 60);
    tileG.generateTexture('track_tile', 1280, 60);
    tileG.destroy();
  }
}
