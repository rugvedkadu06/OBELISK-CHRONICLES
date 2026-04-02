import Phaser from 'phaser';
import { useGameStore } from '../../store/gameStore';
import { playSFX } from '../../utils/soundManager';

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

    // Character Sprites - Positioning will be handled by updateSpritePositions
    this.player = this.add.image(0, 0, 'hero_avatar');
    this.enemy = this.add.image(0, 0, 'enemy_avatar');
    
    this.updateSpritePositions();

    // Listen to Zustand store
    this.unsubscribe = useGameStore.subscribe((state, prevState) => {
       if (!this.sys || !this.sys.isActive() || !this.scene) return;

       if (state.eventQueue.length > prevState.eventQueue.length) {
          const newEvents = state.eventQueue.filter(
            e => !prevState.eventQueue.find(pe => pe.id === e.id)
          );
          newEvents.forEach(event => this.handleGameEvent(event));
       }
    });

    this.scale.on('resize', () => {
        this.updateSpritePositions();
    });

    // Cleanup on scene shutdown
    this.events.on('shutdown', () => {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    });
  }

  updateSpritePositions() {
      const { width, height } = this.scale;
      const isMobile = width < 768;

      if (this.player && this.player.active) {
          this.player.setPosition(width * (isMobile ? 0.25 : 0.3), height * 0.45);
          this.player.setDisplaySize(isMobile ? 120 : 180, isMobile ? 120 : 180);
      }
      if (this.enemy && this.enemy.active) {
          this.enemy.setPosition(width * (isMobile ? 0.75 : 0.7), height * 0.45);
          this.enemy.setDisplaySize(isMobile ? 150 : 220, isMobile ? 150 : 220);
      }
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
         
         // ⚔️ Sword Animation
         playSFX('attack');
         const sword = this.add.text(target.x, target.y - 50, '⚔️', { fontSize: '80px' }).setOrigin(0.5);
         this.tweens.add({
             targets: sword,
             scale: { from: 0.5, to: 1.5 },
             alpha: { from: 1, to: 0 },
             duration: 600,
             onComplete: () => sword.destroy()
         });

         // Flash red
         target.setTint(0xff0000);
         this.time.delayedCall(300, () => {
             if (target && target.active) target.clearTint();
         });

         // Floating text
         const text = this.add.text(target.x, target.y - 120, `-${event.amount}`, {
             fontFamily: 'Outfit', fontSize: '48px', color: '#ff4444',
             stroke: '#000000', strokeThickness: 4
         }).setOrigin(0.5);

         this.tweens.add({
             targets: text, y: text.y - 100, alpha: 0, duration: 1000,
             ease: 'Back.out', onComplete: () => text.destroy()
         });
     }
     
     if (event.type === 'shield') {
         const target = event.target === 'player' ? this.player : this.enemy;
         if (!target || !this.add) return;

         // 🛡️ Shield Animation
         playSFX('shield');
         const shield = this.add.text(target.x, target.y - 50, '🛡️', { fontSize: '80px' }).setOrigin(0.5);
         this.tweens.add({
             targets: shield,
             scale: { from: 0.5, to: 1.5 },
             alpha: { from: 1, to: 0 },
             duration: 800,
             onComplete: () => shield.destroy()
         });

         // Flash blue
         target.setTint(0x3b82f6);
         this.time.delayedCall(300, () => {
             if (target && target.active) target.clearTint();
         });

         const text = this.add.text(target.x, target.y - 120, `+${event.amount}`, {
             fontFamily: 'Outfit', fontSize: '48px', color: '#60a5fa',
             stroke: '#000000', strokeThickness: 4
         }).setOrigin(0.5);

         this.tweens.add({
             targets: text, y: text.y - 100, alpha: 0, duration: 1000,
             ease: 'Back.out', onComplete: () => text.destroy()
         });
     }

     if (event.type === 'heal') {
        const target = event.target === 'player' ? this.player : this.enemy;
        if (!target || !this.add) return;

        // ❤️ Heal Animation
        playSFX('heal');
        const heart = this.add.text(target.x, target.y - 50, '❤️', { fontSize: '80px' }).setOrigin(0.5);
        this.tweens.add({
            targets: heart,
            y: heart.y - 100,
            scale: { from: 1, to: 2 },
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => heart.destroy()
        });

        // Flash green
        target.setTint(0x22c55e);
        this.time.delayedCall(300, () => {
            if (target && target.active) target.clearTint();
        });

        const text = this.add.text(target.x, target.y - 120, `+${event.amount}`, {
            fontFamily: 'Outfit', fontSize: '48px', color: '#22c55e',
            stroke: '#000000', strokeThickness: 4
         }).setOrigin(0.5);

        this.tweens.add({
            targets: text, y: text.y - 100, alpha: 0, duration: 1000,
            ease: 'Back.out', onComplete: () => text.destroy()
        });
     }
  }

  destroy() {
      if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
      }
      super.destroy();
  }
}
