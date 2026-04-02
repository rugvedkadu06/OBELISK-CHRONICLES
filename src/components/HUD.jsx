import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Shield, Zap, User, Trophy, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HUD() {
  const { playerHP, playerMaxHP, playerShield, playerEnergy, playerMaxEnergy, turn, round, timer, gameResult } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col p-4 md:p-6 overflow-hidden">
      
      {/* Top Banner: Round and Timer */}
      <div className="flex justify-between items-start w-full gap-4">
         
         {/* Player HUD - Top Left */}
         <motion.div 
           initial={{ x: -100, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           className="flex flex-col gap-3 pointer-events-auto scale-90 md:scale-100 origin-top-left"
         >
           {/* Avatar and Health Card */}
           <div className="bg-slate-900/80 border-2 border-slate-700/50 p-3 md:p-4 rounded-3xl shadow-2xl backdrop-blur-xl min-w-[240px] md:min-w-[280px] relative group overflow-hidden">
             <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="relative">
                   <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl border-2 border-blue-500 overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                      <img src="./hero_avatar.png" alt="Hero" className="w-full h-full object-cover grayscale-[0.2]" />
                   </div>
                   <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-md p-1 border border-blue-300">
                      <User size={10} className="text-white" />
                   </div>
                </div>
                
                <div className="flex-1">
                   <div className="text-[8px] md:text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none mb-1 text-xs">Commander</div>
                   <div className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">Silver Guard</div>
                </div>
             </div>

             {/* Health System */}
             <div className="space-y-1">
                <div className="flex justify-between items-end px-1">
                   <div className="flex items-center text-[10px] md:text-[11px] font-black text-green-500 uppercase tracking-tighter italic gap-1">
                     <Heart size={12} fill="currentColor" /> Vitality
                   </div>
                   <div className="text-white font-black text-base md:text-lg tabular-nums">
                     {playerHP}<span className="text-[8px] md:text-[10px] text-slate-500 font-medium"> / {playerMaxHP}</span>
                   </div>
                </div>
                <div className="h-3 md:h-4 bg-slate-800 rounded-full border border-slate-700 p-0.5 shadow-inner overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                     className="h-full rounded-full bg-gradient-to-r from-green-600 via-green-400 to-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                   />
                </div>
             </div>

             {/* Shield Indicator */}
             <AnimatePresence>
               {playerShield > 0 && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="mt-2 bg-blue-500/20 border border-blue-500/50 p-2 rounded-xl flex items-center justify-between"
                 >
                    <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-blue-300 uppercase tracking-widest">
                       <Shield size={12} fill="currentColor" /> Active Block
                    </div>
                    <div className="text-blue-400 font-black text-xs md:text-sm tabular-nums">+{playerShield}</div>
                 </motion.div>
               )}
             </AnimatePresence>

             {/* Energy Row inside Health Card */}
             <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center">
                <div className="flex gap-1.5">
                   {[...Array(playerMaxEnergy)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={i < playerEnergy ? { 
                          scale: [1, 1.1, 1],
                          boxShadow: ["0 0 0px #3b82f6", "0 0 10px #3b82f6", "0 0 0px #3b82f6"]
                        } : { scale: 0.9, opacity: 0.3 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center ${i < playerEnergy ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-slate-700'}`}
                      >
                         <Zap size={i < playerEnergy ? 12 : 10} fill={i < playerEnergy ? 'white' : 'transparent'} className={i < playerEnergy ? 'text-white' : 'text-slate-600'} />
                      </motion.div>
                   ))}
                </div>
                <div className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
                   Energy {playerEnergy}/{playerMaxEnergy}
                </div>
             </div>
           </div>
         </motion.div>

         {/* Center Top: Timer and Round Info */}
         <div className="flex flex-col items-center gap-2 mt-2 md:mt-0 flex-1 md:flex-none">
            <motion.div 
               initial={{ y: -50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="bg-slate-900/90 border border-slate-700/50 backdrop-blur-md px-4 md:px-6 py-2 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto"
            >
               <Trophy size={14} className="text-yellow-500" />
               <div className="flex flex-col items-center">
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest leading-none">Phase</span>
                  <span className="text-xs md:text-sm font-bold text-white uppercase tracking-tighter italic">Round {round}</span>
               </div>
            </motion.div>

            <AnimatePresence>
              {turn === 'player' && !gameResult && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 backdrop-blur-xl ${timer <= 3 ? 'bg-red-950/40 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse' : 'bg-slate-900/60 border-slate-700 text-amber-500'}`}
                >
                  <Timer size={14} className={timer <= 3 ? 'animate-bounce' : ''} />
                  <span className="font-black italic text-lg tabular-nums tracking-tighter">{timer}s</span>
                </motion.div>
              )}
            </AnimatePresence>
         </div>

         {/* Top Right: (Empty or Reserved for Enemy HUD info) */}
         <div className="hidden md:block w-[1px]" />
      </div>

    </div>
  );
}
