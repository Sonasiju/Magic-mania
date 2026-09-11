import Phaser from 'phaser';

export class HumanPlayer extends Phaser.GameObjects.Container {
  declare public body: Phaser.Physics.Arcade.Body;

  private heroSprite: Phaser.GameObjects.Sprite;
  private forceFieldGraphics: Phaser.GameObjects.Graphics;
  private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  public attractionRadius: number = 240;
  public magneticPower: number = 100;
  public maxPower: number = 100;
  public speed: number = 380;
  public lives: number = 3;

  public stateMode: 'idle' | 'walking' | 'attracting' | 'damaged' | 'celebrating' = 'idle';

  private walkTimer: number = 0;
  private animFrameToggle: boolean = false;
  private damageTimer: number = 0;

  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private useMouseControl: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setCircle(20, -20, -20);
    this.body.setCollideWorldBounds(true);

    // Force Field Aura Visualizer
    this.forceFieldGraphics = scene.add.graphics();
    this.add(this.forceFieldGraphics);

    // Hero Character Sprite
    this.heroSprite = scene.add.sprite(0, 0, 'player_idle');
    this.add(this.heroSprite);

    // Magnetic Sparkles Emitter around Gauntlet
    const sparkG = scene.make.graphics({ x: 0, y: 0 }, false);
    sparkG.fillStyle(0x00f0ff, 1);
    sparkG.fillCircle(3, 3, 3);
    sparkG.generateTexture('spark_particle', 6, 6);
    sparkG.destroy();

    this.particleEmitter = scene.add.particles(0, 0, 'spark_particle', {
      speed: { min: 20, max: 90 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 300,
      frequency: 40,
      blendMode: 'ADD'
    });

    this.setupKeyboard();
  }

  private setupKeyboard(): void {
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

  public getGauntletWorldPos(): Phaser.Math.Vector2 {
    // Return tip position of magnetic glove
    const offset = new Phaser.Math.Vector2(16, 0).rotate(this.heroSprite.rotation);
    return new Phaser.Math.Vector2(this.x + offset.x, this.y + offset.y);
  }

  public triggerDamage(): void {
    this.stateMode = 'damaged';
    this.heroSprite.setTexture('player_damage');
    this.damageTimer = 400; // 400ms flash
  }

  public triggerCelebrate(): void {
    this.stateMode = 'celebrating';
    this.heroSprite.setTexture('player_celebrate');
    this.body.setVelocity(0, 0);
  }

  public update(time: number, delta: number): void {
    if (this.stateMode === 'celebrating') return;

    if (this.damageTimer > 0) {
      this.damageTimer -= delta;
      if (this.damageTimer <= 0) {
        this.stateMode = 'idle';
      } else {
        return;
      }
    }

    const pointer = this.scene.input.activePointer;
    let vx = 0;
    let vy = 0;

    // Keyboard Check
    if (this.cursors || this.wasdKeys) {
      if (this.cursors?.left.isDown || this.wasdKeys?.A.isDown) vx -= 1;
      if (this.cursors?.right.isDown || this.wasdKeys?.D.isDown) vx += 1;
      if (this.cursors?.up.isDown || this.wasdKeys?.W.isDown) vy -= 1;
      if (this.cursors?.down.isDown || this.wasdKeys?.S.isDown) vy += 1;
    }

    if (vx !== 0 || vy !== 0) {
      this.useMouseControl = false;
      const dir = new Phaser.Math.Vector2(vx, vy).normalize();
      this.body.setVelocity(dir.x * this.speed, dir.y * this.speed);
      
      // Face movement angle
      this.heroSprite.rotation = Phaser.Math.Angle.Between(0, 0, dir.x, dir.y);
      this.stateMode = 'walking';
    } else if (pointer.isDown || this.useMouseControl) {
      // Mouse/Touch Control
      const targetX = pointer.worldX;
      const targetY = pointer.worldY;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

      if (dist > 12) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        const moveSpeed = Math.min(this.speed, dist * 8);
        this.body.setVelocity(
          Math.cos(angle) * moveSpeed,
          Math.sin(angle) * moveSpeed
        );
        this.heroSprite.rotation = angle;
        this.stateMode = 'walking';
      } else {
        this.body.setVelocity(0, 0);
        this.heroSprite.rotation = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
        this.stateMode = 'idle';
      }
    } else {
      this.body.setVelocity(0, 0);
      this.stateMode = 'idle';
    }

    // Pose animation assignment
    const currentMode = this.stateMode as string;
    if (currentMode === 'walking') {
      this.walkTimer += delta;
      if (this.walkTimer > 180) {
        this.walkTimer = 0;
        this.animFrameToggle = !this.animFrameToggle;
        this.heroSprite.setTexture(this.animFrameToggle ? 'player_walk1' : 'player_walk2');
      }
    } else if (currentMode === 'attracting') {
      this.heroSprite.setTexture('player_attract');
    } else {
      this.heroSprite.setTexture('player_idle');
    }

    // Update Particle Emitter to Gauntlet Tip
    const gauntletPos = this.getGauntletWorldPos();
    this.particleEmitter.setPosition(gauntletPos.x, gauntletPos.y);

    // Draw Magnetic Field Aura Pulse
    this.forceFieldGraphics.clear();
    const pulse = 1 + Math.sin(time * 0.004) * 0.04;
    const currentRadius = this.attractionRadius * pulse;

    this.forceFieldGraphics.lineStyle(1.5, 0x00f0ff, 0.35 + Math.sin(time * 0.005) * 0.15);
    this.forceFieldGraphics.strokeCircle(0, 0, currentRadius);
    this.forceFieldGraphics.fillStyle(0x00f0ff, 0.02);
    this.forceFieldGraphics.fillCircle(0, 0, currentRadius);
  }
}
