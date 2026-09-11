import Phaser from 'phaser';
import { gameConfig } from './game/config/gameConfig';

window.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(gameConfig);
});
