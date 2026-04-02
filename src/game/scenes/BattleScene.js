import Phaser from 'phaser';
import { useGameStore } from '../../store/gameStore';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
    this.unsubscribe = null;
  }

  preload() {
    // Load generated assets from current directory (relative to index.html in dist)
    this.load.image('battle_bg', './battle_bg.png');
    this.load.image('hero_avatar', './hero_avatar.png');
    this.load.image('enemy_avatar', './enemy_avatar.png');
  }

  create() {
    const { width, height } = this.scale;

    // Create background image
    const bg = this.add.image(width / 2, height / 2, 'battle_bg');
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY);
    bg.setScale(scale).setAlpha(0.6).setScrollFactor(0);
    
    // Gradient overlay for matching ambiance
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x020617, 0x020617, 0x0f172a, 0x0f172a, 0.7);
    graphics.fillRect(0, 0, width, height);
    
    // Draw floor / stage
    graphics.fillStyle(0x1e293b, 0.5);
    const centerX = width / 2;
    const centerY = height / 2 + 150;
    graphics.fillEllipse(centerX, centerY, width * 0.9, 200);

    // Hero Character Sprite
    this.player = this.add.image(width * 0.25, height * 0.5 + 50, 'hero_avatar');
    this.player.setDisplaySize(200, 200);
    // Add a glow ring around player
    const playerRing = this.add.graphics();
    playerRing.lineStyle(4, 0x2563eb, 0.5);
    playerRing.strokeEllipse(this.player.x, this.player.y, 220, 220);

    // Enemy Character Sprite
    this.enemy = this.add.image(width * 0.75, height * 0.5 + 50, 'enemy_avatar');
    this.enemy.setDisplaySize(250, 250);
    // Add a glow ring around enemy
    const enemyRing = this.add.graphics();
    enemyRing.lineStyle(4, 0xef4444, 0.5);
    enemyRing.strokeEllipse(this.enemy.x, this.enemy.y, 270, 270);

    // Listen to Zustand store
    this.unsubscribe = useGameStore.subscribe((state, prevState) => {
       if (!this.sys || !this.sys.isActive()) return;

       if (state.eventQueue.length > prevState.eventQueue.length) {
          const newEvents = state.eventQueue.filter(
            e => !prevState.eventQueue.find(pe => pe.id === e.id)
          );
          newEvents.forEach(event => this.handleGameEvent(event));
       }
    });

    // Cleanup on scene shutdown
    this.events.once('shutdown', () => {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    });
  }
  
  handleGameEvent(event) {
     if (!this.sys || !this.sys.isActive() || !this.add) return;

     if (event.type === 'playCard') {
         const target = event.source === 'player' ? this.player : this.enemy;
         if (!target) return;

         // Attack animation
         this.tweens.add({
             targets: target,
             x: target.x + (event.source === 'player' ? 120 : -120),
             yoyo: true,
             duration: 150,
             ease: 'Power2',
             onComplete: () => {
                 if (this.sys && this.sys.isActive()) {
                    useGameStore.getState().consumeEvent(event.id);
                 }
             }
         });
     }
     
     if (event.type === 'damage') {
         const target = event.target === 'player' ? this.player : this.enemy;
         if (!target || !this.add) return;
         
         // Flash red
         target.setTint(0xff0000);
         this.time.delayedCall(300, () => {
             if (target && target.active) target.clearTint();
         });

         // Floating text
         const text = this.add.text(target.x, target.y - 150, `-${event.amount}`, {
             fontFamily: 'Outfit',
             fontSize: '64px',
             color: '#ff4444',
             stroke: '#000000',
             strokeThickness: 8
         }).setOrigin(0.5);

         this.tweens.add({
             targets: text,
             y: text.y - 120,
             alpha: 0,
             duration: 1200,
             ease: 'Back.out',
             onComplete: () => text.destroy()
         });
     }
     
     if (event.type === 'shield') {
         const target = event.target === 'player' ? this.player : this.enemy;
         if (!target || !this.add) return;

         // Flash blue
         target.setTint(0x3b82f6);
         this.time.delayedCall(300, () => {
             if (target && target.active) target.clearTint();
         });

         const text = this.add.text(target.x, target.y - 150, `+${event.amount}`, {
             fontFamily: 'Outfit',
             fontSize: '64px',
             color: '#60a5fa',
             stroke: '#000000',
             strokeThickness: 8
         }).setOrigin(0.5);

         this.tweens.add({
             targets: text,
             y: text.y - 120,
             alpha: 0,
             duration: 1200,
             ease: 'Back.out',
             onComplete: () => text.destroy()
         });
     }
  }

  destroy() {
      if (this.unsubscribe) {
          this.unsubscribe();
      }
      super.destroy();
  }
}
