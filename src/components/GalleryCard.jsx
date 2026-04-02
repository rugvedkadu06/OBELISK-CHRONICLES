import React from 'react';
import styled from 'styled-components';
import { Shield, Sword, Heart, Zap, Sparkles, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

const GalleryCard = ({ card, locked }) => {
  
  const getCardArt = () => {
     if (card.id === 'legendary_void') return "./legendary_void.png";
     if (card.name.toLowerCase().includes('fire')) return "./art_fire.png";
     if (card.name.toLowerCase().includes('berserk')) return "./art_berserk.png";
     if (card.type === 'defense') return "./art_defense.png";
     if (card.type === 'attack') return "./art_attack.png";
     return "./art_skill.png";
  };

  const getCardTheme = () => {
    if (card.rarity === 'legendary') {
        return { 
            primary: '#f59e0b', 
            gradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #fef3c7 70%, #d97706 100%)',
            isLegendary: true 
        };
    }
    switch (card.type) {
      case 'attack': return { primary: '#ef4444', gradient: 'linear-gradient(120deg, #991b1b 30%, #ef4444 88%, #f87171 40%, #dc2626 78%)' };
      case 'defense': return { primary: '#3b82f6', gradient: 'linear-gradient(120deg, #1e3a8a 30%, #3b82f6 88%, #60a5fa 40%, #2563eb 78%)' };
      case 'skill': return { primary: '#a855f7', gradient: 'linear-gradient(120deg, #581c87 30%, #a855f7 88%, #c084fc 40%, #9333ea 78%)' };
      default: return { primary: '#94a3b8', gradient: 'linear-gradient(120deg, #475569 30%, #94a3b8 88%, #cbd5e1 40%, #64748b 78%)' };
    }
  };

  const theme = getCardTheme();

  return (
    <StyledWrapper theme={theme} className={locked ? 'is-locked' : ''}>
      <div className="flip-card">
        <div className="flip-card-inner">
          
          {/* Front: Just Art */}
          <div className="flip-card-front">
             <div className="art-frame">
                <img src={getCardArt()} alt={card.name} className={locked ? 'grayscale' : ''} />
                <div className="cost-tag">{card.cost}</div>
                {locked && (
                    <div className="lock-overlay">
                        <Lock size={48} className="text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,1)]" />
                        <p className="lock-text">LOCKED</p>
                    </div>
                )}
             </div>
             <div className="name-ribbon">
                <p className="title">{card.name}</p>
                {card.rarity === 'legendary' && <p className="rarity">LEGENDARY</p>}
             </div>
          </div>
          
          {/* Back: Colorful Details */}
          <div className="flip-card-back">
             <div className="back-content">
                <Sparkles size={24} className="sparkle-icon" />
                <h3 className="back-title">{card.name}</h3>
                <div className="type-tag">{card.rarity ? card.rarity : card.type}</div>
                
                <div className="spacer" />
                
                {locked ? (
                    <div className="locked-info">
                        <p className="description text-center">Defeat the Void Knight 5 times to unlock the secrets of this ancient soul.</p>
                        <div className="lock-icon-small"><Lock size={20} /></div>
                    </div>
                ) : (
                    <>
                        <p className="description">{card.description}</p>
                        <div className="stats-row">
                           {card.damage && <div className="stat"><Sword size={18} /> {card.damage >= 999 ? '∞' : card.damage}</div>}
                           {card.shield && <div className="stat"><Shield size={18} /> {card.shield}</div>}
                           {card.heal && <div className="stat"><Heart size={18} /> {card.heal}</div>}
                        </div>

                        {card.draw && (
                           <div className="draw-bonus">
                              <Zap size={14} /> +{card.draw} DRAW POWER
                           </div>
                        )}
                    </>
                )}
             </div>
          </div>

        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  &.is-locked {
    filter: drop-shadow(0 0 10px rgba(0,0,0,0.5));
  }

  .flip-card {
    background-color: transparent;
    width: 220px;
    height: 300px;
    perspective: 1000px;
    font-family: 'Outfit', sans-serif;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    cursor: pointer;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front, .flip-card-back {
    box-shadow: 0 15px 35px 0 rgba(0,0,0,0.4);
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border: 3px solid ${props => props.theme.primary}${props => props.theme.isLegendary ? '' : '50'};
    border-radius: 1.5rem;
    overflow: hidden;
    backdrop-filter: blur(10px);
  }

  .flip-card-front {
    background: #020617;
    color: white;
    
    .art-frame {
       position: relative;
       flex: 1;
       overflow: hidden;
       
       img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s;
          &.grayscale {
             filter: grayscale(1) contrast(1.2) brightness(0.4);
          }
       }

       .lock-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.4);
          gap: 10px;

          .lock-text {
             font-family: 'Cinzel', serif;
             font-weight: 900;
             letter-spacing: 0.3em;
             font-size: 0.8em;
             color: white;
             text-shadow: 0 0 10px black;
          }
       }
       
       .cost-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 32px;
          height: 32px;
          background: #0f172a;
          border: 2px solid ${props => props.theme.primary};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
          box-shadow: 0 0 15px ${props => props.theme.primary}50;
          z-index: 10;
       }
    }
    
    .name-ribbon {
       padding: 12px;
       background: rgba(0,0,0,0.7);
       border-top: 1px solid rgba(255,255,255,0.1);
       
       .title {
          font-size: 0.95em;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'Cinzel', serif;
       }

       .rarity {
          font-size: 0.6em;
          letter-spacing: 0.4em;
          color: #f59e0b;
          margin-top: 2px;
          font-weight: 900;
       }
    }
  }

  .flip-card-back {
    background: ${props => props.theme.gradient};
    color: white;
    transform: rotateY(180deg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 3px solid white;

    .back-content {
       position: relative;
       display: flex;
       flex-direction: column;
       gap: 12px;
       align-items: center;
    }

    .sparkle-icon {
       position: absolute;
       top: -30px;
       right: -10px;
       opacity: 0.5;
    }

    .back-title {
       font-family: 'Cinzel', serif;
       font-size: 1.25em;
       font-weight: 900;
       text-transform: uppercase;
       letter-spacing: 0.05em;
       margin: 0;
       line-height: 1.1;
       text-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }

    .type-tag {
       font-size: 0.65em;
       font-weight: 900;
       text-transform: uppercase;
       background: rgba(0,0,0,0.4);
       padding: 4px 12px;
       border-radius: 99px;
       border: 1px solid rgba(255,255,255,0.2);
       letter-spacing: 0.2em;
    }

    .spacer {
       width: 40px;
       height: 3px;
       background: white;
       border-radius: 99px;
       box-shadow: 0 0 10px rgba(255,255,255,0.5);
    }

    .description {
       font-size: 0.85em;
       line-height: 1.5;
       font-weight: 600;
       opacity: 0.95;
       margin: 5px 0;
       text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    .locked-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        opacity: 0.8;
    }

    .stats-row {
       display: flex;
       gap: 15px;
       margin-top: 10px;
       
       .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
          font-size: 1.3em;
          text-shadow: 0 2px 5px rgba(0,0,0,0.3);
          
          svg {
             filter: drop-shadow(0 0 5px rgba(0,0,0,0.3));
          }
       }
    }

    .draw-bonus {
       margin-top: 10px;
       font-size: 0.65em;
       font-weight: 900;
       background: white;
       color: ${props => props.theme.primary};
       padding: 3px 10px;
       border-radius: 4px;
       display: flex;
       align-items: center;
       gap: 4px;
       text-transform: uppercase;
       box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
  }
`;

export default GalleryCard;
