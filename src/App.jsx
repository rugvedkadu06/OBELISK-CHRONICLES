import React, { useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import EnemyHUD from './components/EnemyHUD';
import Hand from './components/Hand';
import Card from './components/Card';
import GalleryCard from './components/GalleryCard';
import { useGameStore, INITIAL_DECK } from './store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw, Skull, Play, Disc, BookOpen, LayoutGrid, X, ArrowLeft, Shield, Zap, Swords, ChevronRight, Activity, Flame, Sparkles } from 'lucide-react';

function App() {
  const { gameState, gameResult, startGame, finishLoading, setGameState } = useGameStore();

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-950 text-white select-none relative font-sans">
      
      {/* Cinematic Dynamic Background */}
      <div className="absolute inset-0 z-0">
         <motion.div 
           animate={{ scale: [1, 1.05, 1] }} 
           transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
           className="w-full h-full"
         >
            <img src="./battle_bg.png" alt="Atmospheric background" className="w-full h-full object-cover opacity-20 blur-[10px] scale-110" />
         </motion.div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* State: Legacy Main Menu - OBELISK: OMNICRON CHRONICLES */}
        {gameState === 'start' && (
          <motion.div 
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[100]"
          >
             {/* Character Peek - Hero (Left) */}
             <motion.div 
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 0.3 }}
               className="absolute left-0 bottom-0 h-[85vh] w-[45vw] pointer-events-none hidden lg:block"
             >
                <img src="./hero_avatar.png" alt="Hero" className="w-full h-full object-contain filter drop-shadow-[0_0_100px_rgba(37,99,235,0.2)] grayscale-[0.5]" />
             </motion.div>

             {/* Character Peek - Enemy (Right) */}
             <motion.div 
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 0.3 }}
               className="absolute right-0 bottom-0 h-[85vh] w-[45vw] pointer-events-none hidden lg:block"
             >
                <img src="./enemy_avatar.png" alt="Enemy" className="w-full h-full object-contain filter drop-shadow-[0_0_100px_rgba(239,68,68,0.2)] grayscale-[0.5]" />
             </motion.div>

             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="flex flex-col items-center gap-14 relative z-10 p-12 bg-transparent" // Box is now fully transparent
             >
                {/* Vintage Header */}
                <div className="flex flex-col items-center text-center">
                   <div className="flex items-center gap-10 text-amber-500/60 mb-6 drop-shadow-[0_0_20px_#f59e0b]">
                      <div className="h-0.5 w-32 bg-gradient-to-r from-transparent to-amber-500 opacity-60" />
                      <Flame size={32} fill="currentColor" className="animate-pulse" />
                      <div className="h-0.5 w-32 bg-gradient-to-l from-transparent to-amber-500 opacity-60" />
                   </div>
                   
                   <h1 className="font-['Cinzel'] text-7xl md:text-9xl font-black uppercase tracking-[-0.05em] text-white italic leading-tight">
                      OBELISK<br/>
                      <span className="text-amber-500 drop-shadow-[0_0_40px_rgba(245,158,11,1)]">CHRONICLES</span>
                   </h1>
                   <p className="font-['Cinzel'] text-amber-100/50 font-black tracking-[0.8em] uppercase text-[10px] mt-8 bg-black/40 px-6 py-2 border border-white/5 rounded-full inline-block">Omnicron Alpha Directive_v1.0</p>
                </div>

                {/* Vertical Transparent Menu */}
                <div className="flex flex-col gap-6 w-full max-w-xs items-stretch px-4">
                   <motion.button 
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={startGame}
                     className="group relative overflow-hidden h-20 rounded-xl flex items-center justify-center transition-all bg-black/20 hover:bg-black/60 shadow-2xl"
                   >
                     {/* Decorative Border */}
                     <div className="absolute inset-0 border-2 border-amber-600/30 rounded-xl group-hover:border-amber-400 transition-all duration-300" />
                     <div className="absolute -inset-1 border border-amber-500/10 rounded-xl animate-pulse" />
                     
                     <span className="font-['Cinzel'] text-3xl font-black uppercase tracking-[0.2em] text-amber-100 group-hover:text-white group-hover:drop-shadow-[0_0_15px_#fff] transition-all">Begin Fate</span>
                     
                     {/* Corner Decoration */}
                     <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 group-hover:scale-125 transition-transform" />
                     <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500 group-hover:scale-125 transition-transform" />
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500 group-hover:scale-125 transition-transform" />
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 group-hover:scale-125 transition-transform" />
                   </motion.button>
                   
                   <div className="flex flex-col gap-3">
                       <button 
                        onClick={() => setGameState('tutorial')}
                        className="group flex items-center justify-center gap-6 px-8 py-5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-amber-500 transition-all rounded-xl backdrop-blur-sm"
                       >
                         <BookOpen size={18} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                         <span className="font-['Cinzel'] text-lg font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-amber-100 italic transition-colors">The Tome</span>
                       </button>

                       <button 
                        onClick={() => setGameState('cardList')}
                        className="group flex items-center justify-center gap-6 px-8 py-5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-amber-500 transition-all rounded-xl backdrop-blur-sm"
                       >
                         <LayoutGrid size={18} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                         <span className="font-['Cinzel'] text-lg font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-amber-100 italic transition-colors">The Soul</span>
                       </button>
                   </div>
                </div>

                <div className="flex gap-6 opacity-40 mt-6">
                    <Sparkles size={20} className="animate-spin-slow text-amber-500" />
                    <div className="h-0.5 w-1 bg-slate-500 mt-2 rounded-full" />
                    <Sparkles size={20} className="animate-spin-slow rotate-180 text-amber-500" />
                </div>
             </motion.div>

             {/* Footer Note */}
             <div className="absolute bottom-12 font-['Cinzel'] font-black uppercase tracking-[0.5em] text-[10px] text-slate-600 italic">
                Anno Domini MMXXIV • OMNICRON PROTOCOL ACTIVATED
             </div>
          </motion.div>
        )}

        {/* State: Tutorial Page - The Tome */}
        {gameState === 'tutorial' && (
          <motion.div 
            key="tutorial-page"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(30px)' }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] bg-slate-950/80 flex flex-col items-center justify-center p-12 overflow-y-auto"
          >
             <button onClick={() => setGameState('start')} className="absolute top-10 left-10 flex items-center gap-3 text-amber-500/60 hover:text-amber-400 transition-all font-['Cinzel'] font-black uppercase tracking-widest text-sm bg-black/40 px-6 py-3 border border-amber-900/40 rounded">
                <ArrowLeft size={16} /> Return to Portal
             </button>

             <div className="max-w-4xl w-full p-16 bg-transparent border-y-4 border-amber-900/50 relative overflow-hidden">
                <div className="flex flex-col items-center gap-4 mb-20 px-4 text-center">
                   <h2 className="font-['Cinzel'] text-6xl md:text-8xl font-black uppercase tracking-tight text-white drop-shadow-2xl">The <span className="text-amber-600 italic">Omnicron</span></h2>
                   <div className="h-1 w-24 bg-amber-600 shadow-[0_0_15px_#d97706]" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 text-center md:text-left">
                   <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4 group">
                      <h3 className="font-['Cinzel'] font-black uppercase tracking-[0.3em] text-amber-500 text-xl mb-3">Core Directive: Energy</h3>
                      <p className="font-medium text-slate-300 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity text-lg">Harness the Obelisk's energy. Each phase restarts with 3 Essence points. Spend them to manifest fragments of power from your hand.</p>
                   </motion.div>
                   <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col gap-4 group">
                      <h3 className="font-['Cinzel'] font-black uppercase tracking-[0.3em] text-amber-500 text-xl mb-3">Core Directive: Conflict</h3>
                      <p className="font-medium text-slate-300 leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity text-lg">The Void Knight's intent is visible through the veil. Deflect with Block or pierce through his soul's defense to achieve victory.</p>
                   </motion.div>
                </div>

                <div className="mt-24 flex justify-center">
                   <button onClick={startGame} className="font-['Cinzel'] flex items-center gap-6 bg-amber-600 text-white font-black uppercase tracking-[0.5em] py-7 px-20 hover:bg-amber-500 transition-all active:scale-95 shadow-[0_0_60px_rgba(217,119,6,0.5)] border-b-4 border-amber-800 rounded-lg">
                      Enter the Chronos
                   </button>
                </div>
             </div>
          </motion.div>
        )}

        {gameState === 'cardList' && (
          <motion.div 
            key="card-gallery"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(40px)' }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] bg-slate-950/70 flex flex-col p-8 md:p-16 overflow-hidden"
          >
             <div className="flex justify-between items-center mb-24 relative px-8">
                <div className="flex flex-col gap-2">
                  <h2 className="font-['Cinzel'] text-7xl md:text-[9rem] font-black italic uppercase tracking-tighter text-white opacity-90">Soul <span className="text-amber-500">Echoes</span></h2>
                  <div className="text-amber-900 font-['Cinzel'] font-bold tracking-[0.8em] uppercase text-xs">OMNICRON_REGISTRY</div>
                </div>
                <button onClick={() => setGameState('start')} className="p-8 bg-slate-900 border-2 border-amber-900 rounded-full hover:bg-amber-600 transition-all shadow-2xl active:scale-90 group">
                   <X size={32} className="group-hover:rotate-90 transition-transform" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto px-8 scrollbar-hide">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-28 gap-x-16 justify-items-center pb-48">
                   {INITIAL_DECK.map((card, idx) => (
                      <motion.div key={card.id + idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="flex flex-col items-center gap-6 group">
                         <GalleryCard card={card} />
                         <div className="font-['Cinzel'] text-[12px] text-amber-500/40 font-black uppercase tracking-[0.4em] italic group-hover:text-amber-400 transition-colors">Fragment_{card.id}</div>
                      </motion.div>
                   ))}
                </div>
             </div>

             <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent pointer-events-none flex items-end justify-center pb-20">
                <div className="px-16 py-4 bg-transparent border border-amber-900/30 rounded-full font-['Cinzel'] text-[12px] font-black uppercase tracking-[0.5em] text-amber-700 backdrop-blur-3xl pointer-events-auto">
                   Active Records: {INITIAL_DECK.length} Fragments
                </div>
             </div>
          </motion.div>
        )}

        {/* State: Loading Screen */}
        {gameState === 'loading' && (
          <motion.div 
            key="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-black flex items-center justify-center overflow-hidden"
          >
             <video 
               src="./loading_video.mp4" 
               autoPlay 
               onEnded={finishLoading}
               className="absolute inset-0 w-full h-full object-cover"
             />
             <button onClick={finishLoading} className="absolute bottom-12 right-12 z-[210] p-4 bg-black/60 border border-amber-900/50 rounded-2xl group hover:bg-white/10 transition-all flex items-center gap-5 active:scale-95 px-8">
                <span className="font-['Cinzel'] text-[12px] text-amber-500/60 uppercase tracking-[0.6em] group-hover:text-amber-100 transition-colors font-black italic">Skip Synchrony {" >>"}</span>
                <ChevronRight size={18} className="text-amber-600/50 group-hover:text-amber-100" />
             </button>
          </motion.div>
        )}

        {/* State: Battle Scene */}
        {(gameState === 'battle' || gameState === 'gameover') && (
          <motion.div 
            key="battle-arena"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full relative"
          >
            <GameCanvas />
            <HUD />
            <EnemyHUD />
            <Hand />

            {/* Victory/Defeat Overlay */}
            <AnimatePresence>
              {gameState === 'gameover' && gameResult && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-slate-950/98 flex flex-col items-center justify-center z-[300] backdrop-blur-3xl p-8"
                >
                  <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="flex flex-col items-center text-center relative z-10 max-w-lg">
                    <div className={`mb-10 p-12 rounded-full border-4 ${gameResult === 'win' ? 'bg-amber-950/50 border-amber-500 text-amber-500 shadow-[0_0_60px_#d97706]' : 'bg-red-950/50 border-red-500 text-red-500 shadow-[0_0_60px_#dc2626]'}`}>
                       {gameResult === 'win' ? <Trophy size={100} fill="currentColor" /> : <Skull size={100} fill="currentColor" />}
                    </div>
                    <h1 className={`font-['Cinzel'] text-8xl md:text-9xl font-black mb-6 uppercase italic tracking-tighter drop-shadow-2xl ${gameResult === 'win' ? 'text-amber-500' : 'text-red-500'}`}>
                      {gameResult === 'win' ? 'Ascended' : 'Discarded'}
                    </h1>
                    <p className="font-['Cinzel'] text-slate-500 font-bold mb-20 uppercase tracking-[0.8em] text-[10px]">
                      {gameResult === 'win' ? 'The Omnicron Oracle Has spoken' : 'Return to the Obelisk Dust'}
                    </p>

                    <button 
                      onClick={() => setGameState('start')} 
                      className="group relative overflow-hidden px-24 py-8 bg-transparent text-white font-['Cinzel'] font-black text-3xl uppercase tracking-widest rounded-xl transition-all border border-amber-900 hover:border-amber-500 active:scale-95 hover:bg-amber-500/10"
                    >
                      <RefreshCcw size={32} className="group-hover:rotate-180 transition-transform duration-1000 mb-2 block mx-auto text-amber-500" />
                      Back to Gateway
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

export default App;
