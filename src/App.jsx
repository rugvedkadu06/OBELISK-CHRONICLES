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
  const { 
    gameState, gameResult, startGame, finishLoading, setGameState, 
    difficulty, setDifficulty, tick, matchHistory,
    isTutorial, tutorialStep, nextTutorialStep, resetTutorial
  } = useGameStore();

  const [redirectTime, setRedirectTime] = React.useState(5);

  useEffect(() => {
    let interval;
    if (gameState === 'battle') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, tick]);

  // Handle Tutorial Redirection
  useEffect(() => {
    let timer;
    if (gameState === 'gameover' && isTutorial) {
      setRedirectTime(5);
      timer = setInterval(() => {
        setRedirectTime(prev => {
          if (prev <= 1) {
             clearInterval(timer);
             setGameState('start');
             resetTutorial();
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, isTutorial, setGameState, resetTutorial]);

  const TUTORIAL_MESSAGES = [
    { title: "The Hand of Fate", msg: "Welcome, Seer! These cards are your Souls. Each card requires 'Essence' points located on the left side of your HUD. Hover over them to see their power.", targetId: 'player-hand' },
    { title: "The Soul's Vessel", msg: "This is your HUD. It tracks your Vitality and your active Essence. Watch the blue energy orbs—they are the cost of your actions.", targetId: 'player-hud' },
    { title: "The Knight's Gaze", msg: "Look at the Void Knight above... that icon shows their next move! Brace for their attack or strike while they defend.", targetId: 'enemy-hud' },
    { title: "Ending the Vigil", msg: "Once you have expended your Essence or finished your strategy, finalize your turn here to let the cycle continue.", targetId: 'end-turn-button' },
    { title: "Mastery Awaits", msg: "While the Great Obelisk usually demands swift action, here you may linger. Reduce their HP to zero to end the conflict and ascend!", targetId: null }
  ];

  const HighlightMask = ({ targetId }) => {
    const [rect, setRect] = React.useState(null);

    useEffect(() => {
      if (!targetId) {
        setRect(null);
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        const update = () => {
          const r = el.getBoundingClientRect();
          setRect(r);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
      }
    }, [targetId]);

    if (!rect) return null;

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[350] pointer-events-none"
      >
        <svg className="w-full h-full">
          <defs>
            <mask id="tutorial-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect 
                x={rect.left - 10} 
                y={rect.top - 10} 
                width={rect.width + 20} 
                height={rect.height + 20} 
                rx="20" 
                fill="black" 
              />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(2, 6, 23, 0.85)" mask="url(#tutorial-mask)" />
          
          {/* Glowing Border around the target */}
          <motion.rect 
            x={rect.left - 12} 
            y={rect.top - 12} 
            width={rect.width + 24} 
            height={rect.height + 24} 
            rx="22" 
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.02, 1],
              strokeWidth: [2, 4, 2]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    );
  };

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
            className="absolute inset-0 z-[150] bg-slate-950/90 flex flex-col items-center justify-center p-4 md:p-10 backdrop-blur-xl overflow-hidden"
          >
             <button 
                onClick={() => { playSFX('click'); setGameState('start'); }} 
                className="absolute top-8 left-8 flex items-center gap-2 text-amber-500/60 hover:text-amber-400 transition-colors bg-white/5 px-6 py-3 border border-amber-900/40 rounded-xl group"
             >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-['Cinzel'] font-black uppercase tracking-widest text-xs">Return to Gateway</span>
             </button>

             <div className="max-w-6xl w-full h-full max-h-[85vh] flex flex-col relative">
                {/* Header */}
                <div className="text-center mb-8 relative">
                   <motion.div 
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-500/10 pointer-events-none"
                   >
                     <BookOpen size={200} />
                   </motion.div>
                   <h2 className="font-['Cinzel'] text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">The <span className="text-amber-500 italic">Omnicron</span> Scroll</h2>
                   <p className="font-['Cinzel'] text-[10px] text-amber-500/50 uppercase tracking-[0.5em] mt-2 font-black">Sacred Manuscripts of the Obelisk</p>
                </div>

                <div className="flex-1 grid md:grid-cols-4 gap-6 min-h-0 overflow-hidden">
                   {/* Rule Cards */}
                   <div className="md:col-span-1 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
                      {[
                        { title: 'The Flow', icon: RefreshCcw, desc: 'Combat Cycles' },
                        { title: 'The Souls', icon: LayoutGrid, desc: 'Card Mechanics' },
                        { title: 'The Void', icon: Skull, desc: 'Enemy Intent' },
                        { title: 'The Rite', icon: Sparkles, desc: 'Forbidden Power' }
                      ].map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-amber-500/50 transition-all cursor-default group"
                        >
                           <div className="flex items-center gap-3 mb-1">
                              <item.icon size={16} className="text-amber-500" />
                              <h4 className="font-['Cinzel'] font-black uppercase text-xs text-amber-100">{item.title}</h4>
                           </div>
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold group-hover:text-slate-300 transition-colors">{item.desc}</p>
                        </motion.div>
                      ))}
                   </div>

                   {/* Main Content Area */}
                   <div className="md:col-span-3 bg-black/40 border border-white/5 rounded-3xl p-6 md:p-10 overflow-y-auto scrollbar-hide relative shadow-inner">
                      <div className="space-y-12 pb-10">
                         
                         {/* Flow of Combat */}
                         <section>
                            <div className="flex items-center gap-4 mb-6">
                               <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-amber-500/30"></div>
                               <h3 className="font-['Cinzel'] text-xl font-black uppercase text-amber-500 tracking-widest">I. The Flow of Fate</h3>
                               <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-amber-500/30"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3 mb-3 text-amber-400">
                                     <Zap size={18} />
                                     <span className="font-['Cinzel'] font-black uppercase text-xs tracking-widest">Essence</span>
                                  </div>
                                  <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                                     Every turn, you recover <span className="text-white">Essence</span> (3 or 4 based on difficulty). Use it to invoke Souls from your hand.
                                  </p>
                                </div>
                                <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3 mb-3 text-amber-400">
                                     <Disc size={18} fill="currentColor" />
                                     <span className="font-['Cinzel'] font-black uppercase text-xs tracking-widest">Sequence</span>
                                  </div>
                                  <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                                     Take your time to strategize. There is no haste in the void until the real battle begins. Master your hand at your own pace.
                                  </p>
                                </div>
                                <div className="p-5 bg-slate-900/50 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-3 mb-3 text-amber-400">
                                     <Trophy size={18} />
                                     <span className="font-['Cinzel'] font-black uppercase text-xs tracking-widest">Victory</span>
                                  </div>
                                  <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                                     Reduce the <span className="text-white">Void Knight's HP</span> to zero to ascend. Your health does not replenish between rounds.
                                  </p>
                                </div>
                            </div>
                         </section>

                         {/* The Souls */}
                         <section>
                            <div className="flex items-center gap-4 mb-6">
                               <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-amber-500/30"></div>
                               <h3 className="font-['Cinzel'] text-xl font-black uppercase text-amber-500 tracking-widest">II. The Echoing Souls</h3>
                               <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-amber-500/30"></div>
                            </div>
                            <div className="space-y-4">
                               <div className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors group">
                                  <div className="w-12 h-12 bg-red-950/30 border border-red-500/30 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                                     <Swords size={24} />
                                  </div>
                                  <div>
                                     <h4 className="font-['Cinzel'] font-black text-white text-sm uppercase mb-1">Assault Echoes (Attacks)</h4>
                                     <p className="text-slate-400 text-[13px] italic">Strikes that pierce the darkness. Damage first depletes the enemy's <span className="text-blue-400 font-bold">Shield</span>, then their health.</p>
                                  </div>
                               </div>
                               <div className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors group">
                                  <div className="w-12 h-12 bg-blue-980/30 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                                     <Shield size={24} />
                                  </div>
                                  <div>
                                     <h4 className="font-['Cinzel'] font-black text-white text-sm uppercase mb-1">Bastion Echoes (Defense)</h4>
                                     <p className="text-slate-400 text-[13px] italic">Creates a temporary <span className="text-blue-400 font-bold">Block</span>. Shields vanish at the start of the enemy's offensive. Strategy is paramount.</p>
                                  </div>
                               </div>
                               <div className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-colors group">
                                  <div className="w-12 h-12 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                                     <Sparkles size={24} />
                                  </div>
                                  <div>
                                     <h4 className="font-['Cinzel'] font-black text-white text-sm uppercase mb-1">Mystic Echoes (Skills)</h4>
                                     <p className="text-slate-400 text-[13px] italic">Complex rites that heal, draw more cards, or perform dangerous blood magic (Berserk).</p>
                                  </div>
                               </div>
                            </div>
                         </section>

                         {/* The Intent */}
                         <section>
                            <div className="flex items-center gap-4 mb-6">
                               <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-amber-500/30"></div>
                               <h3 className="font-['Cinzel'] text-xl font-black uppercase text-amber-500 tracking-widest">III. Gaze of the Knight</h3>
                               <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-amber-500/30"></div>
                            </div>
                            <div className="bg-slate-900/80 p-6 rounded-3xl border border-amber-900/20 relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500">
                                  <Skull size={120} />
                               </div>
                               <p className="text-slate-300 text-sm italic mb-6 leading-relaxed">
                                  The Void Knight's willpower manifests as icons. Read their intent to prepare your defense or press the attack.
                               </p>
                               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div className="flex flex-col items-center gap-2 p-4 bg-black/40 rounded-xl border border-white/5">
                                     <Swords size={20} className="text-red-500" />
                                     <span className="font-['Cinzel'] text-[10px] text-white uppercase font-black">Attack</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-2 p-4 bg-black/40 rounded-xl border border-white/5">
                                     <Shield size={20} className="text-blue-400" />
                                     <span className="font-['Cinzel'] text-[10px] text-white uppercase font-black">Defend</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-2 p-4 bg-black/40 rounded-xl border border-white/5">
                                     <Activity size={20} className="text-amber-500" />
                                     <span className="font-['Cinzel'] text-[10px] text-white uppercase font-black">Mixed</span>
                                  </div>
                                  <div className="flex flex-col items-center gap-2 p-4 bg-black/40 rounded-xl border border-white/5">
                                     <Trophy size={20} className="text-amber-500 animate-pulse" />
                                     <span className="font-['Cinzel'] text-[10px] text-white uppercase font-black">Lethal</span>
                                  </div>
                               </div>
                            </div>
                         </section>

                         {/* Forbidden Power */}
                         <section className="relative">
                            <div className="flex items-center gap-4 mb-6">
                               <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-purple-500/30"></div>
                               <h3 className="font-['Cinzel'] text-xl font-black uppercase text-purple-400 tracking-widest">IV. The Void Execution</h3>
                               <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-purple-500/30"></div>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-slate-900 to-purple-950/40 rounded-3xl border-2 border-purple-900/30 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                               <div className="flex flex-col md:flex-row items-center gap-8">
                                  <div className="w-24 h-32 bg-black/60 border-2 border-purple-500/50 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                                     <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                                     <Skull size={32} className="text-purple-500 mb-2 relative z-10" />
                                     <span className="font-['Cinzel'] text-[8px] text-purple-200 uppercase font-black tracking-tighter relative z-10">Void Card</span>
                                  </div>
                                  <div className="flex-1 text-center md:text-left">
                                     <h4 className="font-['Cinzel'] text-2xl font-black text-purple-200 uppercase mb-3">Unlocking the Ultimate Echo</h4>
                                     <p className="text-slate-300 text-sm italic mb-4 leading-relaxed">
                                        Survive <span className="text-purple-400 font-bold">5 Victorious Matches</span> to unlock the legendary card. This echo can ends any conflict instantly, but it demands <span className="text-white">3 Essence</span> and can only be invoked <span className="text-purple-400 font-bold">after Round 3</span>.
                                     </p>
                                  </div>
                               </div>
                            </div>
                         </section>

                      </div>

                      {/* Bottom Fade */}
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
                   </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startGame('tutorial')} 
                        className="group relative overflow-hidden px-16 py-6 border-2 border-amber-600 rounded-2xl bg-amber-950/20 shadow-[0_0_30px_rgba(217,119,6,0.1)] transition-all"
                      >
                         <span className="relative z-10 font-['Cinzel'] text-xl font-black uppercase text-amber-500 tracking-[0.4em]">Guided Training</span>
                      </motion.button>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startGame(difficulty)} 
                        className="group relative overflow-hidden px-16 py-6 bg-amber-600 rounded-2xl shadow-[0_10px_40px_rgba(217,119,6,0.3)] transition-all"
                      >
                         <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                         <span className="relative z-10 font-['Cinzel'] text-xl font-black uppercase text-white tracking-[0.4em]">Heed the Call</span>
                      </motion.button>
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

            {/* Tutorial HUD Overlay */}
            <AnimatePresence>
              {isTutorial && tutorialStep > 0 && tutorialStep <= TUTORIAL_MESSAGES.length && (
                <>
                  <HighlightMask targetId={TUTORIAL_MESSAGES[tutorialStep-1].targetId} />
                  <motion.div 
                    key={tutorialStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute left-1/2 -translate-x-1/2 z-[400] w-full max-w-lg ${
                      TUTORIAL_MESSAGES[tutorialStep-1].targetId === 'player-hand' || 
                      TUTORIAL_MESSAGES[tutorialStep-1].targetId === 'end-turn-button' 
                        ? 'top-[15%]' : 'bottom-[15%]'
                    }`}
                  >
                    <div className="bg-slate-900/95 border-2 border-amber-500/50 p-6 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] relative">
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]">?</div>
                        <h4 className="font-['Cinzel'] text-xl font-black text-amber-500 mb-2 uppercase tracking-widest leading-none pt-2">{TUTORIAL_MESSAGES[tutorialStep-1].title}</h4>
                        <div className="h-0.5 w-12 bg-amber-900/50 mb-4" />
                        <p className="text-slate-100 text-sm italic font-medium leading-relaxed mb-8">
                          {TUTORIAL_MESSAGES[tutorialStep-1].msg}
                        </p>
                        <button 
                          onClick={() => { playSFX('click'); nextTutorialStep(); }}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-['Cinzel'] font-black uppercase text-xs tracking-[0.4em] py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                        >
                          I Witness
                        </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
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
                         onClick={() => { playSFX('click'); setGameState('start'); resetTutorial(); }} 
                         className="group relative overflow-hidden px-16 md:px-24 py-6 md:py-8 bg-black/60 text-white font-['Cinzel'] font-black text-2xl md:text-3xl uppercase tracking-[0.4em] rounded-xl transition-all border border-amber-900 hover:border-amber-500 backdrop-blur-xl shadow-2xl"
                       >
                          <span className="relative z-10">Back to Gateway</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                       </motion.button>
                       
                       {isTutorial && (
                          <div className="mt-8 text-amber-500/50 font-['Cinzel'] text-xs uppercase tracking-[0.4em] animate-pulse">
                             Opening Gateway in {redirectTime}s...
                          </div>
                       )}
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
