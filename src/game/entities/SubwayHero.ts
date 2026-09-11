import Phaser from 'phaser';
import { TrackEnvironmentManager } from '../systems/TrackEnvironmentManager';

export class SubwayHero extends Phaser.GameObjects.Container {
  declare public body: Phaser.Physics.Arcade.Body;

  private heroSprite: Phaser.GameObjects.Sprite;
  private shieldAura: Phaser.GameObjects.Sprite;
  public currentLane: number = 1; // 0: Left, 1: Center, 2: Right
  public lives: number = 3;
  public magneticPower: number = 100;
  public maxPower: number = 100;
  public attractionRadius: number = 260;

  // Power-up States
  public hasShield: boolean = false;
  public isSuperMagnet: boolean = false;
  public isTurboBoost: boolean = false;

  private animTimer: number = 0;
  private runFrameIndex: number = 0;
  private isPulseActive: boolean = false;
  private pulseCooldown: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCircle(24, -24, -24);
    this.body.setCollideWorldBounds(true);

    // Shield Aura Graphic
    this.shieldAura = scene.add.sprite(0, 0, 'shield_aura').setVisible(false);
    this.add(this.shieldAura);

    // Hero Runner Sprite
    this.heroSprite = scene.add.sprite(0, 0, 'hero_run1');
    this.add(this.heroSprite);

    this.setupInputControls();
  }

  private setupInputControls(): void {
    if (!this.scene.input.keyboard) return;

    const k = this.scene.input.keyboard;

    // Lane Dodgers (Left / Right keys or A / D)
    k.on('keydown-LEFT', () => this.moveLane(-1));
    k.on('keydown-A', () => this.moveLane(-1));
    k.on('keydown-RIGHT', () => this.moveLane(1));
    k.on('keydown-D', () => this.moveLane(1));

    // MAGNETIC REPEL PULSE (SPACEBAR / CLICK TAP)
    k.on('keydown-SPACE', () => this.triggerRepelPulse());
    this.scene.input.on('pointerdown', () => this.triggerRepelPulse());
  }

  public moveLane(dir: -1 | 1): void {
    const targetLane = Phaser.Math.Clamp(this.currentLane + dir, 0, 2);
    if (targetLane === this.currentLane) return;

    this.currentLane = targetLane;
    const targetX = TrackEnvironmentManager.LANE_X[this.currentLane];

    // Smooth lane switch tween
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      duration: 160,
      ease: 'Quad.easeOut'
    });
  }

  public triggerRepelPulse(): void {
    if (this.pulseCooldown > 0) return;

    this.isPulseActive = true;
    this.pulseCooldown = 700; // 700ms cooldown between pulses
    this.heroSprite.setTexture('hero_pulse');

    // Create expanding shockwave pulse visual
    const shockwave = this.scene.add.sprite(this.x, this.y, 'pulse_shockwave').setDepth(10);
    this.scene.tweens.add({
      targets: shockwave,
      scaleX: 3.5,
      scaleY: 3.5,
      alpha: 0,
      duration: 450,
      ease: 'Quad.easeOut',
      onComplete: () => shockwave.destroy()
    });

    // Notify scene of pulse to destroy/repel nearby hazardous bombs
    this.scene.events.emit('HERO_REPEL_PULSE', { x: this.x, y: this.y, radius: 220 });

    this.scene.time.delayedCall(300, () => {
      this.isPulseActive = false;
    });
  }

  public update(time: number, delta: number): void {
    if (this.pulseCooldown > 0) {
      this.pulseCooldown -= delta;
    }

    // Shield Aura Visibility & Pulse Rotation
    if (this.hasShield) {
      this.shieldAura.setVisible(true);
      this.shieldAura.rotation += 0.03;
    } else {
      this.shieldAura.setVisible(false);
    }

    // 4-Frame Running Animation Loop
    if (!this.isPulseActive) {
      this.animTimer += delta;
      if (this.animTimer > 120) {
        this.animTimer = 0;
        this.runFrameIndex = (this.runFrameIndex + 1) % 4;
        const keys = ['hero_run1', 'hero_run2', 'hero_run3', 'hero_run4'];
        this.heroSprite.setTexture(keys[this.runFrameIndex]);
      }
    }
  }
}
