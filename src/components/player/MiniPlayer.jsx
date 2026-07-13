import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPause, IoPlay, IoChevronForwardSharp, IoChevronBackSharp  } from "react-icons/io5";
import { X, ExternalLink } from "lucide-react";

export default function MiniPlayer({ song, onClose, onNext, onPrev }) {
  const navigate = useNavigate();

  const [playing, setPlaying] = useState(true);
  const [currentSongId, setCurrentSongId] = useState(null);
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setPlaying(true);
    }
  };

  // Handle song changes
  useEffect(() => {
    if (song?.id !== currentSongId) {
      setCurrentSongId(song?.id);
      
      if (audioRef.current) {
        // Always pause and reset first
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        // Small delay to ensure previous audio is stopped
        setTimeout(() => {
          if (playing && audioRef.current && song?.audioUrl) {
            audioRef.current.play().catch(console.error);
          }
        }, 50);
      }
    }
  }, [song?.id, song?.audioUrl, currentSongId, playing]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => {
      setPlaying(false);
      // Optionally auto-play next song
      // onNext();
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (!song) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-lg flex items-center gap-3 p-3 w-[320px] border dark:border-zinc-700">
      <audio 
        ref={audioRef} 
        src={song.audioUrl} 
        preload="metadata"
      />

      <img src={song.imageUrl} alt="cover" className="w-14 h-14 rounded-lg object-cover" />

      <div className="flex-1 overflow-hidden">
        <button onClick={() => navigate(`/player/${song.id}`)} className="hover:underline text-sm font-semibold truncate">{song.title}</button>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>

      <button onClick={onPrev} className="text-xl" title="Previous">
        <IoChevronBackSharp />
      </button>
      <button onClick={togglePlayPause} className="text-xl">
        {playing ? <IoPause /> : <IoPlay />}
      </button>
      <button onClick={onNext} className="text-xl" title="Next">
        <IoChevronForwardSharp />
      </button>

      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
