import Phaser from 'phaser';
import { StorageManager } from '../../storage/localStorage';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const progress = StorageManager.loadProgress();

    // 1. Environmental Backdrop (City Street Theme)
    const bg = this.add.graphics();
    bg.fillStyle(0x0f172a, 1);
    bg.fillRect(0, 0, width, height);

    // Street Asphalt & Sidewalk Floor
    bg.fillStyle(0x1e293b, 1);
    bg.fillRect(0, 160, width, height - 160);
    bg.lineStyle(2, 0xeab308, 0.4);
    for (let x = 0; x < width; x += 100) {
      bg.lineBetween(x, height / 2, x + 50, height / 2);
    }

    // Floating magnetic energy particles
    this.add.particles(0, 0, 'spark_particle', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      speedX: { min: -20, max: 20 },
      speedY: { min: -30, max: -10 },
      scale: { start: 1.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 2500,
      frequency: 80,
      blendMode: 'ADD'
    });

    // 2. Character Preview Sprite
    const heroPreview = this.add.sprite(width / 2 - 260, height / 2 + 10, 'player_attract').setScale(2.2);
    this.tweens.add({
      targets: heroPreview,
      y: height / 2,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 3. Title Text
    this.add.text(width / 2 + 60, height / 2 - 140, 'MAGNET MANIA', {
      fontFamily: 'Orbitron',
      fontSize: '56px',
      color: '#ffffff',
      stroke: '#00f0ff',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(width / 2 + 60, height / 2 - 75, 'HUMAN HERO MAGNETIC ATTRACTION ARCADE', {
      fontFamily: 'Inter',
      fontSize: '15px',
      color: '#ff0077',
      letterSpacing: 2
    }).setOrigin(0.5);

    // 4. Play Button
    const playBtnBg = this.add.graphics();
    playBtnBg.fillStyle(0x00f0ff, 0.25);
    playBtnBg.lineStyle(2, 0x00f0ff, 1);
    playBtnBg.fillRoundedRect(width / 2 - 60, height / 2 - 10, 240, 54, 10);
    playBtnBg.strokeRoundedRect(width / 2 - 60, height / 2 - 10, 240, 54, 10);

    const playText = this.add.text(width / 2 + 60, height / 2 + 17, 'PLAY GAME', {
      fontFamily: 'Orbitron',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const playZone = this.add.zone(width / 2 + 60, height / 2 + 17, 240, 54).setInteractive({ useHandCursor: true });
    playZone.on('pointerdown', () => {
      this.scene.start('GameScene', { levelId: progress.unlockedLevel });
    });

    // 5. Level Select Button
    const levelBtnBg = this.add.graphics();
    levelBtnBg.fillStyle(0x0f172a, 0.8);
    levelBtnBg.lineStyle(2, 0xffb700, 1);
    levelBtnBg.fillRoundedRect(width / 2 - 60, height / 2 + 60, 240, 54, 10);
    levelBtnBg.strokeRoundedRect(width / 2 - 60, height / 2 + 60, 240, 54, 10);

    const levelText = this.add.text(width / 2 + 60, height / 2 + 87, 'SELECT LEVEL (20)', {
      fontFamily: 'Orbitron',
      fontSize: '18px',
      color: '#ffb700'
    }).setOrigin(0.5);

    const levelZone = this.add.zone(width / 2 + 60, height / 2 + 87, 240, 54).setInteractive({ useHandCursor: true });
    levelZone.on('pointerdown', () => {
      this.scene.start('LevelSelectScene');
    });

    // 6. Statistics Footer
    const totalStars = Object.values(progress.levelStars).reduce((acc, curr) => acc + curr, 0);
    this.add.text(width / 2, height - 50, `HIGH SCORE: ${progress.highScore}  |  TOTAL STARS: ⭐ ${totalStars}/60  |  UNLOCKED: LEVEL ${progress.unlockedLevel}/20`, {
      fontFamily: 'Inter',
      fontSize: '14px',
      color: '#94a3b8'
    }).setOrigin(0.5);
  }
}
