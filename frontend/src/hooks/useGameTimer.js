import { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/sounds';
import { GAME_STATES } from '../game/gameConstants';

/**
 * Timer de question : décompte et son de fin (time up).
 */
export function useGameTimer({ gameState, setGameState, currentLevel }) {
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerPaused, setTimerPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!timerEnabled || gameState !== GAME_STATES.PLAYING || timerPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          soundManager.playTimeUp();
          setGameState(GAME_STATES.TIMEOUT);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerEnabled, gameState, timerPaused, currentLevel, setGameState]);

  useEffect(() => {
    if (timerEnabled) {
      setTimeRemaining(timerDuration);
    }
  }, [currentLevel, timerEnabled, timerDuration]);

  return {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeRemaining,
    setTimeRemaining,
    timerPaused,
    setTimerPaused,
  };
}
