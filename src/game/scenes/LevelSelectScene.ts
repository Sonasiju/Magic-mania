import Phaser from 'phaser';
import { StorageManager } from '../../storage/localStorage';
import { EnvironmentManager } from '../systems/EnvironmentManager';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectScene');
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const progress = StorageManager.loadProgress();

    // 1. Dark Futuristic Grid Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x05070e, 0x070913, 0x0a0d1d, 0x0f172a, 1);
    bg.fillRect(0, 0, width, height);

    // 2. Title
    this.add.text(width / 2, 45, 'SELECT MISSION LEVEL', {
      fontFamily: 'Orbitron',
      fontSize: '32px',
      color: '#00f0ff',
      stroke: '#05070e',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 82, 'REPLAY LEVELS TO EARN ALL 3 STARS ⭐', {
      fontFamily: 'Inter',
      fontSize: '14px',
      color: '#94a3b8'
    }).setOrigin(0.5);

    // 3. Render 20 Level Cards Grid (5 columns x 4 rows)
    const cols = 5;
    const rows = 4;
    const cardW = 190;
    const cardH = 110;
    const startX = (width - (cols * cardW + (cols - 1) * 20)) / 2 + cardW / 2;
    const startY = 160 + cardH / 2;

    for (let i = 1; i <= 20; i++) {
      const col = (i - 1) % cols;
      const row = Math.floor((i - 1) / cols);
      const cx = startX + col * (cardW + 20);
      const cy = startY + row * (cardH + 16);

      const isUnlocked = i <= progress.unlockedLevel;
      const starsEarned = progress.levelStars[i] || 0;
      const envInfo = EnvironmentManager.getEnvironmentInfo(i);

      // Card Background
      const cardG = this.add.graphics();
      cardG.fillStyle(isUnlocked ? 0x0f172a : 0x030712, 0.85);
      cardG.lineStyle(2, isUnlocked ? 0x00f0ff : 0x334155, isUnlocked ? 0.8 : 0.4);
      cardG.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);
      cardG.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);

      // Level Number
      this.add.text(cx - cardW / 2 + 14, cy - cardH / 2 + 12, `LEVEL ${i}`, {
        fontFamily: 'Orbitron',
        fontSize: '18px',
        color: isUnlocked ? '#00f0ff' : '#475569'
      });

      // Environment Title
      this.add.text(cx - cardW / 2 + 14, cy - cardH / 2 + 40, envInfo.themeName, {
        fontFamily: 'Inter',
        fontSize: '11px',
        color: isUnlocked ? '#e2e8f0' : '#334155'
      });

      // Star Display
      const starText = isUnlocked 
        ? `${'⭐'.repeat(starsEarned)}${'☆'.repeat(3 - starsEarned)} (${starsEarned}/3)`
        : '🔒 LOCKED';

      this.add.text(cx - cardW / 2 + 14, cy - cardH / 2 + 72, starText, {
        fontFamily: 'Inter',
        fontSize: '13px',
        color: isUnlocked ? '#ffb700' : '#ef4444'
      });

      // Interactive Click if Unlocked
      if (isUnlocked) {
        const hitArea = this.add.zone(cx, cy, cardW, cardH).setInteractive({ useHandCursor: true });
        
        hitArea.on('pointerover', () => {
          cardG.clear();
          cardG.fillStyle(0x00f0ff, 0.25);
          cardG.lineStyle(3, 0xffffff, 1);
          cardG.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);
          cardG.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);
        });

        hitArea.on('pointerout', () => {
          cardG.clear();
          cardG.fillStyle(0x0f172a, 0.85);
          cardG.lineStyle(2, 0x00f0ff, 0.8);
          cardG.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);
          cardG.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 10);
        });

        hitArea.on('pointerdown', () => {
          this.scene.start('GameScene', { levelId: i });
        });
      }
    }

    // 4. Back to Main Menu Button
    const backBtn = this.add.text(width / 2, height - 35, '◄ BACK TO MAIN MENU', {
      fontFamily: 'Orbitron',
      fontSize: '18px',
      color: '#ff0077'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}
