import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sword, Heart, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Card({ card, onPlay, disabled }) {
  
  // Dynamic Art Selection
  const getCardArt = () => {
     if (card.name.toLowerCase().includes('fire')) return "./art_fire.png";
     if (card.name.toLowerCase().includes('berserk')) return "./art_berserk.png";
     if (card.type === 'defense') return "./art_defense.png";
     if (card.type === 'attack') return "./art_attack.png";
     return "./art_skill.png";
  };

  const getCardColor = () => {
    switch (card.type) {
      case 'attack': return 'from-red-600/40 via-red-950/80 to-black border-red-500/50 hover:border-red-400 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      case 'defense': return 'from-blue-600/40 via-blue-950/80 to-black border-blue-500/50 hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]';
      case 'skill': return 'from-purple-600/40 via-purple-950/80 to-black border-purple-500/50 hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]';
      default: return 'from-slate-600/40 via-slate-900/80 to-black border-slate-500/50';
    }
  };

  return (
    <motion.div 
      layoutId={card.id}
      whileHover={!disabled ? { y: -30, scale: 1.15, rotate: 1 } : {}}
      whileTap={!disabled ? { scale: 0.95, rotate: 0 } : {}}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative w-32 h-48 md:w-44 md:h-64 rounded-3xl border-2 cursor-pointer transition-all duration-500 flex flex-col overflow-hidden backdrop-blur-2xl group shadow-2xl",
        getCardColor(),
        disabled && "opacity-40 grayscale contrast-75 brightness-75 cursor-not-allowed border-slate-900"
      )}
      onClick={() => !disabled && onPlay(card)}
    >
      {/* Background Frame Shine */}
      <div className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
      
      {/* Cost Badge - Absolute Top Left */}
      <div className="absolute top-2 left-2 z-20 bg-slate-900 border-2 border-white/20 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black text-blue-400 drop-shadow-xl shadow-black ring-1 ring-blue-500/50 transition-transform group-hover:scale-110">
        {card.cost}
      </div>

      {/* Card Art Area */}
      <div className="relative w-full h-24 md:h-32 p-2 border-b-2 border-white/10 overflow-hidden bg-black/60 shadow-inner">
         <img 
           src={getCardArt()} 
           alt={card.name} 
           className="w-full h-full object-cover rounded-xl grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-80 group-hover:opacity-100" 
         />
         {/* Vignette on image */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Info Content */}
      <div className="flex-1 p-2 md:p-3 flex flex-col items-center justify-between">
        <div className="w-full">
           <h3 className="text-white font-black text-[9px] md:text-xs uppercase tracking-[0.2em] mb-1 line-clamp-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
             {card.name}
           </h3>
           <p className="text-[7px] md:text-[8px] text-slate-400 font-bold leading-tight line-clamp-2 md:line-clamp-3 italic group-hover:text-amber-200 transition-colors">
              {card.description}
           </p>
        </div>

        {/* Stats Footer */}
        <div className="w-full flex justify-center gap-3">
          {card.damage && (
            <div className="flex items-center text-red-500 font-black text-xs md:text-lg filter drop-shadow-[0_0_10px_rgba(239,68,68,1)]">
              <Sword size={14} className="md:w-5 md:h-5 mr-1" /> {card.damage}
            </div>
          )}
          {card.shield && (
            <div className="flex items-center text-blue-400 font-black text-xs md:text-lg filter drop-shadow-[0_0_10px_rgba(59,130,246,1)]">
              <Shield size={14} className="md:w-5 md:h-5 mr-1" /> {card.shield}
            </div>
          )}
          {card.heal && (
            <div className="flex items-center text-green-400 font-black text-xs md:text-lg filter drop-shadow-[0_0_10px_rgba(34,197,94,1)]">
              <Heart size={14} className="md:w-5 md:h-5 mr-1" /> {card.heal}
            </div>
          )}
        </div>
      </div>

      {/* Card Type Tag */}
      <div className="bg-black/60 text-[7px] md:text-[8px] py-1 text-center uppercase tracking-[0.4em] font-black text-slate-500 border-t border-white/5 group-hover:text-white group-hover:bg-black/90 transition-all">
        {card.type}
      </div>
      
      {/* Sparkle Hover Effect */}
      <div className="absolute -top-1 -right-1 opacity-10 group-hover:opacity-100 transition-all text-amber-200/40 -rotate-12 group-hover:rotate-0">
          <Sparkles size={20} className="animate-pulse" />
      </div>
    </motion.div>
  );
}
