import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListMusic, Play, X } from "lucide-react";
import { useMusic } from "../../context/MusicProvider";
import { getSongById } from "../../utils/api";

export default function QueuePanel() {
  const navigate = useNavigate();
  const { queue, clearQueue, removeFromQueue, playSong } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const queueIds = useMemo(() => [...queue], [queue]);

  useEffect(() => {
    if (!expanded || queueIds.length === 0) {
      setItems([]);
      return;
    }

    let mounted = true;

    const fetchQueueItems = async () => {
      try {
        setLoading(true);
        const responses = await Promise.all(
          queueIds.map((songId) => getSongById(songId)),
        );

        if (!mounted) return;

        const normalized = responses
          .map((res, index) => {
            const song = res?.data?.[0];
            if (!song) return null;

            return {
              id: queueIds[index],
              name: song.name,
              artist:
                song.artists?.primary?.[0]?.name ||
                song.primaryArtists ||
                "Unknown Artist",
              image: song.image?.[1]?.url || song.image?.[0]?.url || "",
              duration: song.duration,
            };
          })
          .filter(Boolean);

        setItems(normalized);
      } catch (error) {
        if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchQueueItems();

    return () => {
      mounted = false;
    };
  }, [expanded, queueIds]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const playFromQueue = (songId) => {
    removeFromQueue(songId);
    playSong(songId);
    navigate(`/player/${songId}`);
  };

  return (
    <section className="mt-10 rounded-2xl border border-neutral-800 bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 overflow-hidden">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-5 py-4 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors"
        title={expanded ? "Hide queue" : "Show queue"}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
            <ListMusic className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Play Queue</p>
            <p className="text-xs text-zinc-400">
              {queue.length === 0
                ? "No songs queued"
                : `${queue.length} songs up next`}
            </p>
          </div>
        </div>
        <span className="text-zinc-300 text-xs">
          {expanded ? "Collapse" : "Expand"}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 px-4 py-3">
            {queue.length > 0 && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={clearQueue}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer transition-colors"
                  title="Clear queue"
                >
                  Clear all
                </button>
              </div>
            )}

            {loading && (
              <div className="space-y-2 animate-pulse">
                <div className="h-12 rounded-lg bg-neutral-800" />
                <div className="h-12 rounded-lg bg-neutral-800" />
              </div>
            )}

            {!loading && queue.length === 0 && (
              <div className="py-6 text-center text-sm text-zinc-500">
                Queue is empty
              </div>
            )}

            {!loading && queue.length > 0 && (
              <ul className="space-y-2">
                {items.map((song, index) => (
                  <li
                    key={song.id}
                    className="group rounded-xl bg-white/5 border border-white/5 p-2 flex items-center gap-3 hover:bg-white/10 transition-all"
                    style={{
                      animation: `fadeIn 220ms ease ${index * 40}ms both`,
                    }}
                  >
                    <img
                      src={song.image}
                      alt={song.name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <div className="min-w-0 grow">
                      <p className="text-sm text-white truncate">{song.name}</p>
                      <p className="text-xs text-zinc-400 truncate">
                        {song.artist} • {formatTime(song.duration)}
                      </p>
                    </div>
                    <button
                      onClick={() => playFromQueue(song.id)}
                      className="h-8 w-8 rounded-full bg-amber-700/80 hover:bg-amber-600 text-white flex items-center justify-center cursor-pointer transition-colors"
                      title="Play now"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(song.id)}
                      className="h-8 w-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                      title="Remove from queue"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
