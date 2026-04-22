import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import appToast from "../utils/toast";

export const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const [music, setMusic] = useState(null);
  const [current, setCurrent] = useState(null);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const queueRef = useRef([]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  const addToQueue = useCallback((songId) => {
    if (!songId) return;

    if (queueRef.current.includes(songId)) {
      appToast.success("Already in queue");
      return;
    }

    const nextQueue = [...queueRef.current, songId];
    setQueue(nextQueue);
    queueRef.current = nextQueue;
    appToast.success("Added to queue");
  }, []);

  const isInQueue = useCallback((songId) => {
    if (!songId) return false;
    return queueRef.current.includes(songId);
  }, []);

  const playSong = useCallback((songId, options = {}) => {
    if (!songId) return;

    const { resetTime = true } = options;

    setMusic(songId);
    if (resetTime) {
      setCurrent(0);
    }
    localStorage.setItem("last-played", songId);
  }, []);

  const removeFromQueue = useCallback((songId) => {
    if (!songId) return;

    const nextQueue = queueRef.current.filter((id) => id !== songId);
    setQueue(nextQueue);
    queueRef.current = nextQueue;
    appToast.success("Removed from queue");
  }, []);

  const playNextInQueue = useCallback(() => {
    const currentQueue = queueRef.current;

    if (currentQueue.length === 0) {
      setPlaying(false);
      return null;
    }

    const nextSongId = currentQueue[0];
    const remainingQueue = currentQueue.slice(1);

    setQueue(remainingQueue);
    queueRef.current = remainingQueue;

    setMusic(nextSongId);
    setCurrent(0);
    setPlaying(true);
    localStorage.setItem("last-played", nextSongId);

    return nextSongId;
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    queueRef.current = [];
    appToast.success("Queue cleared");
  }, []);

  useEffect(() => {
    if (localStorage.getItem("last-played")) {
      setMusic(localStorage.getItem("last-played"));
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
        music,
        setMusic,
        current,
        setCurrent,
        duration,
        setDuration,
        playing,
        setPlaying,
        queue,
        setQueue,
        addToQueue,
        isInQueue,
        removeFromQueue,
        clearQueue,
        playSong,
        playNextInQueue,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
