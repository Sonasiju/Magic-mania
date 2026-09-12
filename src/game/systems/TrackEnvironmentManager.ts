import Phaser from 'phaser';
import { EnvironmentManager, EnvironmentInfo } from './EnvironmentManager';

export class TrackEnvironmentManager {
  public static TOP_Y = 90;
  public static BOTTOM_Y = 680;

  // 3D Perspective Helper: Returns 3D Lane X position given lane index (0, 1, 2) and Y position (90 to 680)
  public static getLaneXAtY(lane: number, y: number): number {
    const t = Phaser.Math.Clamp((y - this.TOP_Y) / (this.BOTTOM_Y - this.TOP_Y), 0, 1);
    if (lane === 0) {
      return Phaser.Math.Linear(560, 320, t);
    } else if (lane === 2) {
      return Phaser.Math.Linear(720, 960, t);
    }
    return 640; // Center lane stays at 640
  }

  // 3D Perspective Scale Helper: Returns scale (0.25 to 1.45) for First-Person POV depth zoom
  public static getScaleAtY(y: number): number {
    const t = Phaser.Math.Clamp((y - this.TOP_Y) / (this.BOTTOM_Y - this.TOP_Y), 0, 1);
    return Phaser.Math.Linear(0.25, 1.45, t);
  }

  public static LANE_X: [number, number, number] = [320, 640, 960];

  private scene: Phaser.Scene;
  private bgGraphics: Phaser.GameObjects.Graphics;
  private sidePropsGroup: Phaser.GameObjects.Group;
  private envInfo: EnvironmentInfo;
  private scrollOffset: number = 0;
  private propCycleIndex: number = 0;

  constructor(scene: Phaser.Scene, levelId: number) {
    this.scene = scene;
    this.envInfo = EnvironmentManager.getEnvironmentInfo(levelId);
    this.bgGraphics = scene.add.graphics();
    this.sidePropsGroup = scene.add.group();

    this.spawnInitialSideProps();
  }

  private getNextPropKey(): string {
    if (!this.envInfo.propKeys || this.envInfo.propKeys.length === 0) {
      return 'prop_tree_oak';
    }
    const key = this.envInfo.propKeys[this.propCycleIndex % this.envInfo.propKeys.length];
    this.propCycleIndex++;
    return key;
  }

  private spawnInitialSideProps(): void {
    for (let y = 130; y < 660; y += 120) {
      const scale = TrackEnvironmentManager.getScaleAtY(y) * 1.8;
      const leftX = Phaser.Math.Linear(460, 70, (y - 90) / 590);
      const rightX = Phaser.Math.Linear(820, 1210, (y - 90) / 590);

      const leftKey = this.getNextPropKey();
      const rightKey = this.getNextPropKey();

      const leftProp = this.scene.add.sprite(leftX, y, leftKey).setOrigin(0.5, 1.0).setAlpha(0.95).setScale(scale);
      const rightProp = this.scene.add.sprite(rightX, y, rightKey).setOrigin(0.5, 1.0).setAlpha(0.95).setScale(scale);

      // Custom property to store base scale for wind sway animation
      leftProp.setData('baseScale', scale);
      leftProp.setData('swayOffset', Math.random() * 10);
      rightProp.setData('baseScale', scale);
      rightProp.setData('swayOffset', Math.random() * 10);

      this.sidePropsGroup.addMultiple([leftProp, rightProp]);
    }
  }

  public update(delta: number, speed: number): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    const timeNow = this.scene.time.now;

    this.scrollOffset = (this.scrollOffset + speed * (delta / 1000) * 1.5) % 80;

    this.bgGraphics.clear();

    // 1. Environmental Backdrop & 3D Dynamic Scenery (Forest/Waterfall, Space, Mountain, City)
    const scenery = this.envInfo.sceneryType || 'forest';
    if (scenery === 'forest') {
      this.drawForestWaterfall(width, height, timeNow);
    } else if (scenery === 'space') {
      this.drawCosmicSpace(width, height, timeNow);
    } else if (scenery === 'mountain') {
      this.drawSnowMountains(width, height, timeNow);
    } else {
      this.drawCyberCity(width, height, timeNow);
    }

    // 2. 3D Perspective Ground Surface Polygon (Trapezoid from horizon to bottom)
    this.bgGraphics.fillStyle(this.envInfo.floorColor, 1);
    this.bgGraphics.beginPath();
    this.bgGraphics.moveTo(520, TrackEnvironmentManager.TOP_Y);
    this.bgGraphics.lineTo(760, TrackEnvironmentManager.TOP_Y);
    this.bgGraphics.lineTo(1120, height);
    this.bgGraphics.lineTo(160, height);
    this.bgGraphics.closePath();
    this.bgGraphics.fillPath();

    // 3. 3D Perspective Lane Divider Lines
    this.bgGraphics.lineStyle(3, this.envInfo.gridLineColor, 0.85);

    // Horizontal Perspective Grid Lines (Scrolling downward)
    for (let stepY = TrackEnvironmentManager.TOP_Y + (this.scrollOffset % 40); stepY < height; stepY += 45) {
      const t = (stepY - TrackEnvironmentManager.TOP_Y) / (height - TrackEnvironmentManager.TOP_Y);
      const leftX = Phaser.Math.Linear(520, 160, t);
      const rightX = Phaser.Math.Linear(760, 1120, t);
      this.bgGraphics.lineBetween(leftX, stepY, rightX, stepY);
    }

    // 4. Converging 3D Lane Rails
    this.bgGraphics.lineStyle(4, 0x00f0ff, 0.7);
    this.bgGraphics.lineBetween(600, TrackEnvironmentManager.TOP_Y, 480, height);
    this.bgGraphics.lineBetween(680, TrackEnvironmentManager.TOP_Y, 800, height);

    // Outer 3D Cyber Rail Glowing Boundaries
    this.bgGraphics.lineStyle(6, 0x00f0ff, 0.95);
    this.bgGraphics.lineBetween(520, TrackEnvironmentManager.TOP_Y, 160, height);
    this.bgGraphics.lineBetween(760, TrackEnvironmentManager.TOP_Y, 1120, height);

    // 5. Side Sidewalk Scenery Walls
    this.bgGraphics.fillStyle(this.envInfo.wallColor, 1);

    // Left Sidewalk
    this.bgGraphics.beginPath();
    this.bgGraphics.moveTo(0, TrackEnvironmentManager.TOP_Y);
    this.bgGraphics.lineTo(520, TrackEnvironmentManager.TOP_Y);
    this.bgGraphics.lineTo(160, height);
    this.bgGraphics.lineTo(0, height);
    this.bgGraphics.closePath();
    this.bgGraphics.fillPath();

    // Right Sidewalk
    this.bgGraphics.beginPath();
    this.bgGraphics.moveTo(760, TrackEnvironmentManager.TOP_Y);
    this.bgGraphics.lineTo(width, TrackEnvironmentManager.TOP_Y);
    this.bgGraphics.lineTo(width, height);
    this.bgGraphics.lineTo(1120, height);
    this.bgGraphics.closePath();
    this.bgGraphics.fillPath();

    // 6. Update, Scale, & Animate Side Scenery Props (Oak trees, Pine trees, Sakura, Palms, Crystals)
    this.sidePropsGroup.getChildren().forEach(child => {
      const prop = child as Phaser.GameObjects.Sprite;
      prop.y += speed * (delta / 1000) * 1.5;

      const t = (prop.y - TrackEnvironmentManager.TOP_Y) / (height - TrackEnvironmentManager.TOP_Y);
      const scale = TrackEnvironmentManager.getScaleAtY(prop.y) * 1.8;
      prop.setScale(scale);

      const swayOffset = prop.getData('swayOffset') || 0;

      // MICRO-ANIMATION LOGIC FOR TOWERING 3D TREES & SCENERY:
      if (prop.texture.key.includes('tree')) {
        // Wind Sway for 3D Oak, Pine, Birch, and Sakura Trees
        const swayAngle = Math.sin(timeNow * 0.003 + swayOffset + prop.y * 0.05) * 0.05;
        const windX = Math.sin(timeNow * 0.004 + swayOffset) * 5 * scale;
        prop.setRotation(swayAngle);

        if (prop.x < width / 2) {
          prop.x = Phaser.Math.Linear(460, 70, t) + windX;
        } else {
          prop.x = Phaser.Math.Linear(820, 1210, t) + windX;
        }
      } else if (prop.texture.key.includes('crystal') || prop.texture.key.includes('billboard')) {
        // Levitation & Hovering Bob for Space Crystals and Neon Signs
        const hoverY = Math.sin(timeNow * 0.005 + swayOffset) * 6 * scale;
        prop.setRotation(Math.sin(timeNow * 0.002) * 0.04);
        if (prop.x < width / 2) {
          prop.x = Phaser.Math.Linear(460, 70, t);
        } else {
          prop.x = Phaser.Math.Linear(820, 1210, t);
        }
        prop.y += hoverY * 0.1;
      } else if (prop.texture.key.includes('flower')) {
        // Flower Shimmer & Gentle Bobbing
        const flowerPulse = 1 + Math.sin(timeNow * 0.008 + swayOffset) * 0.08;
        prop.setScale(scale * flowerPulse);
        if (prop.x < width / 2) {
          prop.x = Phaser.Math.Linear(460, 70, t);
        } else {
          prop.x = Phaser.Math.Linear(820, 1210, t);
        }
      } else {
        if (prop.x < width / 2) {
          prop.x = Phaser.Math.Linear(460, 70, t);
        } else {
          prop.x = Phaser.Math.Linear(820, 1210, t);
        }
      }

      // Recycle prop at top with next texture key in cycle!
      if (prop.y > height + 100) {
        prop.y = TrackEnvironmentManager.TOP_Y - 40;
        const newKey = this.getNextPropKey();
        prop.setTexture(newKey);
        prop.setOrigin(0.5, 1.0);
        prop.setRotation(0);
        prop.setData('swayOffset', Math.random() * 10);
      }
    });
  }

  // 🌲 1. LUSH WIND-SWAYING GREEN GRASS MEADOW & MOVING WHITE SKY CLOUDS + FLYING BIRDS (ZERO WATERFALLS)
  private drawForestWaterfall(width: number, height: number, timeNow: number): void {
    const horizonY = TrackEnvironmentManager.TOP_Y;

    // 🌤️ 1. Vibrant Morning Sky Gradient (Pastel Azure Blue -> Soft Sky Gold Glow)
    // Upper Azure Blue Sky
    this.bgGraphics.fillStyle(0x38bdf8, 1);
    this.bgGraphics.fillRect(0, 0, width, 120);
    // Horizon Soft Sky Glow
    this.bgGraphics.fillStyle(0xbae6fd, 0.95);
    this.bgGraphics.fillRect(0, 110, width, horizonY - 110);

    // 🌞 2. RADIANT RISING GOLDEN SUN & SUNBEAMS ON HORIZON
    const sunY = 170 + Math.sin(timeNow * 0.0008) * 2;
    this.bgGraphics.fillStyle(0xfde047, 0.4);
    this.bgGraphics.fillCircle(640, sunY, 65);
    this.bgGraphics.fillStyle(0xfef08a, 0.65);
    this.bgGraphics.fillCircle(640, sunY, 38);
    this.bgGraphics.fillStyle(0xffffff, 0.98);
    this.bgGraphics.fillCircle(640, sunY, 22);

    // Golden Sunbeam Rays Spreading Across Sky
    this.bgGraphics.fillStyle(0xfef08a, 0.2);
    this.bgGraphics.fillTriangle(640, sunY, 0, horizonY, 320, horizonY);
    this.bgGraphics.fillTriangle(640, sunY, 380, horizonY, 900, horizonY);
    this.bgGraphics.fillTriangle(640, sunY, 960, horizonY, 1280, horizonY);

    // ☁️ 3. VOLUMETRIC DRIFTING WHITE GHIBLI CLOUDS MOVING ACROSS SKY
    this.bgGraphics.fillStyle(0xffffff, 0.96);
    const cloudShift = (timeNow * 0.02) % (width + 350);
    
    // Cloud Group 1
    const c1X = (80 + cloudShift) % (width + 250) - 120;
    this.bgGraphics.fillCircle(c1X, 40, 32);
    this.bgGraphics.fillCircle(c1X + 28, 30, 42);
    this.bgGraphics.fillCircle(c1X + 62, 42, 30);
    this.bgGraphics.fillCircle(c1X + 35, 48, 32);

    // Cloud Group 2
    const c2X = (520 + cloudShift * 0.85) % (width + 250) - 120;
    this.bgGraphics.fillCircle(c2X, 55, 26);
    this.bgGraphics.fillCircle(c2X + 25, 46, 34);
    this.bgGraphics.fillCircle(c2X + 54, 56, 24);

    // Cloud Group 3
    const c3X = (940 + cloudShift * 1.15) % (width + 250) - 120;
    this.bgGraphics.fillCircle(c3X, 35, 34);
    this.bgGraphics.fillCircle(c3X + 32, 26, 44);
    this.bgGraphics.fillCircle(c3X + 68, 38, 30);

    // 🦅 4. ANIMATED FLOCK OF BIRDS FLYING ACROSS MORNING SKY
    this.bgGraphics.lineStyle(2.2, 0x0f172a, 0.85); // Crisp Silhouette
    for (let b = 0; b < 7; b++) {
      const birdX = (b * 70 + timeNow * 0.048) % (width + 120) - 60;
      const birdY = 38 + Math.sin(timeNow * 0.002 + b) * 14 + (b * 5);
      const flap = Math.sin(timeNow * 0.015 + b * 0.7) * 7.5;
      
      this.bgGraphics.beginPath();
      this.bgGraphics.moveTo(birdX - 9, birdY - flap);
      this.bgGraphics.lineTo(birdX, birdY);
      this.bgGraphics.lineTo(birdX + 9, birdY - flap);
      this.bgGraphics.strokePath();
    }

    // 🌿 5. FULL LUSH GREEN SWAYING GRASS MEADOW PRAIRIE FIELD (ENTIRE HORIZON X: 0 - 1280)
    const grassSway = Math.sin(timeNow * 0.005) * 6.5;

    // Base Meadow Turf Tint
    this.bgGraphics.fillStyle(0x166534, 0.95);
    this.bgGraphics.fillRect(0, horizonY - 14, width, 14);

    // Dense Multi-Tier Wind-Swaying Green Grass Blades Across Entire Width
    for (let gx = 0; gx < width; gx += 14) {
      // Layer 1: Deep Forest Green Base Blades
      this.bgGraphics.fillStyle(0x14532d, 0.95);
      this.bgGraphics.fillTriangle(gx, horizonY, gx + 4 + grassSway, horizonY - 18, gx + 8, horizonY);
      // Layer 2: Rich Emerald Green Blades
      this.bgGraphics.fillStyle(0x15803d, 0.95);
      this.bgGraphics.fillTriangle(gx + 5, horizonY, gx + 10 + grassSway, horizonY - 24, gx + 14, horizonY);
      // Layer 3: Vibrant Spring Leaf Tips
      this.bgGraphics.fillStyle(0x22c55e, 0.9);
      this.bgGraphics.fillTriangle(gx + 10, horizonY, gx + 15 + grassSway, horizonY - 16, gx + 18, horizonY);
    }

    // Horizon Line Divider (Sunrise Gold Line)
    this.bgGraphics.lineStyle(3, 0xfde047, 0.95);
    this.bgGraphics.lineBetween(0, horizonY, width, horizonY);
  }

  // 🌌 2. COSMIC SPACE & NEBULAE / STARS BACKDROP RENDERER
  private drawCosmicSpace(width: number, height: number, timeNow: number): void {
    this.bgGraphics.fillStyle(0x030712, 1);
    this.bgGraphics.fillRect(0, 0, width, height);

    // Pulsing Swirling Nebula Gas Clouds (Far Left & Right Corners)
    const nebPulse1 = 0.3 + Math.sin(timeNow * 0.002) * 0.12;
    const nebPulse2 = 0.3 + Math.cos(timeNow * 0.0025) * 0.12;
    this.bgGraphics.fillStyle(0xa855f7, nebPulse1);
    this.bgGraphics.fillCircle(180, 35, 55);
    this.bgGraphics.fillStyle(0x00f0ff, nebPulse2);
    this.bgGraphics.fillCircle(1100, 40, 65);

    // 🪐 Giant Ringed Saturn Planet (Far Right Corner Sky)
    const saturnY = 32 + Math.sin(timeNow * 0.001) * 3;
    this.bgGraphics.fillStyle(0x312e81, 1);
    this.bgGraphics.fillCircle(1100, saturnY, 24);
    this.bgGraphics.fillStyle(0x00f0ff, 0.85);
    this.bgGraphics.fillEllipse(1100, saturnY, 70, 12); // Saturn Ring

    // 💫 Twinkling 3D Starfield
    const starCoords = [100, 15, 240, 50, 390, 20, 540, 60, 680, 18, 820, 55, 960, 25, 1140, 65, 1220, 20];
    for (let i = 0; i < starCoords.length; i += 2) {
      const starAlpha = 0.4 + Math.sin(timeNow * 0.005 + i) * 0.5;
      this.bgGraphics.fillStyle(0xffffff, Phaser.Math.Clamp(starAlpha, 0.1, 1));
      const size = (i % 4 === 0) ? 3.5 : 2;
      this.bgGraphics.fillCircle(starCoords[i], starCoords[i + 1], size);
    }

    // ☄️ Passing Shooting Star Comet
    const cometProgress = (timeNow * 0.3) % (width + 300);
    const cometX = width - cometProgress;
    const cometY = 10 + (cometProgress * 0.15) % 70;
    if (cometX > -50 && cometX < width + 50) {
      this.bgGraphics.lineStyle(2, 0x00f0ff, 0.9);
      this.bgGraphics.lineBetween(cometX, cometY, cometX + 35, cometY - 8);
      this.bgGraphics.fillStyle(0xffffff, 1);
      this.bgGraphics.fillCircle(cometX, cometY, 3);
    }

    this.bgGraphics.lineStyle(3, 0xa855f7, 0.9);
    this.bgGraphics.lineBetween(0, TrackEnvironmentManager.TOP_Y, width, TrackEnvironmentManager.TOP_Y);
  }

  // 🏔️ 3. SNOW MOUNTAIN & SUNSET FLORAL HORIZON RENDERER
  private drawSnowMountains(width: number, height: number, timeNow: number): void {
    // Sunset Sky Gradient with Glowing Sun Flare
    this.bgGraphics.fillStyle(0x311042, 1);
    this.bgGraphics.fillRect(0, 0, width, TrackEnvironmentManager.TOP_Y);

    // Glowing Sunset Sun Flare behind peaks
    const sunPulse = 1 + Math.sin(timeNow * 0.003) * 0.08;
    this.bgGraphics.fillStyle(0xfb923c, 0.85);
    this.bgGraphics.fillCircle(640, TrackEnvironmentManager.TOP_Y - 10, 45 * sunPulse);
    this.bgGraphics.fillStyle(0xfef08a, 0.95);
    this.bgGraphics.fillCircle(640, TrackEnvironmentManager.TOP_Y - 10, 25 * sunPulse);

    // Snow-Capped Mountain Peaks
    this.bgGraphics.fillStyle(0x1e293b, 1);
    this.bgGraphics.fillTriangle(80, TrackEnvironmentManager.TOP_Y, 300, 10, 520, TrackEnvironmentManager.TOP_Y);
    this.bgGraphics.fillTriangle(760, TrackEnvironmentManager.TOP_Y, 980, 15, 1200, TrackEnvironmentManager.TOP_Y);

    // White Snow Caps
    this.bgGraphics.fillStyle(0xffffff, 0.95);
    this.bgGraphics.fillTriangle(260, 26, 300, 10, 340, 26);
    this.bgGraphics.fillTriangle(940, 28, 980, 15, 1020, 28);

    // 🌸 ❄️ Falling Snow & Drifting Sakura Blossom Petals
    for (let k = 0; k < 12; k++) {
      const flakeX = (k * 110 + timeNow * 0.05) % width;
      const flakeY = (k * 15 + timeNow * 0.04) % TrackEnvironmentManager.TOP_Y;
      const isSakuraPetal = k % 3 === 0;

      if (isSakuraPetal) {
        this.bgGraphics.fillStyle(0xf472b6, 0.85);
        this.bgGraphics.fillEllipse(flakeX, flakeY, 5, 3);
      } else {
        this.bgGraphics.fillStyle(0xffffff, 0.9);
        this.bgGraphics.fillCircle(flakeX, flakeY, 2);
      }
    }

    // Alpine Sunset Glow Horizon
    this.bgGraphics.lineStyle(3, 0xfb923c, 0.9);
    this.bgGraphics.lineBetween(0, TrackEnvironmentManager.TOP_Y, width, TrackEnvironmentManager.TOP_Y);
  }

  // 🏙️ 4. CYBER CITY SKYLINE RENDERER WITH MOVING SKYLINE TRAFFIC
  private drawCyberCity(width: number, height: number, timeNow: number): void {
    this.bgGraphics.fillStyle(0x030712, 1);
    this.bgGraphics.fillRect(0, 0, width, TrackEnvironmentManager.TOP_Y);

    const buildingWidths = [45, 60, 35, 70, 50, 40, 65, 55, 80, 45, 60, 50, 70];
    let skyX = 10;
    buildingWidths.forEach((bWidth, idx) => {
      const bHeight = 35 + (idx * 17) % 40;
      const bY = TrackEnvironmentManager.TOP_Y - bHeight;

      this.bgGraphics.fillStyle(0x0f172a, 1);
      this.bgGraphics.fillRect(skyX, bY, bWidth - 4, bHeight);

      // Pulsing Cyber Neon Window Lights
      const windowColor = idx % 3 === 0 ? 0x00f0ff : (idx % 3 === 1 ? 0xeab308 : 0xff0077);
      const isWindowLit = Math.floor(timeNow * 0.002 + idx) % 2 === 0;
      this.bgGraphics.fillStyle(windowColor, isWindowLit ? 0.9 : 0.4);

      for (let wy = bY + 6; wy < TrackEnvironmentManager.TOP_Y - 8; wy += 8) {
        for (let wx = skyX + 5; wx < skyX + bWidth - 10; wx += 9) {
          if ((wx + wy) % 2 === 0) {
            this.bgGraphics.fillRect(wx, wy, 4, 4);
          }
        }
      }

      skyX += bWidth;
    });

    // 🛸 Moving Hovercraft Skyline Traffic Headlight Trails
    const trafficX1 = (timeNow * 0.2) % width;
    const trafficX2 = width - ((timeNow * 0.25) % width);
    this.bgGraphics.lineStyle(2, 0x00f0ff, 0.9);
    this.bgGraphics.lineBetween(trafficX1, 35, trafficX1 - 25, 35);
    this.bgGraphics.fillStyle(0xffffff, 1);
    this.bgGraphics.fillCircle(trafficX1, 35, 2.5);

    this.bgGraphics.lineStyle(2, 0xff0077, 0.9);
    this.bgGraphics.lineBetween(trafficX2, 20, trafficX2 + 25, 20);
    this.bgGraphics.fillStyle(0xffffff, 1);
    this.bgGraphics.fillCircle(trafficX2, 20, 2.5);

    this.bgGraphics.lineStyle(3, 0x00f0ff, 0.8);
    this.bgGraphics.lineBetween(0, TrackEnvironmentManager.TOP_Y, width, TrackEnvironmentManager.TOP_Y);
  }
}


