import React from 'react';
import { useGameStore } from '../store/gameStore';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hand() {
  const { hand, playCard, playerEnergy, turn, isAnimating, gameResult } = useGameStore();

  return (
    <div className="absolute -bottom-2 left-0 w-full px-4 overflow-hidden pointer-events-none z-50">
      <div className="flex justify-center items-end h-64 gap-1 md:gap-1.5">
        <AnimatePresence>
          {hand.map((card, i) => {
            // Calculate a nice hand curve - tighter for the new style
            const middle = (hand.length - 1) / 2;
            const offset = i - middle;
            const rotation = offset * 4;
            const translateY = Math.abs(offset) * 12;
            const translateX = offset * 12; // Even more compact to prevent overlap with enemy portrait
            
            return (
              <motion.div 
                key={card.id} 
                layout
                initial={{ y: 200, opacity: 0, scale: 0.8, rotate: rotation }}
                animate={{ 
                  y: translateY, 
                  x: translateX,
                  opacity: 1, 
                  scale: 1,
                  rotate: rotation,
                  transition: { delay: i * 0.05, type: 'spring', damping: 20, stiffness: 100 }
                }}
                exit={{ y: 300, opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                style={{ 
                  zIndex: i,
                }}
                className="pointer-events-auto origin-bottom"
              >
                <Card 
                  card={card} 
                  onPlay={playCard} 
                  disabled={turn !== 'player' || playerEnergy < card.cost || isAnimating || !!gameResult} 
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center mt-2 pointer-events-none opacity-80 font-black text-[8px] md:text-[10px] tracking-widest text-slate-400 uppercase px-4 md:px-6 py-2 rounded-full border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl mx-auto max-w-fit shadow-2xl">
         {hand.length} / 5 Cards
      </div>
    </div>
  );
}
