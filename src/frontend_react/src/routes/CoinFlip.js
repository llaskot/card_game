import React, { useState, useEffect } from 'react';
import './CoinFlip.css';

const CoinFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null); // 'heads' or 'tails'
  const [playerGoesFirst, setPlayerGoesFirst] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log('CoinFlip component mounted');
    
    window.coinFlipComponent = {
      startCoinFlip: () => {
        console.log('CoinFlip.startCoinFlip called - starting continuous animation');
        setIsVisible(true);
        setIsFlipping(true);
        setShowResult(false);
        setResult(null);
        setPlayerGoesFirst(null);
      },
      
      showResult: (goesFirst) => {
        console.log('CoinFlip.showResult called with goesFirst:', goesFirst);
        setIsFlipping(false);
        setPlayerGoesFirst(goesFirst);
        setResult(goesFirst ? 'heads' : 'tails');
        setShowResult(true);
        
        setTimeout(() => {
          setIsVisible(false);
          setShowResult(false);
          setResult(null);
          setPlayerGoesFirst(null);
          console.log('Coin flip animation completed');
        }, 3000);
      }
    };

    return () => {
      if (window.coinFlipComponent) {
        delete window.coinFlipComponent;
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="coin-flip-overlay">
      <div className="coin-flip-container">
        <h2 className="coin-flip-title">
          {isFlipping ? 'Deciding who goes first...' : 'Result!'}
        </h2>

        <div className="coin-wrapper">
          <div 
            className={`coin ${isFlipping ? 'flipping' : ''} ${showResult ? (result === 'heads' ? 'show-heads' : 'show-tails') : ''}`}
          >
            <div className="coin-side heads">
              <div className="coin-face heads-face">
                <div className="crown">👑</div>
              </div>
            </div>
            <div className="coin-side tails">
              <div className="coin-face tails-face">
                <div className="tail-symbol">T</div>
              </div>
            </div>
          </div>
        </div>

        {showResult && (
          <div className="coin-flip-result">
            <h3 className="coin-result-text">
              {result === 'heads' ? '👑 HEADS!' : 'TAILS!'}
            </h3>
            <p className="coin-result-detail">
              {playerGoesFirst ? 'You go first!' : 'Opponent goes first!'}
            </p>
          </div>
        )}

        {isFlipping && (
          <div className="coin-flip-status">
            <p className="coin-flipping-text">Flipping...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinFlip;
