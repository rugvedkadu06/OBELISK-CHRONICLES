import React from 'react';
import { useGameStore } from '../store/gameStore';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hand() {
  const { hand, playCard, playerEnergy, turn, isAnimating, gameResult } = useGameStore();

  return (
    <div className="absolute bottom-4 left-0 w-full px-4 overflow-hidden pointer-events-none z-50">
      <div className="flex justify-center items-end h-64 gap-1 md:gap-2">
        <AnimatePresence>
          {hand.map((card, i) => {
            // Calculate a nice hand curve - tighter for the new style
            const middle = (hand.length - 1) / 2;
            const offset = i - middle;
            const rotation = offset * 4;
            const translateY = Math.abs(offset) * 10;
            const translateX = offset * 15; // Reduced from 20 to prevent overlap on small screens
            
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
      
      {/* Hand Counter Info */}
      <div className="flex justify-center mt-2 pointer-events-none opacity-50 font-black text-[10px] tracking-widest text-slate-500 uppercase px-4 py-1 rounded-full border border-slate-800 bg-slate-900 mx-auto max-w-fit">
         {hand.length} / 10 Cards
      </div>
    </div>
  );
}
