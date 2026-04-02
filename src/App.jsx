import React, { useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import EnemyHUD from './components/EnemyHUD';
import Hand from './components/Hand';
import Card from './components/Card';
import GalleryCard from './components/GalleryCard';
import { useGameStore, INITIAL_DECK, LEGENDARY_CARD } from './store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw, Skull, Play, Disc, BookOpen, LayoutGrid, X, ArrowLeft, Shield, Zap, Swords, ChevronRight, Activity, Flame, Sparkles } from 'lucide-react';
import { playSFX } from './utils/soundManager';

function App() {
  const { gameState, gameResult, startGame, finishLoading, setGameState, difficulty, setDifficulty, tick, matchHistory } = useGameStore();

  useEffect(() => {
    let interval;
    if (gameState === 'battle') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, tick]);

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-950 text-white select-none relative font-sans">
      
      {/* Cinematic Dynamic Background */}
      <div className="absolute inset-0 z-0">
         <motion.div 
           animate={{ scale: [1, 1.05, 1] }} 
           transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
           className="w-full h-full"
         >
            {gameState === 'start' ? (
                <video 
                   src="/start_video.mp4" 
                   autoPlay 
                   loop 
                   muted 
                   playsInline 
                   className="w-full h-full object-cover opacity-100"
                />
            ) : (
                <img src="/battle_bg.png" alt="Atmospheric background" className="w-full h-full object-cover opacity-20 blur-[10px] scale-110" />
            )}
         </motion.div>
         <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* State: Main Menu */}
        {gameState === 'start' && (
          <motion.div 
            key="start-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-[100]"
          >
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="flex flex-col items-center gap-6 relative z-10 p-6 md:p-12 bg-transparent w-full max-w-4xl" 
             >
                <div className="flex flex-col items-center text-center">
                   <div className="flex items-center gap-10 text-amber-500/60 mb-6 drop-shadow-[0_0_20px_#f59e0b]">
                      <div className="h-0.5 w-16 md:w-32 bg-gradient-to-r from-transparent to-amber-500 opacity-60" />
                      <Flame size={32} fill="currentColor" className="animate-pulse" />
                      <div className="h-0.5 w-16 md:w-32 bg-gradient-to-l from-transparent to-amber-500 opacity-60" />
                   </div>
                   
                   <h1 className="font-['Cinzel'] text-5xl md:text-9xl font-black uppercase tracking-[-0.05em] text-white italic leading-tight">
                      OBELISK<br/>
                      <span className="text-amber-500 drop-shadow-[0_0_40px_rgba(245,158,11,1)]">CHRONICLES</span>
                   </h1>
                   <p className="font-['Cinzel'] text-amber-100/50 font-black tracking-[0.4em] md:tracking-[0.8em] uppercase text-[8px] md:text-[10px] mt-4 md:mt-8 bg-black/40 px-6 py-2 border border-white/5 rounded-full inline-block">Omnicron Alpha Directive_v1.0</p>
                </div>

             <div className="flex flex-col gap-4 w-full max-w-md items-center mt-4">
                  <div className="flex flex-col items-center mb-2">
                    <div className="flex items-center gap-2 text-amber-500 font-['Cinzel'] text-xs font-black uppercase tracking-widest bg-amber-950/20 px-4 py-1 rounded-full border border-amber-500/20">
                      <Trophy size={14} />
                      <span>{matchHistory.filter(m => m.result === 'win').length} Victories</span>
                    </div>
                    {matchHistory.filter(m => m.result === 'win').length >= 5 && (
                      <div className="text-[10px] text-amber-200/50 mt-1 uppercase tracking-[0.2em] font-black italic">Legendary Soul Unlocked</div>
                    )}
                  </div>

                  <div className="flex gap-2 w-full">
                    {['easy', 'medium', 'pro'].map((level) => (
                      <button
                        key={level}
                        onClick={() => { playSFX('click'); setDifficulty(level); }}
                        className={`flex-1 py-3 rounded-lg font-['Cinzel'] font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
                          difficulty === level 
                            ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(217,119,6,0.5)]' 
                            : 'bg-black/40 border-white/10 text-slate-500 hover:border-amber-900'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                   <motion.button 
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => startGame(difficulty)}
                     className="group relative overflow-hidden h-16 md:h-20 w-full rounded-xl flex items-center justify-center transition-all bg-black/20 hover:bg-black/60 shadow-2xl"
                   >
                     <div className="absolute inset-0 border-2 border-amber-600/30 rounded-xl group-hover:border-amber-400 transition-all duration-300" />
                     <div className="absolute -inset-1 border border-amber-500/10 rounded-xl animate-pulse" />
                     <span className="font-['Cinzel'] text-xl md:text-3xl font-black uppercase tracking-[0.2em] text-amber-100 group-hover:text-white group-hover:drop-shadow-[0_0_15px_#fff] transition-all">Begin Fate</span>
                   </motion.button>
                   
                   <div className="grid grid-cols-3 gap-4 w-full">
                       <button onClick={() => { playSFX('click'); setGameState('tutorial'); }} className="group flex flex-col items-center justify-center gap-2 py-4 bg-transparent hover:bg-white/5 border border-white/10 hover:border-amber-500 transition-all rounded-xl backdrop-blur-sm">
                         <BookOpen size={16} className="group-hover:text-amber-500" />
                         <span className="font-['Cinzel'] text-[8px] font-black uppercase tracking-[0.1em] text-slate-400 group-hover:text-amber-100 text-center">Tome</span>
                       </button>
                       <button onClick={() => { playSFX('click'); setGameState('cardList'); }} className="group flex flex-col items-center justify-center gap-2 py-4 bg-transparent hover:bg-white/5 border border-white/10 hover:border-amber-500 transition-all rounded-xl backdrop-blur-sm">
                         <LayoutGrid size={16} className="group-hover:text-amber-500" />
                         <span className="font-['Cinzel'] text-[8px] font-black uppercase tracking-[0.1em] text-slate-400 group-hover:text-amber-100 text-center">Souls</span>
                       </button>
                       <button onClick={() => { playSFX('click'); setGameState('history'); }} className="group flex flex-col items-center justify-center gap-2 py-4 bg-transparent hover:bg-white/5 border border-white/10 hover:border-amber-500 transition-all rounded-xl backdrop-blur-sm">
                         <Activity size={16} className="group-hover:text-amber-500" />
                         <span className="font-['Cinzel'] text-[8px] font-black uppercase tracking-[0.1em] text-slate-400 group-hover:text-amber-100 text-center">Chronos</span>
                       </button>
                   </div>
                </div>
             </motion.div>
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
               src="/loading_video.mp4" 
               autoPlay 
               muted
               playsInline
               onEnded={finishLoading}
               className="absolute inset-0 w-full h-full object-cover"
             />
             <button onClick={finishLoading} className="absolute bottom-12 right-12 z-[210] p-4 bg-black/60 border border-amber-900/50 rounded-2xl group hover:bg-white/10 transition-all flex items-center gap-5 active:scale-95 px-8">
                <span className="font-['Cinzel'] text-[12px] text-amber-500/60 uppercase tracking-[0.6em] group-hover:text-amber-100 transition-colors font-black italic">Skip Sequence {" >>"}</span>
                <ChevronRight size={18} className="text-amber-600/50 group-hover:text-amber-100" />
             </button>
          </motion.div>
        )}

        {/* State: Tutorial Page */}
        {gameState === 'tutorial' && (
          <motion.div 
            key="tutorial-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] bg-slate-950/80 flex flex-col items-center justify-center p-6"
          >
             <button onClick={() => setGameState('start')} className="absolute top-6 left-6 text-amber-500/60 bg-black/40 px-4 py-2 border border-amber-900/40 rounded">
                <ArrowLeft size={16} /> <span className="hidden md:inline">Return</span>
             </button>
             <div className="max-w-4xl w-full p-8 bg-transparent border-y-4 border-amber-900/50">
                <h2 className="font-['Cinzel'] text-4xl md:text-8xl font-black uppercase text-center mb-12">The <span className="text-amber-600 italic">Omnicron</span></h2>
                <div className="grid md:grid-cols-2 gap-12 text-center md:text-left">
                   <div>
                      <h3 className="font-['Cinzel'] font-black uppercase tracking-[0.3em] text-amber-500 text-lg mb-3">Energy</h3>
                      <p className="text-slate-300 italic opacity-80">Phase restarts with 3 Essence points.</p>
                   </div>
                   <div>
                      <h3 className="font-['Cinzel'] font-black uppercase tracking-[0.3em] text-amber-500 text-lg mb-3">Conflict</h3>
                      <p className="text-slate-300 italic opacity-80">Observe the Void Knight's intent.</p>
                   </div>
                </div>
                <div className="mt-12 flex justify-center">
                   <button onClick={() => startGame(difficulty)} className="font-['Cinzel'] bg-amber-600 text-white font-black uppercase tracking-[0.3em] py-5 px-10 rounded-lg">Enter Chronos</button>
                </div>
             </div>
          </motion.div>
        )}

        {/* State: Card Gallery */}
        {gameState === 'cardList' && (
          <motion.div 
            key="card-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] bg-slate-950/70 flex flex-col p-6 overflow-hidden"
          >
             <div className="flex justify-between items-center mb-12 relative px-4">
                <h2 className="font-['Cinzel'] text-4xl md:text-9xl font-black italic uppercase text-white opacity-90">Soul <span className="text-amber-500">Echoes</span></h2>
                <button onClick={() => setGameState('start')} className="p-4 bg-slate-900 border-2 border-amber-900 rounded-full">
                   <X size={24} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto px-4 scrollbar-hide pb-20">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-12 justify-items-center">
                   {[...INITIAL_DECK, LEGENDARY_CARD].map((card, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-4">
                         <GalleryCard 
                            card={card} 
                            locked={card.id === 'legendary_void' && matchHistory.filter(m => m.result === 'win').length < 5} 
                         />
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        {/* State: History / Hall of Records */}
        {gameState === 'history' && (
          <motion.div 
            key="history-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[150] bg-slate-950/90 flex flex-col p-6 overflow-hidden backdrop-blur-md"
          >
             <div className="flex justify-between items-center mb-12 relative px-4">
                <h2 className="font-['Cinzel'] text-4xl md:text-8xl font-black italic uppercase text-white opacity-90">The <span className="text-amber-500">Chronos</span></h2>
                <button onClick={() => { playSFX('click'); setGameState('start'); }} className="p-4 bg-slate-900 border-2 border-amber-900 rounded-full text-amber-500">
                   <X size={24} />
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto px-4 scrollbar-hide pb-20 max-w-5xl mx-auto w-full">
                {matchHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500 italic opacity-50 font-['Cinzel'] tracking-widest">
                       No echoes found in the chronos...
                    </div>
                ) : (
                    <div className="space-y-4">
                       {matchHistory.map((record) => (
                          <motion.div 
                             key={record.id}
                             initial={{ x: -20, opacity: 0 }}
                             animate={{ x: 0, opacity: 1 }}
                             className={`flex items-center justify-between p-6 rounded-2xl border-l-4 bg-white/5 border-white/5 ${record.result === 'win' ? 'border-l-amber-500' : 'border-l-red-500'}`}
                          >
                             <div className="flex items-center gap-6">
                                <div className={`p-4 rounded-full ${record.result === 'win' ? 'bg-amber-950/30 text-amber-500' : 'bg-red-950/30 text-red-500'}`}>
                                   {record.result === 'win' ? <Trophy size={24} /> : <Skull size={24} />}
                                </div>
                                <div>
                                   <div className={`font-['Cinzel'] font-black uppercase text-xl ${record.result === 'win' ? 'text-amber-100' : 'text-red-100'}`}>
                                      {record.result === 'win' ? 'Ascended' : 'Discarded'}
                                   </div>
                                   <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                                      {record.timestamp} • {record.difficulty} Mode
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="font-['Cinzel'] text-amber-500 font-black text-2xl">{record.rounds}</div>
                                <div className="text-[8px] text-slate-600 uppercase tracking-widest">Rounds</div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                )}
             </div>
          </motion.div>
        )}
        {(gameState === 'battle' || gameState === 'gameover') && (
          <motion.div key="battle-arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
            <GameCanvas />
            <HUD />
            <EnemyHUD />
            <Hand />
            
            <AnimatePresence>
              {gameState === 'gameover' && gameResult && (
                <motion.div 
                   key="gameover-overlay"
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }} 
                   className="absolute inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
                >
                   {/* Cinematic Victory/Defeat Video - Full Opacity */}
                   <video 
                     key={gameResult}
                     src={gameResult === 'win' ? '/win_video.mp4' : '/lose_video.mp4'} 
                     autoPlay 
                     loop 
                     muted 
                     playsInline
                     className="absolute inset-0 w-full h-full object-cover z-0"
                   />
                   
                   {/* Centered UI content directly on top of video */}
                   <div className="relative z-10 flex flex-col items-center text-center px-6">
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`mb-8 p-12 rounded-full border-4 backdrop-blur-md ${gameResult === 'win' ? 'bg-amber-950/30 border-amber-500 text-amber-500 shadow-[0_0_80px_#d97706]' : 'bg-red-950/30 border-red-500 text-red-500 shadow-[0_0_80px_#dc2626]'}`}
                      >
                         {gameResult === 'win' ? <Trophy size={80} fill="currentColor" /> : <Skull size={80} fill="currentColor" />}
                      </motion.div>

                      <motion.h1 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`font-['Cinzel'] text-7xl md:text-[10rem] font-black mb-8 uppercase italic tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] ${gameResult === 'win' ? 'text-amber-500' : 'text-red-500'}`}
                      >
                         {gameResult === 'win' ? 'Ascended' : 'Discarded'}
                      </motion.h1>
                      
                      <motion.button 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onClick={() => setGameState('start')} 
                        className="group relative overflow-hidden px-16 md:px-24 py-6 md:py-8 bg-black/60 text-white font-['Cinzel'] font-black text-2xl md:text-3xl uppercase tracking-[0.4em] rounded-xl transition-all border border-amber-900 hover:border-amber-500 backdrop-blur-xl shadow-2xl"
                      >
                         <span className="relative z-10">Back to Gateway</span>
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </motion.button>
                   </div>
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
