import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Shield, Zap, User, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HUD() {
  const { playerHP, playerMaxHP, playerShield, playerEnergy, playerMaxEnergy, turn, round, isAnimating, gameResult } = useGameStore();

  // Hardcoded for now but in a real app these would be props or from store
  const heroAvatar = "/battle_background_1775105245115.png"; // Oh wait, I have the actual paths from generate tool.
  // Actually I need to use the actual filenames I generated.
  // Let's use the ones Gemini gave me:
  // epic_knight_avatar_1775105262040.png
  
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between p-4 md:p-6">
      
      {/* Top Center: Round Timer/Info */}
      <div className="flex justify-center w-full">
         <motion.div 
           initial={{ y: -50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-slate-900/90 border border-slate-700/50 backdrop-blur-md px-6 py-2 rounded-2xl flex items-center gap-3 shadow-2xl pointer-events-auto"
         >
            <Trophy size={16} className="text-yellow-500" />
            <div className="flex flex-col items-center">
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Phase</span>
               <span className="text-sm font-bold text-white uppercase tracking-tighter italic">Battle Round {round}</span>
            </div>
         </motion.div>
      </div>

      {/* Main Stats container - Bottom Left */}
      <div className="flex justify-between items-end w-full">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col gap-4 pointer-events-auto"
        >
          {/* Avatar and Health Card */}
          <div className="bg-slate-900/80 border-2 border-slate-700/50 p-4 rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-xl min-w-[280px] max-w-[90vw] overflow-hidden relative group">
            <div className="flex items-center gap-4 mb-4">
               <div className="relative">
                  {/* Avatar Frame */}
                  <div className="w-16 h-16 rounded-2xl border-2 border-blue-500 overflow-hidden shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                     <img src="./hero_avatar.png" alt="Hero" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-md p-1 border border-blue-300">
                     <User size={12} className="text-white" />
                  </div>
               </div>
               
               <div className="flex-1">
                  <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest leading-none mb-1">Commander</div>
                  <div className="text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">Silver Guard</div>
               </div>
            </div>

            {/* Health System */}
            <div className="space-y-1">
               <div className="flex justify-between items-end px-1">
                  <div className="flex items-center text-[11px] font-black text-green-500 uppercase tracking-tighter italic gap-1">
                    <Heart size={12} fill="currentColor" /> Vitality
                  </div>
                  <div className="text-white font-black text-lg tabular-nums">
                    {playerHP}<span className="text-[10px] text-slate-500 font-medium"> / {playerMaxHP}</span>
                  </div>
               </div>
               <div className="h-4 bg-slate-800 rounded-full border border-slate-700 p-0.5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-green-600 via-green-400 to-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  />
               </div>
            </div>

            {/* Shield Indicator overlaying health */}
            <AnimatePresence>
              {playerShield > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 bg-blue-500/20 border border-blue-500/50 p-2 rounded-xl flex items-center justify-between"
                >
                   <div className="flex items-center gap-2 text-[10px] font-black text-blue-300 uppercase tracking-widest">
                      <Shield size={14} fill="currentColor" /> Active Block
                   </div>
                   <div className="text-blue-400 font-black text-sm tabular-nums">+{playerShield}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Energy Core - Compact Bottom Left */}
          <div className="bg-slate-900/80 border-2 border-slate-700/50 p-4 rounded-3xl backdrop-blur-xl flex flex-col items-center gap-2 max-w-fit shadow-2xl">
             <div className="flex gap-2">
                {[...Array(playerMaxEnergy)].map((_, i) => (
                   <motion.div 
                    key={i}
                    animate={i < playerEnergy ? { 
                      scale: [1, 1.15, 1],
                      rotate: [0, 5, -5, 0],
                      boxShadow: ["0 0 0px #3b82f6", "0 0 20px #3b82f6", "0 0 0px #3b82f6"]
                    } : { scale: 0.9, opacity: 0.5 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${i < playerEnergy ? 'bg-blue-600 border-blue-300' : 'bg-slate-800 border-slate-700'}`}
                   >
                     <Zap size={18} fill={i < playerEnergy ? 'white' : 'transparent'} className={i < playerEnergy ? 'text-white' : 'text-slate-600'} />
                   </motion.div>
                ))}
             </div>
             <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] px-3 py-1 bg-black/40 rounded-full">
                Energy: {playerEnergy} / {playerMaxEnergy}
             </div>
          </div>
        </motion.div>

        {/* Empty space bottom right for End Turn or other controls */}
        <div className="w-1 md:w-32" />
      </div>

    </div>
  );
}
