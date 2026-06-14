import { useState, useRef, useCallback } from 'react';

export default function useAnimationControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [stepCount, setStepCount] = useState(0);
  const cancelRef = useRef(false);
  const pauseRef = useRef(false);

  const sleep = useCallback((ms) => {
    return new Promise((resolve) => {
      const adjustedMs = ms * (speed / 500);
      const interval = setInterval(() => {
        if (cancelRef.current) {
          clearInterval(interval);
          resolve('cancelled');
        }
        if (!pauseRef.current) {
          clearInterval(interval);
          setTimeout(resolve, adjustedMs);
        }
      }, 50);
    });
  }, [speed]);

  const start = useCallback(() => {
    cancelRef.current = false;
    pauseRef.current = false;
    setIsPlaying(true);
    setIsPaused(false);
    setStepCount(0);
  }, []);

  const pause = useCallback(() => {
    pauseRef.current = true;
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    pauseRef.current = false;
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    cancelRef.current = true;
    pauseRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const finish = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const incrementStep = useCallback(() => {
    setStepCount(prev => prev + 1);
  }, []);

  return {
    isPlaying, isPaused, speed, stepCount,
    setSpeed, sleep, start, pause, resume, stop, finish, incrementStep,
    cancelRef
  };
}
