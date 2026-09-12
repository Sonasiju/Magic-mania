import Phaser from 'phaser';

export class ArtGenerator {
  public static generateAll(scene: Phaser.Scene): void {
    this.generateHeroTextures(scene);
    this.generateObstacleTextures(scene);
    this.generateItemAndPowerupTextures(scene);
    this.generateTrackTextures(scene);
  }

  // 1. REALISTIC 3D-SHADED SUBWAY HERO RUNNER SPRITES
  private static generateHeroTextures(scene: Phaser.Scene): void {
    const drawHeroPose = (key: string, frameIndex: number, isPulse: boolean = false, isDamage: boolean = false) => {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      const w = 84;
      const h = 90;

      // 1. 3D Soft Drop Shadow under human runner
      g.fillStyle(0x000000, 0.45);
      g.fillEllipse(42, 82, 48, 14);

      // Running Pose Leg Calculations
      const legOffset = Math.sin((frameIndex * Math.PI) / 2) * 11;

      // 2. Left Leg (Running tights & realistic sneaker)
      g.fillStyle(0x1e293b, 1);
      g.fillRoundedRect(28 + legOffset, 52, 11, 24, 4); // Thigh / Calf
      g.fillStyle(0x0f172a, 1);
      g.fillRoundedRect(28 + legOffset, 64, 11, 12, 3);
      // Realistic Running Shoe
      g.fillStyle(0x00f0ff, 1);
      g.fillRoundedRect(25 + legOffset, 74, 15, 8, 3);
      g.fillStyle(0xffffff, 1); // Shoe sole & laces
      g.fillRect(25 + legOffset, 79, 15, 3);
      g.fillRect(29 + legOffset, 75, 4, 2);

      // 3. Right Leg
      g.fillStyle(0x1e293b, 1);
      g.fillRoundedRect(45 - legOffset, 52, 11, 24, 4);
      g.fillStyle(0x0f172a, 1);
      g.fillRoundedRect(45 - legOffset, 64, 11, 12, 3);
      // Shoe
      g.fillStyle(0x00f0ff, 1);
      g.fillRoundedRect(43 - legOffset, 74, 15, 8, 3);
      g.fillStyle(0xffffff, 1);
      g.fillRect(43 - legOffset, 79, 15, 3);
      g.fillRect(47 - legOffset, 75, 4, 2);

      // 4. Athletic Human Torso (Running Jacket & Chest)
      g.fillStyle(0x0f172a, 1); // Dark navy athletic jacket
      g.fillRoundedRect(26, 26, 32, 30, 8);
      
      // Cyan Athletic Trim Lines
      g.fillStyle(0x00f0ff, 1);
      g.fillRect(28, 28, 3, 26);
      g.fillRect(53, 28, 3, 26);

      // Left Arm (Pumping back while running)
      g.fillStyle(0xf5c29b, 1); // Human skin arm
      g.fillRoundedRect(17, 30 - legOffset * 0.4, 10, 20, 4);
      g.fillStyle(0x0f172a, 1); // Sleeve
      g.fillRoundedRect(17, 28 - legOffset * 0.4, 10, 10, 3);

      // 5. Realistic Human Head & Face Features
      // Neck
      g.fillStyle(0xe2a87c, 1);
      g.fillRect(38, 20, 8, 8);

      // Head / Skin
      g.fillStyle(0xf5c29b, 1); // Natural human skin tone
      g.fillCircle(42, 16, 13);

      // Human Eyes & Eyebrows
      g.fillStyle(0x1e293b, 1); // Eyebrows
      g.fillRect(37, 10, 5, 2);
      g.fillRect(45, 10, 5, 2);

      g.fillStyle(0xffffff, 1); // Eyes
      g.fillCircle(38, 14, 3);
      g.fillCircle(46, 14, 3);
      g.fillStyle(0x0284c7, 1); // Blue Pupils looking forward
      g.fillCircle(39, 14, 1.5);
      g.fillCircle(47, 14, 1.5);

      // Human Hair (Styled brown/dark hair)
      g.fillStyle(0x3f2314, 1);
      g.fillCircle(42, 9, 13);
      g.fillTriangle(30, 10, 42, 2, 38, 12);
      g.fillTriangle(38, 10, 48, 1, 44, 12);
      g.fillTriangle(44, 10, 53, 3, 50, 12);

      // 6. REALISTIC METALLIC HORSESHOE MAGNET HELD IN HAND!
      const magX = isPulse ? 62 : 56;
      const magY = 32;

      // Extended Arm holding the magnet
      g.fillStyle(0xf5c29b, 1);
      g.fillRoundedRect(50, 30, 14, 9, 3); // Arm
      g.fillStyle(0xe2a87c, 1);
      g.fillCircle(62, 34, 4); // Hand clasping magnet

      // U-Shaped Horseshoe Magnet Body
      // Left Pole (North - Red)
      g.fillStyle(0xef4444, 1);
      g.fillRect(magX - 6, magY - 14, 7, 18);
      g.fillStyle(0xb91c1c, 1); // Bevel shadow
      g.fillRect(magX - 6, magY - 14, 2, 18);

      // Right Pole (South - Blue)
      g.fillStyle(0x3b82f6, 1);
      g.fillRect(magX + 5, magY - 14, 7, 18);
      g.fillStyle(0x1d4ed8, 1);
      g.fillRect(magX + 10, magY - 14, 2, 18);

      // U-Curve Base connecting poles
      g.fillStyle(0xd97706, 1);
      g.fillRoundedRect(magX - 6, magY + 2, 18, 8, 4);

      // Silver Metallic Tips
      g.fillStyle(0xe2e8f0, 1);
      g.fillRect(magX - 6, magY - 18, 7, 5);
      g.fillRect(magX + 5, magY - 18, 7, 5);
      g.fillStyle(0xffffff, 1);
      g.fillRect(magX - 5, magY - 18, 5, 2); // Tip glare
      g.fillRect(magX + 6, magY - 18, 5, 2);

      // Magnetic 'N' and 'S' Labels
      g.fillStyle(0xffffff, 1);
      g.fillRect(magX - 4, magY - 8, 3, 6); // N pole mark
      g.fillRect(magX + 7, magY - 8, 3, 6); // S pole mark

      // Electric Magnetic Field Aura & Sparkles emanating from horseshoe tips
      g.fillStyle(0x00f0ff, isPulse ? 0.8 : 0.5);
      g.fillCircle(magX - 3, magY - 20, isPulse ? 8 : 5);
      g.fillCircle(magX + 8, magY - 20, isPulse ? 8 : 5);

      // Electric Magnetic Arc between tips
      g.lineStyle(2, isPulse ? 0xff0077 : 0x00f0ff, 0.9);
      g.lineBetween(magX - 3, magY - 20, magX + 8, magY - 20);

      g.generateTexture(key, w, h);
      g.destroy();
    };

    drawHeroPose('hero_run1', 0);
    drawHeroPose('hero_run2', 1);
    drawHeroPose('hero_run3', 2);
    drawHeroPose('hero_run4', 3);
    drawHeroPose('hero_pulse', 0, true);
    drawHeroPose('hero_damage', 0, false, true);

    // Player Attract Menu Sprite (3D Standee)
    drawHeroPose('player_attract', 0);

    // Magnetic Repel Shockwave Ring Texture
    const waveG = scene.make.graphics({ x: 0, y: 0 }, false);
    waveG.lineStyle(6, 0x00f0ff, 0.9);
    waveG.strokeCircle(48, 48, 42);
    waveG.lineStyle(3, 0xffffff, 0.95);
    waveG.strokeCircle(48, 48, 34);
    waveG.fillStyle(0x00f0ff, 0.15);
    waveG.fillCircle(48, 48, 42);
    waveG.generateTexture('pulse_shockwave', 96, 96);
    waveG.destroy();

    // 3D Shield Aura Texture
    const shieldG = scene.make.graphics({ x: 0, y: 0 }, false);
    shieldG.fillStyle(0x38bdf8, 0.2);
    shieldG.fillCircle(40, 40, 38);
    shieldG.lineStyle(4, 0x38bdf8, 0.95);
    shieldG.strokeCircle(40, 40, 38);
    shieldG.lineStyle(2, 0xffffff, 0.7);
    shieldG.strokeCircle(40, 40, 32);
    shieldG.generateTexture('shield_aura', 80, 80);
    shieldG.destroy();

    // 👁️ FIRST-PERSON PLAYER'S EYES VIEW: HANDS & FRONT HORSESHOE MAGNET HUD OVERLAY
    const fpvG = scene.make.graphics({ x: 0, y: 0 }, false);
    const fw = 220;
    const fh = 140;

    // 1. Soft Drop Shadow
    fpvG.fillStyle(0x000000, 0.4);
    fpvG.fillEllipse(110, 125, 140, 24);

    // 2. Left Human Arm & Athletic Sleeve (Reaching from bottom-left corner)
    fpvG.fillStyle(0x0f172a, 1); // Navy sleeve
    fpvG.fillTriangle(0, 140, 40, 85, 75, 140);
    fpvG.fillStyle(0x00f0ff, 1); // Athletic cyan trim strip
    fpvG.fillRect(25, 105, 8, 30);
    fpvG.fillStyle(0xf5c29b, 1); // Skin hand
    fpvG.fillRoundedRect(52, 70, 28, 24, 6);
    fpvG.fillCircle(75, 75, 8); // Thumb clasping magnet

    // 3. Right Human Arm & Athletic Sleeve (Reaching from bottom-right corner)
    fpvG.fillStyle(0x0f172a, 1);
    fpvG.fillTriangle(220, 140, 180, 85, 145, 140);
    fpvG.fillStyle(0x00f0ff, 1);
    fpvG.fillRect(187, 105, 8, 30);
    fpvG.fillStyle(0xf5c29b, 1);
    fpvG.fillRoundedRect(140, 70, 28, 24, 6);
    fpvG.fillCircle(145, 75, 8);

    // 4. LARGE 3D METALLIC HORSESHOE MAGNET HELD CENTER FRONT
    const mX = 110;
    const mY = 55;

    // U-Curve Base
    fpvG.fillStyle(0xd97706, 1);
    fpvG.fillRoundedRect(mX - 32, mY + 12, 64, 24, 10);
    fpvG.fillStyle(0x92400e, 1); // Dark bevel shadow
    fpvG.fillRoundedRect(mX - 32, mY + 28, 64, 8, 4);

    // Left Pole (North - Metallic Red)
    fpvG.fillStyle(0xef4444, 1);
    fpvG.fillRoundedRect(mX - 34, mY - 24, 20, 44, 5);
    fpvG.fillStyle(0xb91c1c, 1); // Inner Shadow
    fpvG.fillRect(mX - 34, mY - 24, 5, 44);

    // Right Pole (South - Metallic Blue)
    fpvG.fillStyle(0x3b82f6, 1);
    fpvG.fillRoundedRect(mX + 14, mY - 24, 20, 44, 5);
    fpvG.fillStyle(0x1d4ed8, 1);
    fpvG.fillRect(mX + 29, mY - 24, 5, 44);

    // Silver Metallic Tips
    fpvG.fillStyle(0xe2e8f0, 1);
    fpvG.fillRoundedRect(mX - 34, mY - 34, 20, 12, 3);
    fpvG.fillRoundedRect(mX + 14, mY - 34, 20, 12, 3);
    fpvG.fillStyle(0xffffff, 0.95); // High specular glare
    fpvG.fillRect(mX - 30, mY - 34, 12, 4);
    fpvG.fillRect(mX + 18, mY - 34, 12, 4);

    // Magnetic Pole Marks "N" and "S"
    fpvG.fillStyle(0xffffff, 1);
    fpvG.fillRect(mX - 27, mY - 14, 6, 16);
    fpvG.fillRect(mX + 21, mY - 14, 6, 16);

    // ⚡ Electric Magnetic Force Arc & Glowing Energy Field
    fpvG.fillStyle(0x00f0ff, 0.7);
    fpvG.fillCircle(mX - 24, mY - 34, 10);
    fpvG.fillCircle(mX + 24, mY - 34, 10);
    fpvG.lineStyle(4, 0x00f0ff, 0.95);
    fpvG.lineBetween(mX - 24, mY - 34, mX + 24, mY - 34);
    fpvG.lineStyle(2, 0xffffff, 0.9);
    fpvG.lineBetween(mX - 20, mY - 34, mX + 20, mY - 34);

    fpvG.generateTexture('fpv_hands_magnet', fw, fh);
    fpvG.destroy();
  }

  // 2. 3D-PERSPECTIVE OBSTACLES (Realistic Subway Trains, Cars, Crates, Barriers, Bombs)
  private static generateObstacleTextures(scene: Phaser.Scene): void {
    // A. 3D Subway Train Front Engine
    const trainG = scene.make.graphics({ x: 0, y: 0 }, false);
    const tw = 104;
    const th = 96;

    // Soft drop shadow
    trainG.fillStyle(0x000000, 0.5);
    trainG.fillRoundedRect(2, 80, 100, 14, 6);

    // Main Engine Body (Metallic Red with bevel gradient)
    trainG.fillStyle(0xd97706, 1); // Metallic Trim Base
    trainG.fillRoundedRect(4, 4, 96, 82, 12);
    trainG.fillStyle(0xd92626, 1);
    trainG.fillRoundedRect(8, 8, 88, 74, 10);
    trainG.fillStyle(0xef4444, 1);
    trainG.fillRoundedRect(12, 10, 80, 40, 8); // Top Front Highlight

    // 3D Windshield Glass (Reflective dark glass)
    trainG.fillStyle(0x0f172a, 1);
    trainG.fillRoundedRect(16, 16, 72, 34, 6);
    trainG.fillStyle(0x38bdf8, 0.4); // Glass reflection
    trainG.fillTriangle(18, 18, 56, 18, 18, 44);

    // Front Bumper / Grill
    trainG.fillStyle(0x1e293b, 1);
    trainG.fillRoundedRect(12, 54, 80, 24, 4);
    trainG.lineStyle(2, 0x475569, 1);
    for (let x = 20; x <= 80; x += 12) {
      trainG.lineBetween(x, 56, x, 74);
    }

    // Glowing 3D Headlights with Beam Cones
    trainG.fillStyle(0xfef08a, 1);
    trainG.fillCircle(24, 66, 9);
    trainG.fillCircle(80, 66, 9);
    trainG.lineStyle(2.5, 0xffffff, 1);
    trainG.strokeCircle(24, 66, 9);
    trainG.strokeCircle(80, 66, 9);
    trainG.fillStyle(0xffffff, 0.9);
    trainG.fillCircle(22, 64, 4);
    trainG.fillCircle(78, 64, 4);

    trainG.generateTexture('obs_train', tw, th);
    trainG.destroy();

    // B. 3D Sports Car / Taxi
    const carG = scene.make.graphics({ x: 0, y: 0 }, false);
    // Shadow
    carG.fillStyle(0x000000, 0.45);
    carG.fillRoundedRect(2, 48, 84, 14, 6);

    // Body
    carG.fillStyle(0x1d4ed8, 1);
    carG.fillRoundedRect(4, 8, 80, 44, 10);
    carG.fillStyle(0x3b82f6, 1);
    carG.fillRoundedRect(8, 10, 72, 22, 6);

    // Windshield Roof
    carG.fillStyle(0x0f172a, 1);
    carG.fillRoundedRect(18, 14, 52, 22, 5);
    carG.fillStyle(0x60a5fa, 0.5);
    carG.fillTriangle(20, 16, 50, 16, 20, 32);

    // Headlights / Tail Lights
    carG.fillStyle(0xef4444, 1);
    carG.fillCircle(14, 44, 5);
    carG.fillCircle(74, 44, 5);

    carG.generateTexture('obs_car', 88, 64);
    carG.destroy();

    // C. 3D Cargo Crate Stack
    const crateG = scene.make.graphics({ x: 0, y: 0 }, false);
    // Shadow
    crateG.fillStyle(0x000000, 0.45);
    crateG.fillRoundedRect(2, 52, 60, 12, 4);

    // Wood body
    crateG.fillStyle(0x78350f, 1);
    crateG.fillRoundedRect(4, 4, 56, 52, 6);
    crateG.fillStyle(0xb45309, 1);
    crateG.fillRoundedRect(8, 8, 48, 44, 4);

    // Metallic corner brackets & 3D bevels
    crateG.fillStyle(0x334155, 1);
    crateG.fillRect(4, 4, 12, 12);
    crateG.fillRect(48, 4, 12, 12);
    crateG.fillRect(4, 44, 12, 12);
    crateG.fillRect(48, 44, 12, 12);

    crateG.lineStyle(3, 0x451a03, 1);
    crateG.lineBetween(8, 8, 52, 52);
    crateG.lineBetween(52, 8, 8, 52);

    crateG.generateTexture('obs_crate', 64, 64);
    crateG.destroy();

    // D. 3D Construction Barrier
    const barG = scene.make.graphics({ x: 0, y: 0 }, false);
    // Stand Feet
    barG.fillStyle(0x1e293b, 1);
    barG.fillRect(8, 36, 12, 18);
    barG.fillRect(60, 36, 12, 18);

    // Barrier Board
    barG.fillStyle(0xeab308, 1);
    barG.fillRoundedRect(4, 6, 72, 32, 6);
    barG.fillStyle(0x0f172a, 1);
    for (let x = 8; x < 72; x += 20) {
      barG.fillTriangle(x, 6, x + 10, 6, x, 38);
      barG.fillTriangle(x + 10, 38, x + 20, 38, x + 10, 6);
    }
    barG.lineStyle(2, 0xffffff, 0.9);
    barG.strokeRoundedRect(4, 6, 72, 32, 6);

    barG.generateTexture('obs_barrier', 80, 56);
    barG.destroy();

    // E. 3D Chrome Red Magnetic Bomb (Hazard)
    const bombG = scene.make.graphics({ x: 0, y: 0 }, false);
    // Outer Hazard Ring
    bombG.fillStyle(0xef4444, 0.3);
    bombG.fillCircle(24, 24, 22);
    
    // 3D Sphere Shading
    bombG.fillStyle(0x991b1b, 1);
    bombG.fillCircle(24, 24, 18);
    bombG.fillStyle(0xef4444, 1);
    bombG.fillCircle(22, 22, 14);
    bombG.fillStyle(0xff8888, 1);
    bombG.fillCircle(18, 18, 6);
    bombG.fillStyle(0xffffff, 0.9);
    bombG.fillCircle(16, 16, 2.5); // Glare

    // Danger Crosshair Symbol
    bombG.lineStyle(2.5, 0xffffff, 1);
    bombG.lineBetween(16, 24, 32, 24);
    bombG.lineBetween(24, 16, 24, 32);

    bombG.generateTexture('obs_bomb', 48, 48);
    bombG.destroy();
  }

  // 3. REALISTIC 3D COLLECTIBLES & POWER-UPS
  private static generateItemAndPowerupTextures(scene: Phaser.Scene): void {
    // 3D Gold Coin
    const coinG = scene.make.graphics({ x: 0, y: 0 }, false);
    // Outer edge bevel
    coinG.fillStyle(0xd97706, 1);
    coinG.fillCircle(18, 18, 16);
    coinG.fillStyle(0xf59e0b, 1);
    coinG.fillCircle(18, 18, 14);
    coinG.fillStyle(0xfef08a, 1);
    coinG.fillCircle(17, 17, 10);
    // Inner star
    coinG.fillStyle(0xd97706, 1);
    coinG.fillTriangle(18, 10, 22, 22, 14, 22);
    coinG.fillTriangle(18, 24, 22, 12, 14, 12);
    // Glare
    coinG.fillStyle(0xffffff, 0.95);
    coinG.fillCircle(13, 13, 3);

    coinG.generateTexture('item_coin', 36, 36);
    coinG.destroy();

    // 3D Energy Crystal Gem
    const crysG = scene.make.graphics({ x: 0, y: 0 }, false);
    crysG.fillStyle(0x0284c7, 1);
    crysG.fillTriangle(18, 2, 34, 34, 2, 34);
    crysG.fillStyle(0x00f0ff, 1);
    crysG.fillTriangle(18, 6, 30, 30, 6, 30);
    crysG.fillStyle(0xe0f2fe, 0.9);
    crysG.fillTriangle(18, 8, 24, 20, 12, 20);

    crysG.generateTexture('item_crystal', 36, 36);
    crysG.destroy();

    // 3D Power-up Glass Orbs
    const drawOrb = (key: string, baseColor: number, accentColor: number, iconType: 'shield' | 'magnet' | 'boost') => {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      const size = 44;
      const r = 20;

      // Outer Bevel Ring
      g.fillStyle(baseColor, 1);
      g.fillCircle(22, 22, r);
      g.fillStyle(accentColor, 1);
      g.fillCircle(22, 22, r - 3);

      // Glass Glare
      g.fillStyle(0xffffff, 0.4);
      g.fillCircle(18, 18, r - 6);
      g.fillStyle(0xffffff, 0.9);
      g.fillCircle(15, 14, 4);

      // Inner 3D Icon
      g.fillStyle(0xffffff, 1);
      if (iconType === 'shield') {
        g.fillTriangle(22, 11, 31, 31, 13, 31);
      } else if (iconType === 'magnet') {
        g.fillRect(14, 14, 6, 16);
        g.fillRect(24, 14, 6, 16);
        g.fillRoundedRect(14, 24, 16, 6, 2);
      } else if (iconType === 'boost') {
        g.fillTriangle(26, 8, 14, 22, 22, 22);
        g.fillTriangle(18, 36, 30, 22, 22, 22);
      }

      g.generateTexture(key, size, size);
      g.destroy();
    };

    drawOrb('power_shield', 0x0369a1, 0x38bdf8, 'shield');
    drawOrb('power_magnet', 0xa16207, 0xfacc15, 'magnet');
    drawOrb('power_boost', 0x15803d, 0x4ade80, 'boost');
  }

  // 4. PARALLAX TRACK & 3D SCENERY PROP TEXTURES
  private static generateTrackTextures(scene: Phaser.Scene): void {
    const tileG = scene.make.graphics({ x: 0, y: 0 }, false);
    tileG.fillStyle(0x0f172a, 1);
    tileG.fillRect(0, 0, 1280, 60);
    tileG.lineStyle(2, 0x00f0ff, 0.4);
    tileG.lineBetween(0, 0, 1280, 0);
    tileG.lineBetween(0, 60, 1280, 60);
    tileG.generateTexture('track_tile', 1280, 60);
    tileG.destroy();

    // 1. 2D Realistic Pine Tree Texture (Layered Needle Clusters & Textured Bark)
    const pineG = scene.make.graphics({ x: 0, y: 0 }, false);
    pineG.fillStyle(0x000000, 0.45);
    pineG.fillEllipse(60, 198, 72, 20); // Soft Ground Shadow

    // Textured Wooden Trunk & Bark Grain
    pineG.fillStyle(0x271306, 1);
    pineG.fillRect(52, 110, 16, 90);
    pineG.fillStyle(0x451a03, 1);
    pineG.fillRect(54, 110, 8, 90);
    pineG.fillStyle(0x78350f, 0.6); // Bark Highlights
    pineG.fillRect(56, 120, 3, 70);

    // Serrated Organic 2D Evergreen Needle Tiers
    const pineTiers = [
      { y: 115, w: 90, h: 45, dColor: 0x022c22, mColor: 0x064e3b, lColor: 0x047857 },
      { y: 90,  w: 80, h: 42, dColor: 0x022c22, mColor: 0x047857, lColor: 0x059669 },
      { y: 65,  w: 68, h: 38, dColor: 0x047857, mColor: 0x059669, lColor: 0x10b981 },
      { y: 40,  w: 54, h: 34, dColor: 0x059669, mColor: 0x10b981, lColor: 0x34d399 },
      { y: 15,  w: 36, h: 30, dColor: 0x10b981, mColor: 0x34d399, lColor: 0x6ee7b7 }
    ];

    pineTiers.forEach(t => {
      // Under Shadow Tier
      pineG.fillStyle(t.dColor, 1);
      pineG.fillTriangle(60, t.y - t.h, 60 + t.w / 2 + 4, t.y + 4, 60 - t.w / 2 - 4, t.y + 4);
      // Mid Foliage Tier
      pineG.fillStyle(t.mColor, 1);
      pineG.fillTriangle(60, t.y - t.h + 2, 60 + t.w / 2, t.y, 60 - t.w / 2, t.y);
      // Needle Highlights
      pineG.fillStyle(t.lColor, 0.85);
      pineG.fillTriangle(60, t.y - t.h + 2, 60 + t.w / 4, t.y - t.h / 2, 60 - t.w / 4, t.y - t.h / 2);
    });

    pineG.generateTexture('prop_tree_pine', 120, 210);
    pineG.destroy();

    // 2. 2D Realistic Sakura Cherry Blossom Tree (Organic Petal Clouds & Gnarled Bark)
    const sakuraG = scene.make.graphics({ x: 0, y: 0 }, false);
    sakuraG.fillStyle(0x000000, 0.45);
    sakuraG.fillEllipse(70, 208, 84, 22);

    // Gnarled Trunk & Branching Arms
    sakuraG.fillStyle(0x271306, 1);
    sakuraG.fillRoundedRect(62, 105, 16, 100, 6);
    sakuraG.fillStyle(0x451a03, 1);
    sakuraG.fillRect(64, 105, 7, 100);
    // Branches extending into canopy
    sakuraG.fillStyle(0x271306, 1);
    sakuraG.fillTriangle(40, 115, 66, 110, 60, 135);
    sakuraG.fillTriangle(100, 115, 74, 110, 80, 135);

    // Multi-Layer Organic 2D Petal Clouds
    const sakuraClouds = [
      // Deep Magenta Shadows
      { x: 70, y: 80, r: 58, c: 0x831843 },
      { x: 42, y: 92, r: 42, c: 0x831843 },
      { x: 98, y: 92, r: 42, c: 0x831843 },
      // Mid Rose Petals
      { x: 70, y: 72, r: 52, c: 0xdb2777 },
      { x: 38, y: 82, r: 36, c: 0xdb2777 },
      { x: 102, y: 82, r: 36, c: 0xdb2777 },
      // Soft Pink Highlights
      { x: 64, y: 55, r: 44, c: 0xf472b6 },
      { x: 40, y: 68, r: 28, c: 0xf472b6 },
      { x: 92, y: 68, r: 28, c: 0xf472b6 },
      // White Petal Sun Glare
      { x: 60, y: 40, r: 26, c: 0xfce7f3 },
      { x: 78, y: 44, r: 20, c: 0xffffff }
    ];

    sakuraClouds.forEach(cl => {
      sakuraG.fillStyle(cl.c, 0.95);
      sakuraG.fillCircle(cl.x, cl.y, cl.r);
    });

    sakuraG.generateTexture('prop_tree_sakura', 140, 220);
    sakuraG.destroy();

    // 3. 3D Red Rose / Flower Texture
    const redFlwG = scene.make.graphics({ x: 0, y: 0 }, false);
    redFlwG.fillStyle(0x047857, 1);
    redFlwG.fillRect(28, 24, 6, 28); // Stem & Leaves
    redFlwG.fillTriangle(28, 36, 14, 30, 28, 30);
    redFlwG.fillTriangle(34, 42, 48, 36, 34, 36);
    redFlwG.fillStyle(0xef4444, 1);
    redFlwG.fillCircle(31, 18, 16);
    redFlwG.fillStyle(0xd97706, 1);
    redFlwG.fillCircle(31, 18, 6);
    redFlwG.generateTexture('prop_flower_red', 62, 58);
    redFlwG.destroy();

    // 4. 3D Yellow Sunflower Texture
    const yelFlwG = scene.make.graphics({ x: 0, y: 0 }, false);
    yelFlwG.fillStyle(0x047857, 1);
    yelFlwG.fillRect(28, 24, 6, 28);
    yelFlwG.fillStyle(0xeab308, 1);
    yelFlwG.fillCircle(31, 18, 16);
    yelFlwG.fillStyle(0x78350f, 1);
    yelFlwG.fillCircle(31, 18, 7);
    yelFlwG.generateTexture('prop_flower_yellow', 62, 58);
    yelFlwG.destroy();

    // 4b. 2D Wind-Swaying Green Grass Tuft Texture
    const grassG = scene.make.graphics({ x: 0, y: 0 }, false);
    grassG.fillStyle(0x15803d, 1); // Darker grass blade
    grassG.fillTriangle(10, 40, 16, 10, 22, 40);
    grassG.fillTriangle(26, 40, 32, 6, 38, 40);
    grassG.fillStyle(0x22c55e, 1); // Mid grass blade
    grassG.fillTriangle(18, 40, 24, 12, 30, 40);
    grassG.fillTriangle(34, 40, 40, 16, 46, 40);
    grassG.fillStyle(0x4ade80, 0.9); // Highlight grass tip
    grassG.fillTriangle(14, 40, 18, 18, 22, 40);
    grassG.fillTriangle(30, 40, 34, 14, 38, 40);
    grassG.generateTexture('prop_grass_tuft', 56, 44);
    grassG.destroy();

    // 5. 3D Cosmic Space Crystal Texture
    const cosCrysG = scene.make.graphics({ x: 0, y: 0 }, false);
    cosCrysG.fillStyle(0x000000, 0.45);
    cosCrysG.fillEllipse(40, 110, 60, 18);
    cosCrysG.fillStyle(0xa855f7, 0.95);
    cosCrysG.fillTriangle(40, 10, 70, 105, 10, 105);
    cosCrysG.fillStyle(0x00f0ff, 0.95);
    cosCrysG.fillTriangle(28, 25, 52, 105, 8, 105);
    cosCrysG.fillStyle(0xffffff, 0.9);
    cosCrysG.fillTriangle(40, 15, 50, 60, 30, 60);
    cosCrysG.generateTexture('prop_crystal_cosmic', 80, 120);
    cosCrysG.destroy();

    // 6. 3D Cyberpunk Neon Palm Tree Texture
    const palmG = scene.make.graphics({ x: 0, y: 0 }, false);
    palmG.fillStyle(0x000000, 0.45);
    palmG.fillEllipse(60, 195, 70, 22);
    palmG.lineStyle(8, 0x00f0ff, 0.95);
    palmG.lineBetween(60, 195, 60, 60);
    palmG.fillStyle(0xff0077, 1);
    palmG.fillTriangle(60, 60, 110, 20, 80, 75);
    palmG.fillTriangle(60, 60, 10, 20, 40, 75);
    palmG.fillTriangle(60, 60, 105, 100, 75, 80);
    palmG.fillTriangle(60, 60, 15, 100, 45, 80);
    palmG.generateTexture('prop_neon_palm', 120, 210);
    palmG.destroy();

    // 7. 2D Realistic Oak Tree Texture (Spreading Organic 2D Canopy & Detailed Bark)
    const oakG = scene.make.graphics({ x: 0, y: 0 }, false);
    oakG.fillStyle(0x000000, 0.5);
    oakG.fillEllipse(80, 218, 104, 26); // Shadow

    // Detailed Organic Bark Trunk with Roots & Branching Limbs
    oakG.fillStyle(0x271306, 1);
    oakG.fillRoundedRect(68, 110, 24, 105, 8);
    oakG.fillStyle(0x451a03, 1);
    oakG.fillRect(72, 110, 10, 105);
    oakG.fillStyle(0x78350f, 0.7);
    oakG.fillRect(76, 120, 4, 85); // Bark Grain Highlight

    // Spreading Oak Branch Limbs
    oakG.fillStyle(0x271306, 1);
    oakG.fillTriangle(42, 135, 76, 120, 70, 155);
    oakG.fillTriangle(118, 135, 84, 120, 90, 155);

    // 15+ Overlapping Organic Leaf Clusters with 4-Tier Depth
    const oakClusters = [
      // Tier 1: Deep Forest Shadows
      { x: 80, y: 95, r: 64, c: 0x022c22 },
      { x: 42, y: 110, r: 44, c: 0x022c22 },
      { x: 118, y: 110, r: 44, c: 0x022c22 },
      // Tier 2: Emerald Green Foliage
      { x: 80, y: 82, r: 58, c: 0x047857 },
      { x: 38, y: 96, r: 38, c: 0x047857 },
      { x: 122, y: 96, r: 38, c: 0x047857 },
      // Tier 3: Spring Leaf Mid-Tones
      { x: 72, y: 64, r: 48, c: 0x059669 },
      { x: 44, y: 78, r: 32, c: 0x059669 },
      { x: 114, y: 78, r: 32, c: 0x059669 },
      // Tier 4: Bright Lime Sunlit Highlights
      { x: 68, y: 44, r: 34, c: 0x10b981 },
      { x: 96, y: 48, r: 28, c: 0x10b981 },
      { x: 82, y: 30, r: 22, c: 0x6ee7b7 }
    ];

    oakClusters.forEach(cl => {
      oakG.fillStyle(cl.c, 0.95);
      oakG.fillCircle(cl.x, cl.y, cl.r);
    });

    // Leaf Edge Detail Speckles
    oakG.fillStyle(0x6ee7b7, 0.7);
    oakG.fillCircle(55, 30, 8);
    oakG.fillCircle(105, 34, 7);

    oakG.generateTexture('prop_tree_oak', 160, 230);
    oakG.destroy();

    // 8. 2D Realistic White Birch Tree (Slender White Bark with Black Notches & Golden Autumn Leaf Canopy)
    const birchG = scene.make.graphics({ x: 0, y: 0 }, false);
    birchG.fillStyle(0x000000, 0.45);
    birchG.fillEllipse(60, 208, 74, 20);

    // Slender White Bark Trunk with Bark Notches
    birchG.fillStyle(0xf8fafc, 1);
    birchG.fillRect(50, 95, 20, 110);
    birchG.fillStyle(0xe2e8f0, 1);
    birchG.fillRect(52, 95, 6, 110);

    // Realistic Horizontal Birch Bark Notches
    birchG.fillStyle(0x1e293b, 1);
    birchG.fillRect(50, 115, 12, 5);
    birchG.fillRect(58, 138, 12, 5);
    birchG.fillRect(51, 162, 14, 4);
    birchG.fillRect(56, 185, 14, 5);

    // Layered Golden Autumn Leaf Canopy
    const birchClusters = [
      // Deep Amber Shadow
      { x: 60, y: 75, r: 52, c: 0x92400e },
      { x: 38, y: 88, r: 34, c: 0x92400e },
      { x: 82, y: 88, r: 34, c: 0x92400e },
      // Rich Golden Foliage
      { x: 60, y: 60, r: 46, c: 0xd97706 },
      { x: 36, y: 72, r: 28, c: 0xf59e0b },
      { x: 84, y: 72, r: 28, c: 0xf59e0b },
      // Bright Sunlit Yellow Top
      { x: 55, y: 38, r: 30, c: 0xfef08a },
      { x: 72, y: 44, r: 22, c: 0xfde047 }
    ];

    birchClusters.forEach(cl => {
      birchG.fillStyle(cl.c, 0.95);
      birchG.fillCircle(cl.x, cl.y, cl.r);
    });

    birchG.generateTexture('prop_tree_birch', 120, 220);
    birchG.destroy();

    // 9. 3D Mossy Boulder Rock Texture
    const rockG = scene.make.graphics({ x: 0, y: 0 }, false);
    rockG.fillStyle(0x000000, 0.5);
    rockG.fillEllipse(50, 75, 80, 22);
    rockG.fillStyle(0x334155, 1);
    rockG.fillCircle(50, 48, 40);
    rockG.fillStyle(0x475569, 1);
    rockG.fillCircle(42, 40, 30);
    rockG.fillStyle(0x059669, 0.9); // Moss on top
    rockG.fillEllipse(46, 22, 40, 18);
    rockG.generateTexture('prop_rock_mossy', 100, 88);
    rockG.destroy();

    // 10. 3D Holographic Neon Billboard Sign Texture
    const billG = scene.make.graphics({ x: 0, y: 0 }, false);
    billG.fillStyle(0x0f172a, 1); // Metal Pole
    billG.fillRect(56, 70, 16, 70);
    billG.fillStyle(0x00f0ff, 0.92);
    billG.fillRoundedRect(8, 8, 112, 64, 12);
    billG.lineStyle(4, 0xff0077, 1);
    billG.strokeRoundedRect(8, 8, 112, 64, 12);
    billG.fillStyle(0xffffff, 0.95);
    billG.fillRect(26, 30, 76, 8);
    billG.fillRect(38, 46, 52, 8);
    billG.generateTexture('prop_cyber_billboard', 128, 142);
    billG.destroy();
  }
}

