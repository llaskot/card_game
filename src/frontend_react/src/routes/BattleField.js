import React, { useState, useEffect, useRef  } from 'react';
import { ChevronLeft, ChevronRight, Heart, Zap } from 'lucide-react';
import './BattleField.css';
import CoinFlip from './CoinFlip';

export default function GameBoard() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(5000);
  const [enemyHealth, setEnemyHealth] = useState(5000);
  const [playerEnergy, setPlayerEnergy] = useState(1500);
  const [playerNickname, setPlayerNickname] = useState("Nickname");
  const [enemyNickname, setEnemyNickname] = useState("Nickname");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cardsInHand, setCardsInHand] = useState([]);
  // States for board cards
  const [cardsOnBoard, setCardsOnBoard] = useState([]);
  const [cardsOnBoardEnemy, setCardsOnBoardEnemy] = useState([]); 
  const [selectedCardOnBoardId, setSelectedCardOnBoardId] = useState(null);
  const [selectedCardOnBoardEnemyId, setSelectedCardOnBoardEnemyId] = useState(null);
  // State to track HP for cards on board
  const [cardBoardHP, setCardBoardHP] = useState({});
  const [cardBoardEnemyHP, setCardBoardEnemyHP] = useState({});

  // Music part
  const audioRef = useRef(null);

  // Play the audio
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(err => {
        console.error('Autoplay failed:', err);
      });
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Expose state setters globally so match_logic.js can use them
  useEffect(() => {
    window.gameStateSetters = {
      setPlayerEnergy,
      setPlayerHealth,
      setEnemyHealth,
      setPlayerNickname,
      setEnemyNickname,
      setCardsInHand,
      setCardsOnBoard,
      setCardsOnBoardEnemy,
      setCardBoardHP,
      setCardBoardEnemyHP,
      updateCardHP,
      updateCardEnemyHP,
      resetCardHP,
      resetCardEnemyHP,
      damageCard,
      damageCardEnemy,
      drawAvatarOnCanvas,
      playerCanvasRef,
      enemyCanvasRef,
    };

    // Cleanup on unmount
    return () => {
      delete window.gameStateSetters;
    };
  }, [
    setPlayerEnergy,
    setPlayerHealth,
    setEnemyHealth,
    setPlayerNickname,
    setEnemyNickname,
    setCardsInHand,
    setCardsOnBoard,
    setCardsOnBoardEnemy,
  ]);

  useEffect(() => {
    let script, script1;
    
    const loadScripts = () => {
        // Load first script
        script = document.createElement('script');
        script.src = "https://unpkg.com/colyseus.js@latest/dist/colyseus.js";
        script.async = false;
        
        script.onload = () => {
            // Only load second script after first one is loaded
            script1 = document.createElement('script');
            script1.src = '/static_js/match_logic.js';
            script1.async = false;
            document.body.appendChild(script1);
        };
        
        script.onerror = () => {
            console.error('Failed to load colyseus.js');
        };
        
        document.body.appendChild(script);
    };
    
    loadScripts();
    
    return () => {
        if (script && document.body.contains(script)) {
            document.body.removeChild(script);
        }
        if (script1 && document.body.contains(script1)) {
            document.body.removeChild(script1);
        }
    };
  }, [])
  

  const playerCanvasRef = useRef(null);
  const enemyCanvasRef = useRef(null);
  const cardCanvasRefs = useRef({});

  const maxHealth = 5000;

  const cardsData = [
    { id: 0, hp: 600, damage: 650, price: 700, name: 'spider-man' },
    { id: 1, hp: 550, damage: 700, price: 750, name: 'iron man' },
    { id: 2, hp: 700, damage: 600, price: 650, name: 'captain america' },
    { id: 3, hp: 700, damage: 750, price: 800, name: 'thor' },
    { id: 4, hp: 450, damage: 550, price: 500, name: 'black widow' },
    { id: 5, hp: 750, damage: 800, price: 800, name: 'hulk' },
    { id: 6, hp: 550, damage: 650, price: 700, name: 'doctor strange' },
    { id: 7, hp: 650, damage: 600, price: 650, name: 'black panther' },
    { id: 8, hp: 500, damage: 700, price: 750, name: 'scarlet witch' },
    { id: 9, hp: 750, damage: 650, price: 700, name: 'wolverine' },
    { id: 10, hp: 650, damage: 700, price: 750, name: 'captain marvel' },
    { id: 11, hp: 700, damage: 600, price: 650, name: 'deadpool' },
    { id: 12, hp: 550, damage: 600, price: 650, name: 'storm' },
    { id: 13, hp: 550, damage: 550, price: 600, name: 'loki' },
    { id: 14, hp: 650, damage: 600, price: 700, name: 'vision' },
    { id: 15, hp: 550, damage: 650, price: 600, name: 'moon knight' },
    { id: 16, hp: 550, damage: 700, price: 650, name: 'shang-chi' },
    { id: 17, hp: 600, damage: 650, price: 700, name: 'america chavez' },
    { id: 18, hp: 650, damage: 750, price: 750, name: 'ghost rider' },
    { id: 19, hp: 550, damage: 600, price: 650, name: 'gambit' }
  ];

  const cards = cardsData.map(card => ({
    ...card,
    image: `/images/cards/card-${card.id + 1}.png`,
    battleImage: `/images/cards/card-${card.id + 1}-for-battle.png`
  }));

  // HP Management Functions for Player Cards
  const updateCardHP = (cardId, newHP) => {
    setCardBoardHP(prev => ({
      ...prev,
      [cardId]: Math.max(0, newHP) // Ensure HP doesn't go below 0
    }));
  };

  const resetCardHP = (cardId) => {
    const originalCard = cards.find(card => card.id === cardId);
    if (originalCard) {
      setCardBoardHP(prev => ({
        ...prev,
        [cardId]: originalCard.hp
      }));
    }
  };

  const damageCard = (cardId, damageAmount) => {
    const currentHP = getCardCurrentHP(cardId);
    updateCardHP(cardId, currentHP - damageAmount);
  };

  const getCardCurrentHP = (cardId) => {
    if (cardBoardHP[cardId] !== undefined) {
      return cardBoardHP[cardId];
    }
    // If HP not set yet, return original HP
    const originalCard = cards.find(card => card.id === cardId);
    return originalCard ? originalCard.hp : 0;
  };

  // HP Management Functions for Enemy Cards
  const updateCardEnemyHP = (cardId, newHP) => {
    setCardBoardEnemyHP(prev => ({
      ...prev,
      [cardId]: Math.max(0, newHP) // Ensure HP doesn't go below 0
    }));
  };

  const resetCardEnemyHP = (cardId) => {
    const originalCard = cards.find(card => card.id === cardId);
    if (originalCard) {
      setCardBoardEnemyHP(prev => ({
        ...prev,
        [cardId]: originalCard.hp
      }));
    }
  };

  const damageCardEnemy = (cardId, damageAmount) => {
    const currentHP = getCardEnemyCurrentHP(cardId);
    updateCardEnemyHP(cardId, currentHP - damageAmount);
  };

  const getCardEnemyCurrentHP = (cardId) => {
    if (cardBoardEnemyHP[cardId] !== undefined) {
      return cardBoardEnemyHP[cardId];
    }
    // If HP not set yet, return original HP
    const originalCard = cards.find(card => card.id === cardId);
    return originalCard ? originalCard.hp : 0;
  };

  // Get cards that are currently in hand
  const handCards = cardsInHand.map(cardId => 
    cards.find(card => card.id === cardId)
  ).filter(Boolean);

  // Get cards that are currently on board
  const boardCards = cardsOnBoard.map(cardId => 
    cards.find(card => card.id === cardId)
  ).filter(Boolean);

  // Get cards that are currently on enemy board
  const boardCardsEnemy = cardsOnBoardEnemy.map(cardId => 
    cards.find(card => card.id === cardId)
  ).filter(Boolean);

  const cardsPerView = 4;
  const maxIndex = Math.max(0, handCards.length - cardsPerView);

  const nextCards = () => setCurrentCardIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevCards = () => setCurrentCardIndex((prev) => Math.max(prev - 1, 0));

  const visibleCards = handCards.slice(currentCardIndex, currentCardIndex + cardsPerView);
  
  // Canvas drawing functions
  async function drawAvatarOnCanvas(canvas, imageSrc) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const cw   = rect.width;
    const ch   = rect.height;
    const dpr  = window.devicePixelRatio || 1;

    // 1) Load full image
    const blob    = await fetch(imageSrc, { mode: 'cors' }).then(r => r.blob());
    const fullBmp = await createImageBitmap(blob);

    // 2) Compute cover-style crop rectangle
    const imgAR    = fullBmp.width / fullBmp.height;
    const canvasAR = cw / ch;
    let sx, sy, sw, sh;
    if (imgAR > canvasAR) {
      sh = fullBmp.height;
      sw = sh * canvasAR;
      sx = (fullBmp.width  - sw) * 0.5;
      sy = 0;
    } else {
      sw = fullBmp.width;
      sh = sw / canvasAR;
      sx = 0;
      sy = (fullBmp.height - sh) * 0.5;
    }
    const cropBmp = await createImageBitmap(fullBmp, sx, sy, sw, sh);

    // 3) Prepare your on-screen canvas at DPR-corrected resolution
    canvas.width  = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width  = `${cw}px`;
    canvas.style.height = `${ch}px`;
    ctx.scale(dpr, dpr);

    // 4) Clip to circle in CSS px coords
    ctx.clearRect(0, 0, cw, ch);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cw/2, ch/2, Math.min(cw, ch)/2, 0, 2*Math.PI);
    ctx.clip();

    // 5) Supersample: draw cropBmp into an OFFSCREEN canvas at 2×
    const SS = 2; // supersample factor
    const off = document.createElement('canvas');
    off.width  = cw * SS;
    off.height = ch * SS;
    const offCtx = off.getContext('2d');
    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = 'high';
    // drawCrop → offscreen at SS× size
    offCtx.drawImage(cropBmp,
      0, 0, sw, sh,
      0, 0, cw * SS, ch * SS
    );

    // 6) Draw the supersampled offscreen back down to your main canvas
    //    (Firefox now uses its nicer down-sampling filter)
    ctx.drawImage(off,
      0, 0, cw * SS, ch * SS,
      0, 0, cw,      ch
    );

    ctx.restore();
  }

  // Effect to draw avatars when component mounts
  useEffect(() => {
    drawAvatarOnCanvas(playerCanvasRef.current, '/images/avatar/profile-ironman.jpg');
    drawAvatarOnCanvas(enemyCanvasRef.current, '/images/avatar/profile-ironman.jpg');
  }, []);

  const drawCardOnCanvas = (canvas, imageSrc) => {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set high DPI scaling for better quality
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Set actual canvas size
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale the context to match device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Set canvas CSS size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
    };
    
    img.src = imageSrc;
  };

  // Effect to draw cards when visible cards change
  useEffect(() => {
    visibleCards.forEach(card => {
      const canvas = cardCanvasRefs.current[card.id];
      if (canvas) {
        drawCardOnCanvas(canvas, `/images/cards/card-${card.id}.png`);
      }
    });
  }, [visibleCards]);

  return (
    <div className="battlefield-container">
      <audio
        ref={audioRef}
        src="/audio/battle-song.mp3"
        loop
        autoPlay
        hidden
      />
      <div id="timer"><span>Wait</span></div>
      {/* Game Board with background */}
      <div 
        className="game-board"
        style={{
          backgroundImage: `url(/images/board/empty-board_4.png)`,
        }}
      >
        <CoinFlip />
        {/* End Turn Button */}
        <button className="end-turn-button">End Turn</button>
        {/* Player Avatar */}
        <canvas
          ref={playerCanvasRef}
          className="player-avatar avatar"
          width={120}
          height={120}
        />
        {/* Player Nickname */}
        <div className="player-nickname-bar bar-container" id='0'>
          <div className="bar-header">
            <span className="bar-value">{playerNickname}</span>
          </div>
        </div>

        {/* Player Health Bar */}
        <div className="player-health-bar bar-container">
          <div className="bar-header">
            <Heart className="heart-icon" />
            <span className="bar-value">{playerHealth}/{maxHealth}</span>
          </div>
          <div className="bar-background">
            <div 
              className="bar-fill health-fill" 
              style={{ width: `${(playerHealth / maxHealth) * 100}%` }}
            />
          </div>
        </div>
        {/* Player Energy Bar */}
        <div className="player-energy-bar bar-container">
          <div className="bar-header">
            <Zap className="energy-icon" />
            <span className="bar-value">{playerEnergy}</span>
          </div>
        </div>

        {/* Enemy Avatar */}
 
        <canvas
          ref={enemyCanvasRef}
          className="enemy-avatar avatar"
          width={140}
          height={140}
        />
        {/* Enemy Nickname */}
        <div className="enemy-nickname-bar bar-container">
          <div className="bar-header">
            <span className="bar-value">{enemyNickname}</span>
          </div>
        </div>
        {/* Enemy Health Bar */}
        <div className="enemy-health-bar bar-container">
          <div className="bar-header">
            <Heart className="heart-icon" />
            <span className="bar-value">{enemyHealth}/{maxHealth}</span>
          </div>
          <div className="bar-background">
            <div 
              className="bar-fill health-fill" 
              style={{ width: `${(enemyHealth / maxHealth) * 100}%` }}
            />
          </div>
        </div>

        {/* Cards inside the board at the bottom */}
        <div className="cards-container">
          {/* <ChevronLeft 
            onClick={prevCards}
            onMouseDown={e => e.preventDefault()}
            size={32}
            className="nav-arrow"
          /> */}
          
          {/* Cards Container with visual gap between pairs */}
          <div className="cards-wrapper">
            {/* First Pair */}
            <div className="card-pair">
              {visibleCards.slice(0, 2).map(card => (
                <div
                  key={card.id}
                  number={card.id}
                  className={`card ${selectedCardId === card.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCardId(card.id)}
                >
                  <img
                    draggable="false"
                    onDragStart={e => e.preventDefault()}
                    src={card.image}
                    srcSet={`${card.image} 1x, ${card.image} 2x`}
                    alt={card.name}
                    className="card-img-bg"
                  />
                </div>
              ))}
            </div>
            <div className="EatSpace" />

            {/* Second Pair */}
            <div className="card-pair">
              {visibleCards.slice(2, 4).map(card => (
                <div
                  key={card.id}
                  number={card.id}
                  className={`card ${selectedCardId === card.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCardId(card.id)}
                >
                  <img
                    draggable="false"
                    onDragStart={e => e.preventDefault()}
                    src={card.image}
                    srcSet={`${card.image} 1x, ${card.image} 2x`}
                    alt={card.name}
                    className="card-img-bg"
                  />
                </div>
              ))}
            </div>
          </div>


          {/* <ChevronRight 
            onClick={nextCards}
            onMouseDown={e => e.preventDefault()}
            size={32}
            className="nav-arrow"
          /> */}
        </div>


        {/* Player Cards on Board */}
        <div className="cards-onboard">
          <div className="cards-wrapper-onboard">
            <div className="EatSpace" />

            {/* First Pair */}
            <div className="card-pair">
              {boardCards.slice(0, 2).map(card => (
                <div
                  key={card.id}
                  number={card.id}
                  className={`card-onboard ${selectedCardOnBoardId === card.id ? 'selected' : ''}`}
                >
                  <img
                    draggable="false"
                    onDragStart={e => e.preventDefault()}
                    src={card.battleImage}
                    srcSet={`${card.battleImage} 1x, ${card.battleImage} 2x`}
                    alt={card.name}
                    className="card-img-bg"
                  />
                  <div className="card-hp-display">
                    <span className="hp-text">{getCardCurrentHP(card.id)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="EatSpaceMore" />

            {/* Second Pair */}
            <div className="card-pair">
              {boardCards.slice(2, 4).map(card => (
                <div
                  key={card.id}
                  number={card.id}
                  className={`card-onboard ${selectedCardOnBoardId === card.id ? 'selected' : ''}`}
                >
                  <img
                    draggable="false"
                    onDragStart={e => e.preventDefault()}
                    src={card.battleImage}
                    srcSet={`${card.battleImage} 1x, ${card.battleImage} 2x`}
                    alt={card.name}
                    className="card-img-bg"
                  />
                  <div className="card-hp-display">
                    <span className="hp-text">{getCardCurrentHP(card.id)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="EatSpace" />
          </div>
        </div>

        {/* Enemy Cards on Board */}
        <div className="cards-onboard-enemy">
          <div className="cards-wrapper-onboard-enemy">
            <div className="EatSpace" />

            {/* First Pair */}
            <div className="card-pair">
              {boardCardsEnemy.slice(0, 2).map(card => (
                <div
                  key={`enemy-${card.id}`}
                  number={card.id}
                  className={`card-onboard ${selectedCardOnBoardEnemyId === card.id ? 'selected' : ''}`}
                >
                  <img
                    draggable="false"
                    onDragStart={e => e.preventDefault()}
                    src={card.battleImage}
                    srcSet={`${card.battleImage} 1x, ${card.battleImage} 2x`}
                    alt={card.name}
                    className="card-img-bg"
                  />
                  <div className="card-hp-display">
                    <span className="hp-text">{getCardEnemyCurrentHP(card.id)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="EatSpaceMore" />

            {/* Second Pair */}
            <div className="card-pair">
              {boardCardsEnemy.slice(2, 4).map(card => (
                <div
                  key={`enemy-${card.id}`}
                  number={card.id}
                  className={`card-onboard ${selectedCardOnBoardEnemyId === card.id ? 'selected' : ''}`}
                >
                  <img
                    draggable="false"
                    onDragStart={e => e.preventDefault()}
                    src={card.battleImage}
                    srcSet={`${card.battleImage} 1x, ${card.battleImage} 2x`}
                    alt={card.name}
                    className="card-img-bg"
                  />
                  <div className="card-hp-display">
                    <span className="hp-text">{getCardEnemyCurrentHP(card.id)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="EatSpace" />
          </div>
          
        </div>

      </div>
    </div>
  );
}