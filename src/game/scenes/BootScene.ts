import Phaser from 'phaser';
import { ArtGenerator } from '../systems/ArtGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.text(width / 2, height / 2 - 40, 'MAGNET MANIA', {
      fontFamily: 'Orbitron',
      fontSize: '44px',
      color: '#00f0ff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, 'GENERATING REAL-WORLD ENVIRONMENTS & HERO GEAR...', {
      fontFamily: 'Inter',
      fontSize: '16px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // Generate human hero character, 10 environment themes, and realistic items
    ArtGenerator.generateAll(this);
  }

  create(): void {
    this.time.delayedCall(500, () => {
      this.scene.start('MainMenuScene');
    });
  }
}
