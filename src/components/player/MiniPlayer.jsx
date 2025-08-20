import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoPause,
  IoPlay,
  IoChevronForwardSharp,
  IoChevronBackSharp,
} from "react-icons/io5";
import { X, ExternalLink, Repeat, Repeat1 } from "lucide-react";
import { useMusic } from "../../context/MusicProvider";
import { getSongById } from "../../utils/api";
import { Slider } from "../ui/slider";

export default function MiniPlayer() {
  const navigate = useNavigate();
  const {
    music,
    setMusic,
    current,
    setCurrent,
    duration,
    setDuration,
    playing,
    setPlaying,
  } = useMusic();
  const [audioUrl, setAudioUrl] = useState("");
  const [song, setSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false); // Add isLooping state
  const audioRef = useRef(null);
  const isSeeking = useRef(false);
  const hasAutoPlayed = useRef(false);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleSeek = (value) => {
    if (audioRef.current && value.length > 0) {
      const seekTime = value[0];
      isSeeking.current = true;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      setCurrent(seekTime);
      setTimeout(() => {
        isSeeking.current = false;
      }, 100);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const loopSong = () => {
    if (audioRef.current) {
      const newLoopState = !isLooping;
      audioRef.current.loop = newLoopState;
      setIsLooping(newLoopState);
      // Save loop state to localStorage for persistence
      localStorage.setItem("is-looping", newLoopState.toString());
    }
  };

  // First useEffect: Load song data
  useEffect(() => {
    if (!music) return;

    async function getSongDetails() {
      try {
        const res = await getSongById(music);

        if (res && res.data && res.data.length > 0) {
          const songData = res.data[0];
          setSong(songData);

          const audioUrl =
            songData.downloadUrl?.[4]?.url ||
            songData.downloadUrl?.[3]?.url ||
            songData.downloadUrl?.[2]?.url ||
            songData.downloadUrl?.[1]?.url ||
            songData.downloadUrl?.[0]?.url;

          if (audioUrl) {
            setAudioUrl(audioUrl);
            localStorage.setItem("last-played", music);
            hasAutoPlayed.current = false;
          }
        }
      } catch (error) {
        console.log("Error playing song in miniplayer: ", error);
      }
    }

    getSongDetails();
  }, [music]);

  // Second useEffect: Setup audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleTimeUpdate = () => {
      if (!isSeeking.current) {
        const currentTime = audio.currentTime;
        setCurrentTime(currentTime);
        setCurrent(currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);

      // Restore loop state from localStorage
      const savedLoopState = localStorage.getItem("is-looping");
      if (savedLoopState) {
        const shouldLoop = savedLoopState === "true";
        setIsLooping(shouldLoop);
        audio.loop = shouldLoop;
      }

      // Sync with global current state (prioritize over localStorage)
      if (current && !isNaN(parseFloat(current))) {
        audio.currentTime = parseFloat(current);
        setCurrentTime(parseFloat(current));
      } else {
        // Fallback to localStorage if no global current
        const savedTime = localStorage.getItem("current-time");
        if (savedTime && !isNaN(parseFloat(savedTime))) {
          audio.currentTime = parseFloat(savedTime);
          setCurrentTime(parseFloat(savedTime));
        }
      }
    };

    const handleCanPlay = () => {
      // Auto-play when song is first loaded and ready
      if (!hasAutoPlayed.current) {
        setPlaying(true);
        hasAutoPlayed.current = true;
      }
    };

    const handleEnded = () => {
      // Handle song end (only if not looping, as loop is handled automatically)
      if (!isLooping) {
        setPlaying(false);
        setCurrentTime(0);
        setCurrent(0);
      }
    };

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
      }
    };
  }, [audioUrl, current, setCurrent, setDuration, setPlaying, isLooping]);

  // Third useEffect: Handle play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (playing) {
      audio.play().catch((error) => {
        console.log("Auto-play failed:", error);
      });
    } else {
      audio.pause();
    }
  }, [audioUrl, playing]);

  // Fourth useEffect: Sync with global current time when it changes significantly
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current || isSeeking.current) return;

    const timeDiff = Math.abs(audio.currentTime - current);

    // Only sync if there's a significant difference (> 1 second)
    if (timeDiff > 1) {
      audio.currentTime = current;
      setCurrentTime(current);
    }
  }, [current]);

  const onClose = () => {
    setMusic(null);
    setSong(null);
    setAudioUrl("");
    setIsLooping(false);
    hasAutoPlayed.current = false;
    localStorage.removeItem("last-played");
    localStorage.removeItem("current-time");
    localStorage.removeItem("is-looping");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
  };

  if (!song) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border dark:border-zinc-700 w-[380px] overflow-hidden">
      <audio ref={audioRef} src={audioUrl} />

      {/* Progress Bar */}
      <div className="w-full">
        {!duration ? (
          <div className="h-1 w-full bg-neutral-800" />
        ) : (
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.01}
            onValueChange={handleSeek}
            className="w-full group"
            trackClassName="h-1 transition-[height] group-hover:h-2 rounded-none"
            thumbClassName="hidden group-hover:block"
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-3 p-3">
        <img
          src={song.image?.[2]?.url}
          alt="cover"
          className="w-14 h-14 rounded-lg object-cover"
        />

        <div className="flex-1 overflow-hidden">
          <button
            onClick={() => navigate(`/player/${song.id}`)}
            className="hover:underline text-sm font-semibold truncate block w-full text-left"
          >
            {song?.name}
          </button>
          <p className="text-xs text-muted-foreground truncate">
            {song.artists?.primary?.[0]?.name || "Unknown Artist"}
          </p>

          {/* Time Display */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>•</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={loopSong}
            className={`p-1 rounded transition-colors ${
              isLooping
                ? "text-amber-500 hover:text-amber-600"
                : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title={isLooping ? "Disable loop" : "Enable loop"}
          >
            {isLooping ? (
              <Repeat1 className="h-4 w-4" />
            ) : (
              <Repeat className="h-4 w-4" />
            )}
          </button>
          <button onClick={togglePlayPause} className="text-lg mx-1">
            {playing ? <IoPause /> : <IoPlay />}
          </button>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
