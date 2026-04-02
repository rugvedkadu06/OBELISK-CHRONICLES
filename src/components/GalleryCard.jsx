import React from 'react';
import styled from 'styled-components';
import { Shield, Sword, Heart, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

const GalleryCard = ({ card }) => {
  
  const getCardArt = () => {
     if (card.name.toLowerCase().includes('fire')) return "./art_fire.png";
     if (card.name.toLowerCase().includes('berserk')) return "./art_berserk.png";
     if (card.type === 'defense') return "./art_defense.png";
     if (card.type === 'attack') return "./art_attack.png";
     return "./art_skill.png";
  };

  const getCardTheme = () => {
    switch (card.type) {
      case 'attack': return { primary: '#ef4444', gradient: 'linear-gradient(120deg, #991b1b 30%, #ef4444 88%, #f87171 40%, #dc2626 78%)' };
      case 'defense': return { primary: '#3b82f6', gradient: 'linear-gradient(120deg, #1e3a8a 30%, #3b82f6 88%, #60a5fa 40%, #2563eb 78%)' };
      case 'skill': return { primary: '#a855f7', gradient: 'linear-gradient(120deg, #581c87 30%, #a855f7 88%, #c084fc 40%, #9333ea 78%)' };
      default: return { primary: '#94a3b8', gradient: 'linear-gradient(120deg, #475569 30%, #94a3b8 88%, #cbd5e1 40%, #64748b 78%)' };
    }
  };

  const theme = getCardTheme();

  return (
    <StyledWrapper theme={theme}>
      <div className="flip-card">
        <div className="flip-card-inner">
          
          {/* Front: Just Art */}
          <div className="flip-card-front">
             <div className="art-frame">
                <img src={getCardArt()} alt={card.name} />
                <div className="cost-tag">{card.cost}</div>
             </div>
             <div className="name-ribbon">
                <p className="title">{card.name}</p>
             </div>
          </div>
          
          {/* Back: Colorful Details */}
          <div className="flip-card-back">
             <div className="back-content">
                <Sparkles size={24} className="sparkle-icon" />
                <h3 className="back-title">{card.name}</h3>
                <div className="type-tag">{card.type}</div>
                
                <div className="spacer" />
                
                <p className="description">{card.description}</p>
                
                <div className="stats-row">
                   {card.damage && <div className="stat"><Sword size={18} /> {card.damage}</div>}
                   {card.shield && <div className="stat"><Shield size={18} /> {card.shield}</div>}
                   {card.heal && <div className="stat"><Heart size={18} /> {card.heal}</div>}
                </div>

                {card.draw && (
                   <div className="draw-bonus">
                      <Zap size={14} /> +{card.draw} DRAW POWER
                   </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
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
    border: 2px solid ${props => props.theme.primary}50;
    border-radius: 1.5rem;
    overflow: hidden;
    backdrop-blur: 10px;
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
          object-cover: cover;
          transition: transform 0.8s;
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
       }
    }
    
    .name-ribbon {
       padding: 12px;
       background: rgba(0,0,0,0.6);
       border-top: 1px solid rgba(255,255,255,0.1);
       
       .title {
          font-size: 1.1em;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
    border: 2px solid white;

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
       font-size: 1.4em;
       font-weight: 900;
       text-transform: uppercase;
       letter-spacing: 0.1em;
       margin: 0;
       line-height: 1.1;
       text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    .type-tag {
       font-size: 0.7em;
       font-weight: 800;
       text-transform: uppercase;
       background: rgba(0,0,0,0.3);
       padding: 4px 12px;
       border-radius: 99px;
       border: 1px solid rgba(255,255,255,0.2);
    }

    .spacer {
       width: 40px;
       height: 3px;
       background: white;
       border-radius: 99px;
       box-shadow: 0 0 10px rgba(255,255,255,0.5);
    }

    .description {
       font-size: 0.8em;
       line-height: 1.4;
       font-weight: 600;
       opacity: 0.9;
       font-style: italic;
       margin: 5px 0;
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
          font-size: 1.2em;
          text-shadow: 0 2px 5px rgba(0,0,0,0.2);
          
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
    }
  }
`;

export default GalleryCard;
