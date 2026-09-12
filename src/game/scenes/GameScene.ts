import Phaser from 'phaser';
import { SubwayHero } from '../entities/SubwayHero';
import { TrackEnvironmentManager } from '../systems/TrackEnvironmentManager';
import { StorageManager } from '../../storage/localStorage';
import { EnvironmentManager, EnvironmentInfo } from '../systems/EnvironmentManager';

interface MovingObject extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body;
  objectCategory: 'coin' | 'crystal' | 'obstacle' | 'bomb' | 'powerup';
  powerType?: 'shield' | 'magnet' | 'boost';
  lane: number;
}

export class GameScene extends Phaser.Scene {
  private hero!: SubwayHero;
  private trackManager!: TrackEnvironmentManager;
  private objectsGroup!: Phaser.Physics.Arcade.Group;
  private beamGraphics!: Phaser.GameObjects.Graphics;
  private envInfo!: EnvironmentInfo;

  private score: number = 0;
  private coinsCollected: number = 0;
  private requiredCoins: number = 15;
  private combo: number = 1;
  private levelId: number = 1;
  private runDistance: number = 0;
  private targetDistance: number = 1000; // Finish line distance
  private runSpeed: number = 220;
  // Global speed scale (multiply runSpeed by this to slow/speed the game).
  // Lower values make incoming objects move slower and distance progress slower.
  private speedScale: number = 0.72;
  private levelStartTime: number = 0;

  private scoreText!: Phaser.GameObjects.Text;
  private coinsText!: Phaser.GameObjects.Text;
  private distanceProgressBar!: Phaser.GameObjects.Graphics;
  private distancePercentText!: Phaser.GameObjects.Text;
  private powerBarGraphics!: Phaser.GameObjects.Graphics;
  private livesContainer!: Phaser.GameObjects.Container;
  private rejectPromptText!: Phaser.GameObjects.Text;

  constructor() {
    super('GameScene');
  }

  init(data: { levelId?: number }): void {
    this.levelId = data.levelId || 1;
    this.score = 0;
    this.coinsCollected = 0;
    this.combo = 1;
    this.runDistance = 0;
    this.targetDistance = 10000 + this.levelId * 1500; // ~45s-65s run duration
    this.runSpeed = 210 + this.levelId * 10;
    this.requiredCoins = Math.min(40, 15 + Math.floor(this.levelId * 1.2));
    this.levelStartTime = Date.now();
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.envInfo = EnvironmentManager.getEnvironmentInfo(this.levelId);

    // 1. 3-Lane Track Scrolling Manager
    this.trackManager = new TrackEnvironmentManager(this, this.levelId);

    // 2. Physics & Graphics Layers
    this.beamGraphics = this.add.graphics();
    this.objectsGroup = this.physics.add.group();

    // 3. Create Subway Hero Runner
    this.hero = new SubwayHero(this, TrackEnvironmentManager.LANE_X[1], height - 140);

    // Collision setup
    this.physics.add.overlap(
      this.hero,
      this.objectsGroup,
      (hero, obj) => this.handleHeroObjectCollision(hero as SubwayHero, obj as MovingObject),
      undefined,
      this
    );

    // Listen for Magnetic Repel Pulse event from Hero
    this.events.on('HERO_REPEL_PULSE', (data: { x: number; y: number; radius: number }) => {
      this.handleRepelPulse(data.x, data.y, data.radius);
    });

    // 4. Polished Runner HUD
    this.setupHUD();

    // 5. Spawn Item Streams & Obstacles
    this.time.addEvent({
      delay: Math.max(850, 1500 - this.levelId * 30),
      callback: () => this.spawnTrackObject(),
      loop: true
    });
  }

  private setupHUD(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const hudY = height - 78;

    // 1. Glassmorphic Cyber Bottom HUD Panel (Translucent Dark Navy with Neon Glow)
    const hudPanel = this.add.graphics();
    hudPanel.fillStyle(0x090d16, 0.92);
    hudPanel.lineStyle(2, 0x00f0ff, 0.9);
    hudPanel.fillRoundedRect(12, hudY, width - 24, 66, 14);
    hudPanel.strokeRoundedRect(12, hudY, width - 24, 66, 14);

    // Inner Specular Accent Line
    hudPanel.lineStyle(1, 0xffffff, 0.35);
    hudPanel.strokeRoundedRect(14, hudY + 2, width - 28, 62, 12);

    // Bottom-Left: ❤️ Lives Badge Container
    const livesBadge = this.add.graphics();
    livesBadge.fillStyle(0x1e1b4b, 0.9);
    livesBadge.lineStyle(1.5, 0xff0077, 0.8);
    livesBadge.fillRoundedRect(22, hudY + 8, 110, 48, 10);
    livesBadge.strokeRoundedRect(22, hudY + 8, 110, 48, 10);

    this.add.text(77, hudY + 18, 'LIVES', {
      fontFamily: 'Orbitron',
      fontSize: '10px',
      color: '#ff0077'
    }).setOrigin(0.5);

    this.livesContainer = this.add.container(77, hudY + 38);
    this.updateLivesDisplay();

    // Bottom-Center: 🏁 Mission Progress Header Bar
    this.add.text(width / 2, hudY + 14, `MISSION ${this.levelId}: ${this.envInfo.themeName}`, {
      fontFamily: 'Orbitron',
      fontSize: '12px',
      color: '#00f0ff'
    }).setOrigin(0.5);

    this.distanceProgressBar = this.add.graphics();
    this.distancePercentText = this.add.text(width / 2, hudY + 36, '0% FINISH', {
      fontFamily: 'Orbitron',
      fontSize: '11px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.updateDistanceBar();

    // Bottom-Right: ⭐ Score & 🪙 Coins Glass Badges
    const scoreBadge = this.add.graphics();
    scoreBadge.fillStyle(0x1e1b4b, 0.9);
    scoreBadge.lineStyle(1.5, 0xf59e0b, 0.8);
    scoreBadge.fillRoundedRect(width - 250, hudY + 8, 225, 48, 10);
    scoreBadge.strokeRoundedRect(width - 250, hudY + 8, 225, 48, 10);

    this.scoreText = this.add.text(width - 238, hudY + 15, `⭐ SCORE: ${this.score}`, {
      fontFamily: 'Orbitron',
      fontSize: '15px',
      color: '#ffb700'
    });

    this.coinsText = this.add.text(width - 238, hudY + 36, `🪙 COINS: ${this.coinsCollected}/${this.requiredCoins}`, {
      fontFamily: 'Inter',
      fontSize: '12px',
      color: '#38bdf8'
    });

    // Magnet Power Gauge Meter
    this.powerBarGraphics = this.add.graphics();
    this.updatePowerBar();

    // Dynamic SPACEBAR / TAP TO REJECT HAZARD Prompt (Floating Above Bottom HUD)
    this.rejectPromptText = this.add.text(width / 2, hudY - 22, '⚡ PRESS SPACEBAR / TAP TO REJECT & BLAST BOMBS! ⚡', {
      fontFamily: 'Orbitron',
      fontSize: '12px',
      color: '#00f0ff',
      stroke: '#05070e',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: this.rejectPromptText,
      alpha: 0.35,
      duration: 750,
      yoyo: true,
      repeat: -1
    });

    // ESC shortcut
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-ESC', () => this.scene.start('LevelSelectScene'));
    }
  }

  private updateLivesDisplay(): void {
    this.livesContainer.removeAll(true);
    for (let i = 0; i < 3; i++) {
      const active = i < this.hero.lives;
      const heart = this.add.text((i - 1) * 26, 0, active ? '❤️' : '🖤', {
        fontSize: '16px'
      }).setOrigin(0.5);
      this.livesContainer.add(heart);
    }
  }

  private updateDistanceBar(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const hudY = height - 78;
    const barX = width / 2 - 130;
    const barY = hudY + 28;
    const barW = 260;
    const barH = 14;

    this.distanceProgressBar.clear();
    // Track Bar Background
    this.distanceProgressBar.fillStyle(0x0f172a, 1);
    this.distanceProgressBar.fillRoundedRect(barX, barY, barW, barH, 5);

    const ratio = Phaser.Math.Clamp(this.runDistance / this.targetDistance, 0, 1);
    // Glowing Cyan Progress Fill
    this.distanceProgressBar.fillStyle(0x00f0ff, 1);
    this.distanceProgressBar.fillRoundedRect(barX, barY, barW * ratio, barH, 5);
    this.distanceProgressBar.lineStyle(1.5, 0x00f0ff, 0.9);
    this.distanceProgressBar.strokeRoundedRect(barX, barY, barW, barH, 5);

    this.distancePercentText.setText(`${Math.floor(ratio * 100)}% FINISH`);
  }

  private updatePowerBar(): void {
    const width = this.cameras.main.width;
    const barX = 145;
    const barY = 38;
    const barW = 90;
    const barH = 12;

    this.powerBarGraphics.clear();
    this.powerBarGraphics.fillStyle(0x0f172a, 1);
    this.powerBarGraphics.fillRoundedRect(barX, barY, barW, barH, 4);

    const ratio = Math.max(0, this.hero.magneticPower / this.hero.maxPower);
    this.powerBarGraphics.fillStyle(0xff0077, 1);
    this.powerBarGraphics.fillRoundedRect(barX, barY, barW * ratio, barH, 4);
    this.powerBarGraphics.lineStyle(1.5, 0xff0077, 0.8);
    this.powerBarGraphics.strokeRoundedRect(barX, barY, barW, barH, 4);
  }

  private spawnTrackObject(): void {
    const lane = Math.floor(Math.random() * 3);
    const spawnY = TrackEnvironmentManager.TOP_Y;
    const spawnX = TrackEnvironmentManager.getLaneXAtY(lane, spawnY);
    const initialScale = TrackEnvironmentManager.getScaleAtY(spawnY);

    const rand = Math.random();

    if (rand < 0.45) {
      // Stream of Coins
      for (let i = 0; i < 3; i++) {
        const coin = this.objectsGroup.create(spawnX, spawnY - i * 35, 'item_coin') as MovingObject;
        coin.objectCategory = 'coin';
        coin.lane = lane;
        coin.setScale(initialScale);
        coin.body.setCircle(14);
      }
    } else if (rand < 0.70) {
      // Obstacle (Subway Train, Car, Crate, Barrier)
      const obsKeys = ['obs_train', 'obs_car', 'obs_crate', 'obs_barrier'];
      const chosenKey = obsKeys[Math.floor(Math.random() * obsKeys.length)];
      const obs = this.objectsGroup.create(spawnX, spawnY, chosenKey) as MovingObject;
      obs.objectCategory = 'obstacle';
      obs.lane = lane;
      obs.setScale(initialScale);
      obs.body.setSize(obs.width * 0.8, obs.height * 0.8);
    } else if (rand < 0.88) {
      // Magnetic Bomb hazard
      const bomb = this.objectsGroup.create(spawnX, spawnY, 'obs_bomb') as MovingObject;
      bomb.objectCategory = 'bomb';
      bomb.lane = lane;
      bomb.setScale(initialScale);
      bomb.body.setCircle(16);
    } else {
      // Power-up
      const powerKeys: Array<{ key: string; type: 'shield' | 'magnet' | 'boost' }> = [
        { key: 'power_shield', type: 'shield' },
        { key: 'power_magnet', type: 'magnet' },
        { key: 'power_boost', type: 'boost' }
      ];
      const chosen = powerKeys[Math.floor(Math.random() * powerKeys.length)];
      const pow = this.objectsGroup.create(spawnX, spawnY, chosen.key) as MovingObject;
      pow.objectCategory = 'powerup';
      pow.powerType = chosen.type;
      pow.lane = lane;
      pow.setScale(initialScale);
      pow.body.setCircle(16);
    }
  }

  public update(time: number, delta: number): void {
    // 1. Scroll Track & Hero Update
    const effectiveSpeed = this.runSpeed * this.speedScale;
    this.trackManager.update(delta, effectiveSpeed);
    this.hero.update(time, delta);

    // 2. Increment Distance Progress (scaled)
    this.runDistance += effectiveSpeed * delta * 0.001;
    this.updateDistanceBar();

    if (this.runDistance >= this.targetDistance) {
      this.handleLevelCompleted();
      return;
    }

    // 3. Move Oncoming Track Objects Downward in 3D Perspective
    this.beamGraphics.clear();
    const gauntletPos = new Phaser.Math.Vector2(this.hero.x, this.hero.y);

    const objects = this.objectsGroup.getChildren() as MovingObject[];
    objects.forEach(obj => {
      if (!obj.active) return;

      // Move object down track
      obj.y += effectiveSpeed * (delta / 1000) * 1.5;

      // 3D Perspective Scaling & Converging Lane Position
      const targetScale = TrackEnvironmentManager.getScaleAtY(obj.y);

      // ALIVE OBJECT ANIMATIONS: Floating Levitation, Bobbing & Spinning
      const levitationBob = Math.sin(time * 0.006 + obj.x * 0.1) * 7;

      if (obj.objectCategory === 'coin') {
        obj.rotation += 0.03; // Metallic coin spin
        obj.setScale(targetScale * (1 + Math.sin(time * 0.008 + obj.y) * 0.08));
      } else if (obj.objectCategory === 'powerup') {
        obj.rotation += 0.015; // Glass powerup orb rotation
        obj.setScale(targetScale * (1 + Math.sin(time * 0.01) * 0.12));
      } else if (obj.objectCategory === 'bomb') {
        // Breathing bomb hazard pulse
        obj.setScale(targetScale * (1 + Math.sin(time * 0.012) * 0.15));
      } else {
        obj.setScale(targetScale);
      }

      // MAGNETIC ATTRACTION CORE MECHANIC!
      let isPulled = false;
      if (obj.objectCategory === 'coin' || obj.objectCategory === 'crystal' || (this.hero.isSuperMagnet && obj.objectCategory !== 'obstacle')) {
        const dist = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, obj.x, obj.y);
        const radius = this.hero.isSuperMagnet ? 600 : this.hero.attractionRadius;

        if (dist <= radius) {
          isPulled = true;
          // Gravitational pull toward 3rd-person hero's magnet
          const pullAngle = Phaser.Math.Angle.Between(obj.x, obj.y, this.hero.x + 22, this.hero.y - 12);
          obj.x += Math.cos(pullAngle) * 16;
          obj.y += Math.sin(pullAngle) * 16;

          // Electric Bezier Magnetic Force Arc Visual to hero's magnet tip
          this.beamGraphics.lineStyle(3, 0x00f0ff, 0.95);
          const curve = new Phaser.Curves.QuadraticBezier(
            new Phaser.Math.Vector2(gauntletPos.x + 22, gauntletPos.y - 12),
            new Phaser.Math.Vector2((gauntletPos.x + obj.x) / 2, (gauntletPos.y + obj.y) / 2 - 25),
            new Phaser.Math.Vector2(obj.x, obj.y)
          );
          curve.draw(this.beamGraphics);
        }
      }

      if (!isPulled) {
        // Track along 3D Perspective Lane Slope with Floating Levitation
        obj.x = TrackEnvironmentManager.getLaneXAtY(obj.lane, obj.y) + (obj.objectCategory !== 'obstacle' ? Math.cos(time * 0.004 + obj.y) * 4 : 0);
      }

      // Cleanup objects off screen
      if (obj.y > this.cameras.main.height + 60) {
        obj.destroy();
      }
    });
  }

  private handleRepelPulse(px: number, py: number, radius: number): void {
    const objects = this.objectsGroup.getChildren() as MovingObject[];
    objects.forEach(obj => {
      if (!obj.active) return;

      const dist = Phaser.Math.Distance.Between(px, py, obj.x, obj.y);
      if (dist <= radius && (obj.objectCategory === 'bomb' || obj.objectCategory === 'obstacle')) {
        // REPEL & DESTROY HAZARD IN PULSE WAVE!
        this.showFloatingText(obj.x, obj.y, 'REPELLED! 💥 +200', '#00f0ff');
        this.score += 200;

        // Sparkle explosion
        const emitter = this.add.particles(obj.x, obj.y, 'spark_particle', {
          speed: { min: 80, max: 200 },
          scale: { start: 1.5, end: 0 },
          alpha: { start: 1, end: 0 },
          lifespan: 400,
          quantity: 12,
          blendMode: 'ADD'
        });
        this.time.delayedCall(400, () => emitter.destroy());

        obj.destroy();
      }
    });
  }

  private handleHeroObjectCollision(hero: SubwayHero, obj: MovingObject): void {
    if (!obj.active) return;

    if (obj.objectCategory === 'coin') {
      this.coinsCollected += 1;
      const pts = Math.floor(100 * this.combo);
      this.score += pts;
      this.combo = Math.min(5.0, this.combo + 0.15);
      this.showFloatingText(obj.x, obj.y, `+${pts}`, '#ffb700');
    } else if (obj.objectCategory === 'powerup') {
      if (obj.powerType === 'shield') {
        hero.hasShield = true;
        this.showFloatingText(obj.x, obj.y, 'SHIELD ACTIVATED! 🛡️', '#38bdf8');
      } else if (obj.powerType === 'magnet') {
        hero.isSuperMagnet = true;
        this.showFloatingText(obj.x, obj.y, 'SUPER MAGNET SURGE! 🧲', '#facc15');
        this.time.delayedCall(5000, () => hero.isSuperMagnet = false);
      } else if (obj.powerType === 'boost') {
        hero.isTurboBoost = true;
        this.showFloatingText(obj.x, obj.y, 'TURBO SPEED BOOST! ⚡', '#4ade80');
        this.time.delayedCall(4000, () => hero.isTurboBoost = false);
      }
    } else if (obj.objectCategory === 'obstacle' || obj.objectCategory === 'bomb') {
      if (hero.hasShield) {
        hero.hasShield = false;
        this.showFloatingText(obj.x, obj.y, 'SHIELD ABSORBED HIT! 🛡️', '#38bdf8');
        this.cameras.main.shake(150, 0.01);
      } else if (hero.isTurboBoost) {
        // Invincible during boost
        this.showFloatingText(obj.x, obj.y, 'BLASTED THROUGH! ⚡', '#4ade80');
      } else {
        // DANGEROUS HIT TAKEN
        hero.lives -= 1;
        this.combo = 1;
        this.updateLivesDisplay();

        this.cameras.main.shake(250, 0.02);
        this.cameras.main.flash(200, 239, 68, 68);
        this.showFloatingText(obj.x, obj.y, 'DAMAGED! -1 LIFE', '#ef4444');

        if (hero.lives <= 0) {
          this.handleGameOver();
        }
      }
    }

    this.scoreText.setText(`⭐ SCORE: ${Math.floor(this.score)}`);
    this.coinsText.setText(`COINS: ${this.coinsCollected}/${this.requiredCoins}`);
    obj.destroy();
  }

  private showFloatingText(x: number, y: number, text: string, color: string): void {
    const txt = this.add.text(x, y, text, {
      fontFamily: 'Orbitron',
      fontSize: '16px',
      color: color,
      stroke: '#05070e',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: txt,
      y: y - 50,
      alpha: 0,
      duration: 850,
      onComplete: () => txt.destroy()
    });
  }

  private handleLevelCompleted(): void {
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - this.levelStartTime) / 1000));
    let stars = 1;
    if (this.hero.lives === 3 && elapsedSeconds <= 50) {
      stars = 3;
    } else if (this.score >= 1200 || this.hero.lives >= 2) {
      stars = 2;
    }

    const currentProg = StorageManager.loadProgress();
    const nextLevelId = Math.min(20, this.levelId + 1);
    StorageManager.saveProgress({
      highScore: Math.max(currentProg.highScore, Math.floor(this.score)),
      unlockedLevel: Math.max(currentProg.unlockedLevel, nextLevelId),
      levelStars: { ...currentProg.levelStars, [this.levelId]: Math.max(currentProg.levelStars[this.levelId] || 0, stars) }
    });

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const nextEnvInfo = EnvironmentManager.getEnvironmentInfo(nextLevelId);

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.82);
    overlay.fillRect(0, 0, width, height);

    const card = this.add.graphics();
    card.fillStyle(0x0f172a, 0.95);
    card.lineStyle(2, 0x00f0ff, 1);
    card.fillRoundedRect(width / 2 - 240, height / 2 - 160, 480, 320, 16);
    card.strokeRoundedRect(width / 2 - 240, height / 2 - 160, 480, 320, 16);

    this.add.text(width / 2, height / 2 - 120, 'RUN COMPLETED!', {
      fontFamily: 'Orbitron',
      fontSize: '28px',
      color: '#00f0ff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 70, `${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)} (${stars}/3 STARS)`, {
      fontFamily: 'Orbitron',
      fontSize: '22px',
      color: '#ffb700'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 20, `SCORE: ${Math.floor(this.score)}  |  TIME: ${elapsedSeconds}s`, {
      fontFamily: 'Inter',
      fontSize: '17px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const prevG = this.add.graphics();
    prevG.fillStyle(0x1e293b, 1);
    prevG.fillRoundedRect(width / 2 - 200, height / 2 + 15, 400, 44, 8);
    this.add.text(width / 2, height / 2 + 37, `NEXT TRACK: LEVEL ${nextLevelId} - ${nextEnvInfo.themeName}`, {
      fontFamily: 'Orbitron',
      fontSize: '13px',
      color: '#00f0ff'
    }).setOrigin(0.5);

    const nextBtn = this.add.text(width / 2, height / 2 + 95, 'NEXT TRACK ►', {
      fontFamily: 'Orbitron',
      fontSize: '18px',
      color: '#ff0077'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    nextBtn.on('pointerdown', () => {
      this.scene.restart({ levelId: nextLevelId });
    });
  }

  private handleGameOver(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.85);
    overlay.fillRect(0, 0, width, height);

    this.add.text(width / 2, height / 2 - 50, 'RUN CRASHED', {
      fontFamily: 'Orbitron',
      fontSize: '48px',
      color: '#ef4444'
    }).setOrigin(0.5);

    const retryBtn = this.add.text(width / 2, height / 2 + 30, 'RETRY RUN ↺', {
      fontFamily: 'Orbitron',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retryBtn.on('pointerdown', () => {
      this.scene.restart({ levelId: this.levelId });
    });
  }
}
