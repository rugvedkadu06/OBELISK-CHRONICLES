import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Shield, Swords, Skull, Trophy, Swords as SwordsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnemyHUD() {
  const { enemyHP, enemyMaxHP, enemyShield, enemyIntent, turn, isAnimating, gameResult, endPlayerTurn } = useGameStore();

  const getIntentIcon = () => {
    if (!enemyIntent) return null;
    switch (enemyIntent.type) {
      case 'attack': return <Swords size={20} className="text-red-500 drop-shadow-[0_0_10px_#ef4444]" fill="currentColor" />;
      case 'defense': return <Shield size={20} className="text-blue-500 drop-shadow-[0_0_10px_#3b82f6]" fill="currentColor" />;
      case 'attack_defense': return (
        <div className="relative">
          <Swords size={16} className="text-red-500 absolute -left-1 -top-1" fill="currentColor" />
          <Shield size={16} className="text-blue-500 absolute -right-1 -bottom-1" fill="currentColor" />
        </div>
      );
      default: return null;
    }
  };

  return (
    <>
      {/* Top Right: Enemy Profile and HP */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col items-end gap-3 pointer-events-none z-50">
         <motion.div 
           initial={{ x: 100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="bg-slate-900/80 border-2 border-red-500/30 p-4 rounded-3xl shadow-2xl backdrop-blur-xl min-w-[280px] max-w-[90vw] pointer-events-auto group"
         >
            <div className="flex items-center gap-4 mb-4">
               <div className="relative">
                  <div className="w-16 h-16 rounded-2xl border-2 border-red-500 overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                     <img src="./enemy_avatar.png" alt="Enemy" className="w-full h-full object-cover transition-all group-hover:scale-110" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-md p-1 border border-red-300">
                     <Skull size={12} className="text-white" />
                  </div>
               </div>
               <div>
                  <div className="text-[10px] text-red-500 font-black uppercase tracking-widest leading-none mb-1">Elite Adversary</div>
                  <div className="text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">Void Knight</div>
               </div>
            </div>
            
            <div className="space-y-1">
               <div className="flex justify-between items-end px-1">
                  <div className="flex items-center text-[11px] font-black text-red-500 uppercase tracking-tighter italic gap-1">
                    <Heart size={12} fill="currentColor" /> Health Core
                  </div>
                  <div className="text-white font-black text-lg tabular-nums">
                     {enemyHP}<span className="text-[10px] text-slate-500 font-medium"> / {enemyMaxHP}</span>
                  </div>
               </div>
               <div className="h-4 bg-slate-800 rounded-full border border-slate-700 p-0.5 shadow-inner overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(enemyHP / enemyMaxHP) * 100}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-red-800 via-red-600 to-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  />
               </div>
            </div>

            <AnimatePresence>
              {enemyShield > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 bg-blue-500/20 border border-blue-500/50 p-2 rounded-xl flex items-center justify-between"
                >
                   <div className="flex items-center gap-2 text-[10px] font-black text-blue-300 uppercase tracking-widest">
                      <Shield size={14} fill="currentColor" /> Defense Matrix
                   </div>
                   <div className="text-blue-400 font-black text-sm tabular-nums">+{enemyShield}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {enemyIntent && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-3 border-t border-slate-700/50 flex flex-col gap-2"
                >
                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Next Sequence</div>
                    <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                       {getIntentIcon()}
                       <span className="text-[11px] font-black text-white uppercase tracking-tight">
                          {enemyIntent.type === 'attack' ? `Strike: ${enemyIntent.damage} DMG` : 
                           enemyIntent.type === 'defense' ? `Protect: ${enemyShield} BLK` : 
                           `Hybrid Action`}
                       </span>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
         </motion.div>
      </div>

         {/* Controls and Combat Log */}
         <div className="absolute bottom-40 right-4 md:right-10 flex flex-col items-end gap-4 pointer-events-none z-50">
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={endPlayerTurn}
              disabled={turn !== 'player' || isAnimating || gameResult}
              className={`group relative overflow-hidden px-8 md:px-12 py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-sm md:text-base transition-all shadow-black/80 shadow-2xl active:scale-95 border-2 flex items-center gap-3 pointer-events-auto ${turn === 'player' && !isAnimating ? 'bg-slate-900 border-red-500 text-white hover:bg-red-500/10 hover:border-red-400 hover:shadow-red-500/20' : 'bg-slate-800 border-slate-700 text-slate-500 opacity-50 cursor-not-allowed'}`}
            >
              <SwordsIcon size={20} className={turn === 'player' ? 'text-red-500 group-hover:text-white group-hover:rotate-12 transition-transform' : ''} />
              {turn === 'player' ? 'Finalize Turn' : 'Awaiting Opponent'}
              {turn === 'player' && !isAnimating && (
                <motion.div 
                  animate={{ left: ['-100%', '150%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
              )}
            </motion.button>
         </div>
    </>
  );
}
