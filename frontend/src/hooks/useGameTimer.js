import { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/sounds';
import { GAME_STATES } from '../game/gameConstants';

/**
 * Timer de question : décompte, sons d’avertissement / fin, reset au changement de palier.
 * Reste synchronisé avec gameState (actif seulement en PLAYING et si non en pause).
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
        soundManager.stopTimerTick();
      }
      return;
    }

    soundManager.startTimerTick();

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          soundManager.playTimerExpired();
          setGameState(GAME_STATES.TIMEOUT);
          return 0;
        }

        if (prev === 11) {
          soundManager.playTimerWarning();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      soundManager.stopTimerTick();
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
