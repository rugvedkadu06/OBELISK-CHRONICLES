// Global Sound Manager for RPG SFX
const sounds = {
  click: '/sfx/button_click.mp3',
  playCard: '/sfx/card_play.mp3',
  attack: '/sfx/sword_hit.mp3',
  shield: '/sfx/shield_block.mp3',
  heal: '/sfx/heal.mp3',
  win: '/sfx/victory.mp3',
  lose: '/sfx/defeat.mp3',
  turnStart: '/sfx/turn_start.mp3',
};

const audioCache = {};

export const playSFX = (soundName) => {
  const path = sounds[soundName];
  if (!path) return;

  // Simple pooling to allow overlapping sounds
  try {
    const audio = new Audio(path);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked: interaction required or file missing", e));
  } catch (err) {
    console.error("Audio error:", err);
  }
};
