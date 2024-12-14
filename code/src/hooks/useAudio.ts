import { useState, useEffect, useRef } from 'react';

const useAudio = (
  url: string,
): [() => void, () => void, boolean, () => void] => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio element lazily
  useEffect(() => {
    audioRef.current = new Audio(url);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = ''; // Cleanup audio source
      }
    };
  }, [url]);

  const play = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play();
  };
  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.play();
    else audio.pause();

    return () => {
      audio.pause();
    };
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return [play, pause, isPlaying, togglePlay];
};

export default useAudio;
