import React, { useEffect } from 'react';
import Phaser from 'phaser';
import BattleScene from '../game/scenes/BattleScene';

export default function GameCanvas() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      parent: 'phaser-container',
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true, // We will use a CSS background or phaser background
      scene: [BattleScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-container" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" />;
}
