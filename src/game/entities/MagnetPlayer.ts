import Phaser from 'phaser';

export class MagnetPlayer extends Phaser.GameObjects.Container {
  declare public body: Phaser.Physics.Arcade.Body;
  
  private coreGlow: Phaser.GameObjects.Graphics;
  private coreSprite: Phaser.GameObjects.Graphics;
  private forceField: Phaser.GameObjects.Graphics;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter;
  
  public attractionRadius: number = 220;
  public magneticPower: number = 100;
  public maxPower: number = 100;
  public speed: number = 600;
  public lives: number = 3;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private useMouse: boolean = true;
  private fieldPulseTimer: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCircle(24, -24, -24);
    this.body.setCollideWorldBounds(true);

    // 1. Force field ring (Attraction Radius Visualizer)
    this.forceField = scene.add.graphics();
    this.add(this.forceField);

    // 2. Core Glow graphics
    this.coreGlow = scene.add.graphics();
    this.add(this.coreGlow);

    // 3. Core Magnet ball graphics
    this.coreSprite = scene.add.graphics();
    this.add(this.coreSprite);

    // 4. Particle Trail setup
    const particleGraphic = scene.add.graphics();
    particleGraphic.fillStyle(0x00f0ff, 0.8);
    particleGraphic.fillCircle(4, 4, 4);
    particleGraphic.generateTexture('magnet_particle', 8, 8);
    particleGraphic.destroy();

    this.particles = scene.add.particles(0, 0, 'magnet_particle', {
      speed: { min: 20, max: 80 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 350,
      blendMode: 'ADD',
      frequency: 20
    });

    this.drawPlayerGraphics();
    this.setupInputs();
  }

  private drawPlayerGraphics(): void {
    // Draw Core Ball
    this.coreSprite.clear();
    // Outer metallic ring
    this.coreSprite.lineStyle(3, 0xffffff, 0.9);
    this.coreSprite.fillStyle(0x00f0ff, 1);
    this.coreSprite.fillCircle(0, 0, 24);
    this.coreSprite.strokeCircle(0, 0, 24);

    // Magnet N / S polarity visual indicators (Red & Blue halves)
    this.coreSprite.fillStyle(0xff0055, 1); // North Pole
    this.coreSprite.slice(0, 0, 20, Phaser.Math.DegToRad(180), Phaser.Math.DegToRad(360), false);
    this.coreSprite.fillPath();

    this.coreSprite.fillStyle(0x0088ff, 1); // South Pole
    this.coreSprite.slice(0, 0, 20, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(180), false);
    this.coreSprite.fillPath();

    // Center energy orb
    this.coreSprite.fillStyle(0xffffff, 0.95);
    this.coreSprite.fillCircle(0, 0, 8);
  }

  private setupInputs(): void {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
      };
    }
  }

  public update(time: number, delta: number): void {
    this.fieldPulseTimer += delta * 0.003;
    
    // Draw attraction force field pulse
    const pulseScale = 1 + Math.sin(this.fieldPulseTimer) * 0.05;
    const currentRadius = this.attractionRadius * pulseScale;

    this.forceField.clear();
    this.forceField.lineStyle(2, 0x00f0ff, 0.4 + Math.sin(this.fieldPulseTimer) * 0.2);
    this.forceField.strokeCircle(0, 0, currentRadius);
    this.forceField.fillStyle(0x00f0ff, 0.03 + Math.sin(this.fieldPulseTimer) * 0.015);
    this.forceField.fillCircle(0, 0, currentRadius);

    // Smooth movement towards Mouse/Touch pointer
    const pointer = this.scene.input.activePointer;
    if (pointer.isDown || this.useMouse) {
      const targetX = pointer.worldX;
      const targetY = pointer.worldY;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

      if (dist > 5) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        const moveSpeed = Math.min(this.speed, dist * 10);
        this.body.setVelocity(
          Math.cos(angle) * moveSpeed,
          Math.sin(angle) * moveSpeed
        );
      } else {
        this.body.setVelocity(0, 0);
      }
    }

    // Keyboard override check
    if (this.cursors || this.wasdKeys) {
      let vx = 0;
      let vy = 0;

      if (this.cursors?.left.isDown || this.wasdKeys?.A.isDown) vx -= 1;
      if (this.cursors?.right.isDown || this.wasdKeys?.D.isDown) vx += 1;
      if (this.cursors?.up.isDown || this.wasdKeys?.W.isDown) vy -= 1;
      if (this.cursors?.down.isDown || this.wasdKeys?.S.isDown) vy += 1;

      if (vx !== 0 || vy !== 0) {
        this.useMouse = false;
        const dir = new Phaser.Math.Vector2(vx, vy).normalize();
        this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
      }
    }

    // Update particle trail position
    this.particles.setPosition(this.x, this.y);

    // Rotate core slightly to give feeling of magnetic energy spinning
    this.coreSprite.rotation += 0.02;
  }
}
