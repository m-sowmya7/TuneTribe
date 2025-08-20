import { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { useMusic } from "../context/MusicProvider";
import { getSongById, getSongSuggestions } from "../utils/api";
import toast from "react-hot-toast";
import { Play, Pause, RefreshCw, Download, Share2 } from "lucide-react";
import { Button, Slider, Navbar } from "../components/index";

function AudioPlayer() {
  const { id } = useParams();
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const { current, setCurrent, duration, setDuration, playing, setPlaying } =
    useMusic();

  const [audioUrl, setAudioUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextSong, setNextSong] = useState(null);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  // const [downloadUrl, setDownloadUrl] = useState("");
  // const [isDownloading, setIsDownloading] = useState(false);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const getSong = async () => {
    try {
      setLoading(true);
      const song = await getSongById(id);

      if (song && song.data && song.data.length > 0) {
        const songData = song.data[0];
        setData(songData);

        if (songData.url) {
          if (songData.downloadUrl[4]?.url)
            setAudioUrl(songData.downloadUrl[4].url);
          else if (songData.downloadUrl[3]?.url)
            setAudioUrl(songData.downloadUrl[3].url);
          else if (songData.downloadUrl[2]?.url)
            setAudioUrl(songData.downloadUrl[2].url);
          else if (songData.downloadUrl[1]?.url)
            setAudioUrl(songData.downloadUrl[1].url);
          else if (songData.downloadUrl[0]?.url)
            setAudioUrl(songData.downloadUrl[0].url);

          localStorage.setItem("last-played", id);
          fetchRecommendedSongs(id);
        } else {
          setError("Song data not found");
        }
      } else {
        setError("Song data not found");
      }
    } catch (err) {
      console.error("Error loading song:", err);
      setError("Failed to load song");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedSongs = async (songId) => {
    try {
      const res = await getSongSuggestions(songId);
      if (res.data && res.data.length > 0) {
        // Get top 3 recommendations
        const topRecommendations = res.data.slice(0, 3);
        setRecommendedSongs(topRecommendations);

        // Set the first song as the next song to play
        setNextSong(topRecommendations[0]);
      }
    } catch (err) {
      console.error("Error Fetching recommended songs:", err);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err);
          toast.error("Failed to play audio");
        });
      }
      setPlaying(!playing);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current && value.length > 0) {
      const seekTime = value[0];
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const loopSong = () => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
      setIsLooping(!isLooping);
      toast.success(isLooping ? "Loop disabled" : "Loop enabled");
    }
  };

  // const downloadSong = async () => {
  //   if (!audioUrl || !data) return;

  //   try {
  //     setIsDownloading(true);
  //     toast.loading("Downloading...");

  //     const response = await fetch(downloadUrl);
  //     const blob = await response.blob();
  //     const url = URL.createObjectURL(blob);

  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${data.name + "-Tune-Tribe" || "music"}.mp3`;
  //     a.click();

  //     URL.revokeObjectURL(url);
  //     toast.dismiss();
  //     toast.success("Download completed!");
  //   } catch (err) {
  //     console.error("Error downloading song:", err);
  //     toast.dismiss();
  //     toast.error("Failed to download song");
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch (err) {
      console.error("Error sharing song:", err);
      toast.error("Failed to share song");
    }
  };

  const playRecommendedSong = (songId) => {
    navigate(`/player/${songId}`);
  };

  useEffect(() => {
    if (id) {
      getSong();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        setCurrent(0);
      }
    };
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setCurrent(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (!isLooping && nextSong) {
        playRecommendedSong(nextSong.id);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", () => setPlaying(true));
    audio.addEventListener("pause", () => setPlaying(false));

    if (current && !isNaN(parseFloat(current))) {
      audio.currentTime = parseFloat(current);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", () => setPlaying(true));
      audio.removeEventListener("pause", () => setPlaying(false));
    };
  }, [audioRef.current, isLooping, nextSong]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }
  }, [audioUrl]);

  // New useEffect to auto-play once the audio URL is set
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      // Small delay to ensure the audio element has properly loaded the source
      const playPromise = setTimeout(() => {
        audioRef.current
          .play()
          .then(() => {
            setPlaying(true);
          })
          .catch((error) => {
            console.error("Auto-play failed:", error);
          });
      }, 300);

      return () => clearTimeout(playPromise);
    }
  }, [audioUrl]);

  const getArtistName = (song) => {
    if (song?.artists?.primary?.[0]?.name) {
      return song.artists.primary[0].name;
    }
    return song?.primaryArtists || "Unknown Artist";
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="bg-neutral-900 p-8 rounded-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-black min-h-screen text-white pb-20">
      <Navbar />
      {/* Hidden audio element */}
      <audio ref={audioRef}></audio>

      <div className="px-4 sm:px-6 md:px-30 py-8 max-w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Album Art */}
          <div className="md:w-1/7">
            <img
              src={data.image?.[2]?.url || ""}
              alt={data.name}
              className="w-full aspect-square object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Song Information */}
          <div className="md:w-full flex flex-col">
            <h1 className="text-xl font-Bricolage Grotesque mb-1">
              {data.name}
            </h1>
            <p className="text-sm text-zinc-400 mb-2">
              by {getArtistName(data)}
            </p>

            {/* Progress Bar */}
            <div className="mt-4">
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.01}
                onValueChange={handleSeek}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-zinc-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="bg-amber-800 hover:bg-amber-700 rounded-full w-10 h-8 flex items-center justify-center"
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-1" />
                )}
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={loopSong}
                  className={`${
                    isLooping ? "text-amber-500" : "text-white"
                  } hover:bg-transparent hover:opacity-75`}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={downloadSong}
                  disabled={isDownloading}
                  className="text-white hover:bg-transparent hover:opacity-75"
                >
                  <Download className="h-4 w-4" />
                </Button> */}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-white hover:bg-transparent hover:opacity-75"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Song Recommendations */}
        {recommendedSongs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
            <p className="text-sm text-zinc-400 mb-6">You might like these</p>
            <div className="space-y-3">
              {/* First song - next in autoplay */}
              <div
                className="bg-neutral-800 rounded-md overflow-hidden hover:bg-neutral-700 transition-all cursor-pointer"
                onClick={() => playRecommendedSong(recommendedSongs[0].id)}
              >
                <div className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    {recommendedSongs[0].image && (
                      <img
                        src={
                          recommendedSongs[0].image.find(
                            (img) => img.quality === "150x150"
                          )?.url || recommendedSongs[0].image[0]?.url
                        }
                        alt={recommendedSongs[0].name}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {recommendedSongs[0].name}
                    </h3>
                    <p className="text-zinc-400 text-sm truncate">
                      {getArtistName(recommendedSongs[0])}
                    </p>
                    <p className="text-amber-500 text-xs">
                      Plays next • {formatTime(recommendedSongs[0].duration)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-amber-800 hover:bg-amber-700 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0"
                  >
                    <Play className="h-5 w-5 ml-0.5" />
                  </Button>
                </div>
              </div>

              {/* Second and third recommendations */}
              {recommendedSongs.slice(1, 3).map((song, index) => (
                <div
                  key={song.id}
                  className="bg-neutral-800 rounded-md overflow-hidden hover:bg-neutral-700 transition-all cursor-pointer"
                  onClick={() => playRecommendedSong(song.id)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      {song.image && (
                        <img
                          src={
                            song.image.find((img) => img.quality === "150x150")
                              ?.url || song.image[0]?.url
                          }
                          alt={song.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {song.name}
                      </h3>
                      <p className="text-zinc-400 text-sm truncate">
                        {getArtistName(song)}
                      </p>
                      <p className="text-zinc-500 text-xs">
                        {formatTime(song.duration)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-neutral-700 hover:bg-neutral-600 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0"
                    >
                      <Play className="h-5 w-5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioPlayer;
