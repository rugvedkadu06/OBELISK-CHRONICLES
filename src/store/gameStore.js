import { create } from 'zustand';

export const INITIAL_DECK = [
  // Attacks
  { id: '1', name: "Strike", type: "attack", cost: 1, damage: 10, description: "Deal 10 damage" },
  { id: '2', name: "Strike", type: "attack", cost: 1, damage: 10, description: "Deal 10 damage" },
  { id: '3', name: "Strike", type: "attack", cost: 1, damage: 10, description: "Deal 10 damage" },
  { id: '4', name: "Heavy Strike", type: "attack", cost: 2, damage: 22, description: "Deal 22 damage" },
  { id: '5', name: "Quick Slash", type: "attack", cost: 0, damage: 5, description: "Deal 5 damage" },
  
  // Defense
  { id: '6', name: "Defend", type: "defense", cost: 1, shield: 10, description: "Gain 10 Block" },
  { id: '7', name: "Defend", type: "defense", cost: 1, shield: 10, description: "Gain 10 Block" },
  { id: '8', name: "Steel Skin", type: "defense", cost: 2, shield: 20, description: "Gain 20 Block" },
  
  // Skills
  { id: '9', name: "Heal", type: "skill", cost: 2, heal: 15, description: "Heal 15 HP" },
  { id: '10', name: "Shield Bash", type: "skill", cost: 2, damage: 8, shield: 12, description: "Deal 8 damage and gain 12 Block" },
  { id: '11', name: "Berserk", type: "skill", cost: 1, damage: 15, selfDamage: 5, description: "Deal 15 damage, but take 5 damage" },
  { id: '12', name: "Draw Power", type: "skill", cost: 0, draw: 2, description: "Draw 2 cards" },
  { id: '13', name: "Fire Splash", type: "attack", cost: 2, damage: 18, description: "Deal 18 damage" },
];

export const useGameStore = create((set, get) => ({
  // Game State
  gameState: 'start', // 'start' | 'loading' | 'battle' | 'gameover' | 'tutorial' | 'cardList'
  
  // Player Stats
  playerHP: 100,
  playerMaxHP: 100,
  playerShield: 0,
  playerEnergy: 3,
  playerMaxEnergy: 3,
  
  // Enemy Stats
  enemyHP: 100,
  enemyMaxHP: 100,
  enemyShield: 0,
  enemyIntent: null,
  
  // Cards state
  deck: [],
  hand: [],
  discardPile: [],
  
  // Turn state
  turn: 'player', // 'player' | 'enemy' | 'gameover'
  round: 1,
  gameResult: null, // 'win' | 'lose' | null
  
  eventQueue: [], 
  isAnimating: false,

  setGameState: (state) => set({ gameState: state }),

  startGame: () => {
    set({ gameState: 'loading' });
  },

  finishLoading: () => {
    get().initGame();
    set({ gameState: 'battle' });
  },

  initGame: () => {
    const shuffledDeck = [...INITIAL_DECK].sort(() => Math.random() - 0.5);
    set({
      playerHP: 100, playerMaxHP: 100, playerShield: 0, playerEnergy: 3,
      enemyHP: 100, enemyMaxHP: 100, enemyShield: 0,
      deck: shuffledDeck.slice(5),
      hand: shuffledDeck.slice(0, 5),
      discardPile: [],
      gameState: 'battle',
      turn: 'player', round: 1, gameResult: null, eventQueue: [], isAnimating: false
    });
    get().setEnemyIntent();
  },

  setEnemyIntent: () => {
    const intents = [
      { type: 'attack', damage: 12 },
      { type: 'attack', damage: 18 },
      { type: 'defense', shield: 15 },
      { type: 'attack_defense', damage: 8, shield: 8 }
    ];
    const rand = Math.floor(Math.random() * intents.length);
    set({ enemyIntent: intents[rand] });
  },

  drawCards: (count) => {
    set((state) => {
      let newDeck = [...state.deck];
      let newHand = [...state.hand];
      let newDiscard = [...state.discardPile];

      for (let i = 0; i < count; i++) {
        if (newDeck.length === 0) {
          if (newDiscard.length === 0) break;
          newDeck = [...newDiscard].sort(() => Math.random() - 0.5);
          newDiscard = [];
        }
        if (newHand.length < 10) newHand.push(newDeck.pop());
      }

      return { deck: newDeck, hand: newHand, discardPile: newDiscard };
    });
  },

  playCard: (card) => {
    const state = get();
    if (state.turn !== 'player' || state.playerEnergy < card.cost || state.isAnimating || state.gameResult) return;

    set({ playerEnergy: state.playerEnergy - card.cost, isAnimating: true });
    set((state) => ({
      hand: state.hand.filter(c => c.id !== card.id),
      discardPile: [...state.discardPile, card]
    }));

    get().applyCardEffect(card, 'player');
    
    setTimeout(() => {
        if (get().enemyHP <= 0) {
            set({ gameResult: 'win', turn: 'gameover', gameState: 'gameover' });
        }
        set({ isAnimating: false });
        if (card.draw) get().drawCards(card.draw);
    }, 600);
  },

  applyCardEffect: (card, source) => {
    const isPlayer = source === 'player';
    set((state) => {
      let newState = { eventQueue: [...state.eventQueue, { id: Date.now(), type: 'playCard', card, source }] };

      if (card.damage) {
        if (isPlayer) {
           const damageToShield = Math.min(state.enemyShield, card.damage);
           const damageToHP = card.damage - damageToShield;
           newState.enemyShield = Math.max(0, state.enemyShield - damageToShield);
           newState.enemyHP = Math.max(0, state.enemyHP - damageToHP);
           newState.eventQueue.push({ id: Date.now() + 1, type: 'damage', target: 'enemy', amount: card.damage });
        } else {
           const damageToShield = Math.min(state.playerShield, card.damage);
           const damageToHP = card.damage - damageToShield;
           newState.playerShield = Math.max(0, state.playerShield - damageToShield);
           newState.playerHP = Math.max(0, state.playerHP - damageToHP);
           newState.eventQueue.push({ id: Date.now() + 1, type: 'damage', target: 'player', amount: card.damage });
        }
      }

      if (card.shield) {
        if (isPlayer) {
           newState.playerShield = state.playerShield + card.shield;
           newState.eventQueue.push({ id: Date.now() + 2, type: 'shield', target: 'player', amount: card.shield });
        } else {
           newState.enemyShield = state.enemyShield + card.shield;
           newState.eventQueue.push({ id: Date.now() + 2, type: 'shield', target: 'enemy', amount: card.shield });
        }
      }
      
      if (card.heal) {
        if (isPlayer) {
            newState.playerHP = Math.min(state.playerMaxHP, state.playerHP + card.heal);
            newState.eventQueue.push({ id: Date.now() + 3, type: 'heal', target: 'player', amount: card.heal });
        } else {
            newState.enemyHP = Math.min(state.enemyMaxHP, state.enemyHP + card.heal);
            newState.eventQueue.push({ id: Date.now() + 3, type: 'heal', target: 'enemy', amount: card.heal });
        }
      }
      
      if (card.selfDamage) {
          if (isPlayer) {
              const damageToShield = Math.min(state.playerShield, card.selfDamage);
              const damageToHP = card.selfDamage - damageToShield;
              newState.playerShield = Math.max(0, state.playerShield - damageToShield);
              newState.playerHP = Math.max(0, state.playerHP - damageToHP);
              newState.eventQueue.push({ id: Date.now() + 4, type: 'damage', target: 'player', amount: card.selfDamage });
          }
      }

      return newState;
    });
  },

  endPlayerTurn: () => {
    if (get().turn !== 'player' || get().isAnimating || get().gameResult) return;
    set({ turn: 'enemy', isAnimating: true, playerShield: 0 });
    setTimeout(() => {
        get().executeEnemyTurn();
    }, 1000);
  },

  executeEnemyTurn: () => {
     const state = get();
     if (state.gameResult) return;

     const intent = state.enemyIntent;
     get().applyCardEffect({ 
         name: intent.type === 'attack' ? "Aggressive Swipe" : 
               intent.type === 'defense' ? "Harden" : "Lunge and Parry",
         damage: intent.damage, 
         shield: intent.shield 
     }, 'enemy');
     
     setTimeout(() => {
         if (get().playerHP <= 0) {
             set({ gameResult: 'lose', turn: 'gameover', gameState: 'gameover' });
             return;
         }

         set({ turn: 'player', round: state.round + 1, playerEnergy: state.playerMaxEnergy, isAnimating: false });
         get().drawCards(3);
         get().setEnemyIntent();
     }, 1000);
  },

  consumeEvent: (eventId) => {
      set((state) => ({
          eventQueue: state.eventQueue.filter(e => e.id !== eventId)
      }));
  }
}));
