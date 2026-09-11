import Phaser from 'phaser';
import { EnvironmentManager, EnvironmentInfo } from './EnvironmentManager';

export class TrackEnvironmentManager {
  public static LANE_X: [number, number, number] = [340, 640, 940];
  public static TRACK_TOP_Y = 100;
  public static TRACK_BOTTOM_Y = 660;

  private scene: Phaser.Scene;
  private bgGraphics: Phaser.GameObjects.Graphics;
  private sidePropsGroup: Phaser.GameObjects.Group;
  private envInfo: EnvironmentInfo;
  private scrollOffset: number = 0;

  constructor(scene: Phaser.Scene, levelId: number) {
    this.scene = scene;
    this.envInfo = EnvironmentManager.getEnvironmentInfo(levelId);
    this.bgGraphics = scene.add.graphics();
    this.sidePropsGroup = scene.add.group();

    this.spawnInitialSideProps();
  }

  private spawnInitialSideProps(): void {
    const propKey = this.envInfo.propKeys[0] || 'obs_crate';
    for (let y = 140; y < 650; y += 160) {
      // Left side prop
      const leftProp = this.scene.add.sprite(140, y, propKey).setAlpha(0.7);
      // Right side prop
      const rightProp = this.scene.add.sprite(1140, y, propKey).setAlpha(0.7);
      this.sidePropsGroup.addMultiple([leftProp, rightProp]);
    }
  }

  public update(delta: number, speed: number): void {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    this.scrollOffset = (this.scrollOffset + speed * delta * 0.001 * 60) % 80;

    // Clear and redraw scrolling 3-Lane Track
    this.bgGraphics.clear();

    // 1. Background Ground
    this.bgGraphics.fillStyle(this.envInfo.floorColor, 1);
    this.bgGraphics.fillRect(0, 0, width, height);

    // 2. Track Base Area (x: 220 to 1060)
    this.bgGraphics.fillStyle(0x0f172a, 1);
    this.bgGraphics.fillRect(220, 0, 840, height);

    // 3. Lane Dividers (2 dashed yellow lines separating 3 lanes)
    this.bgGraphics.lineStyle(4, 0xeab308, 0.85);
    const laneDivider1X = 490;
    const laneDivider2X = 790;

    for (let y = -80 + this.scrollOffset; y < height + 80; y += 80) {
      this.bgGraphics.lineBetween(laneDivider1X, y, laneDivider1X, y + 45);
      this.bgGraphics.lineBetween(laneDivider2X, y, laneDivider2X, y + 45);
    }

    // 4. Outer Track Boundaries (Cyan Glowing Rails)
    this.bgGraphics.lineStyle(4, 0x00f0ff, 0.9);
    this.bgGraphics.lineBetween(220, 0, 220, height);
    this.bgGraphics.lineBetween(1060, 0, 1060, height);

    // 5. Side Wall Shadows & Props Scrolling
    this.bgGraphics.fillStyle(this.envInfo.wallColor, 1);
    this.bgGraphics.fillRect(0, 0, 220, height); // Left sidewalk
    this.bgGraphics.fillRect(1060, 0, 220, height); // Right sidewalk

    // Scroll Side Props downward
    this.sidePropsGroup.getChildren().forEach(child => {
      const prop = child as Phaser.GameObjects.Sprite;
      prop.y += speed * delta * 0.001 * 60;
      if (prop.y > height + 80) {
        prop.y = -80;
      }
    });
  }
}
