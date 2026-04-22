import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoPause, IoPlay, IoChevronForwardSharp } from "react-icons/io5";
import {
  ChevronDown,
  ChevronUp,
  ListMusic,
  Play,
  Repeat,
  Repeat1,
  X,
} from "lucide-react";
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
    queue,
    clearQueue,
    removeFromQueue,
    playSong,
    playNextInQueue,
  } = useMusic();
  const [audioUrl, setAudioUrl] = useState("");
  const [song, setSong] = useState(null);
  const [queueSongs, setQueueSongs] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false); // Add isLooping state
  const [isExpanded, setIsExpanded] = useState(() => {
    return localStorage.getItem("miniplayer-expanded") === "true";
  });
  const audioRef = useRef(null);
  const isSeeking = useRef(false);
  const hasAutoPlayed = useRef(false);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0",
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

  const playNext = () => {
    const nextSongId = playNextInQueue();
    if (nextSongId) {
      setCurrentTime(0);
      setCurrent(0);
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

  useEffect(() => {
    if (queue.length === 0) {
      setQueueSongs([]);
      return;
    }

    let mounted = true;

    const fetchQueueSongs = async () => {
      try {
        setLoadingQueue(true);
        const responses = await Promise.all(
          queue.map((songId) => getSongById(songId)),
        );

        if (!mounted) return;

        const items = responses
          .map((res, index) => {
            const queuedSong = res?.data?.[0];
            if (!queuedSong) return null;

            return {
              id: queue[index],
              name: queuedSong.name,
              artist:
                queuedSong.artists?.primary?.[0]?.name ||
                queuedSong.primaryArtists ||
                "Unknown Artist",
              image:
                queuedSong.image?.[1]?.url || queuedSong.image?.[0]?.url || "",
              duration: queuedSong.duration,
            };
          })
          .filter(Boolean);

        setQueueSongs(items);
      } catch (error) {
        if (mounted) {
          setQueueSongs([]);
        }
      } finally {
        if (mounted) {
          setLoadingQueue(false);
        }
      }
    };

    fetchQueueSongs();

    return () => {
      mounted = false;
    };
  }, [queue]);

  useEffect(() => {
    localStorage.setItem("miniplayer-expanded", String(isExpanded));
  }, [isExpanded]);

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
        playNext();
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
  }, [
    audioUrl,
    current,
    setCurrent,
    setDuration,
    setPlaying,
    isLooping,
    playNext,
  ]);

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

  const playQueuedSong = (songId) => {
    removeFromQueue(songId);
    playSong(songId);
  };

  if (!song) return null;

  return (
    <div
      className={`fixed z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border dark:border-zinc-700 overflow-hidden flex flex-col transition-all duration-300 ease-out bottom-3 left-3 right-3 sm:bottom-4 sm:left-auto sm:right-4 sm:w-95 ${
        isExpanded ? "h-[75vh] sm:h-96" : "h-29"
      }`}
    >
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
      <div className="flex items-center gap-3 p-3 border-b border-zinc-200/60 dark:border-zinc-700/80">
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
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            title={isExpanded ? "Collapse queue" : "Expand queue"}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
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
            onClick={playNext}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            title={
              queue.length > 0 ? "Play next in queue" : "No songs in queue"
            }
            disabled={queue.length === 0}
          >
            <IoChevronForwardSharp className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        className={`px-3 pt-2 pb-3 flex-1 min-h-0 flex flex-col transition-all duration-250 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <ListMusic className="h-4 w-4" />
            <p className="text-xs font-medium uppercase tracking-wide">
              Up Next
            </p>
          </div>
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors"
              title="Clear queue"
            >
              Clear
            </button>
          )}
        </div>

        {loadingQueue && (
          <div className="space-y-2 animate-pulse">
            <div className="h-11 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-11 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-11 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}

        {!loadingQueue && queueSongs.length === 0 && (
          <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
            Queue is empty
          </div>
        )}

        {!loadingQueue && queueSongs.length > 0 && (
          <ul className="space-y-2 overflow-y-auto pr-1">
            {queueSongs.map((queuedSong) => (
              <li
                key={queuedSong.id}
                className="group rounded-lg px-2 py-1.5 bg-zinc-100/70 hover:bg-zinc-200/80 dark:bg-zinc-800/70 dark:hover:bg-zinc-700/70 transition-colors flex items-center gap-2"
              >
                <img
                  src={queuedSong.image}
                  alt={queuedSong.name}
                  className="h-8 w-8 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate text-zinc-900 dark:text-zinc-100">
                    {queuedSong.name}
                  </p>
                  <p className="text-[11px] truncate text-zinc-500 dark:text-zinc-400">
                    {queuedSong.artist} • {formatTime(queuedSong.duration)}
                  </p>
                </div>
                <button
                  onClick={() => playQueuedSong(queuedSong.id)}
                  className="h-6 w-6 rounded-full bg-amber-700 hover:bg-amber-600 text-white flex items-center justify-center cursor-pointer transition-colors"
                  title="Play now"
                >
                  <Play className="h-3 w-3" />
                </button>
                <button
                  onClick={() => removeFromQueue(queuedSong.id)}
                  className="h-6 w-6 rounded-full bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 flex items-center justify-center cursor-pointer transition-colors"
                  title="Remove from queue"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
