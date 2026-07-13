import { useState } from "react";
import MiniPlayer from "../player/MiniPlayer";
import { useMusic } from "../../context/MusicProvider";
import { CircleCheck, ListPlus } from "lucide-react";

function SongCard({ song }) {
  const { playSong, addToQueue, isInQueue } = useMusic();

  const id = song.id;
  const primaryArtist = song.artists?.primary?.[0];
  const imageUrl =
    song.image?.find(
      (img) => img.quality === "500x500" || img.quality === "high",
    )?.url || song.image?.[0]?.url;
  const artistName = primaryArtist ? primaryArtist.name : "Unknown Artist";
  const isQueued = isInQueue(song.id);

  const handlePlay = () => {
    playSong(song.id);
  };

  const handleAddToQueue = (event) => {
    event.stopPropagation();
    if (isQueued) return;
    addToQueue(song.id);
  };

  return (
    <div
      className="w-44 h-58 shrink-0 cursor-pointer transition-transform hover:scale-105"
      onClick={handlePlay}
    >
      <div className="relative w-full h-44 rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt={song.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2">
          <button className="bg-black/60 hover:bg-black/80 transition-colors rounded-full p-2 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.5 5.5a.75.75 0 011.165-.638l6 4a.75.75 0 010 1.276l-6 4A.75.75 0 016.5 13.5v-8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-2 right-2">
          <button
            onClick={handleAddToQueue}
            title={isQueued ? "Already in queue" : "Add to queue"}
            className={`transition-colors rounded-full p-1.5 text-white text-xs shadow-lg ${
              isQueued
                ? "bg-emerald-600/80 cursor-default"
                : "bg-black/60 hover:bg-black/80 cursor-pointer"
            }`}
            disabled={isQueued}
          >
            {isQueued ? (
              <CircleCheck className="h-3.5 w-3.5" />
            ) : (
              <ListPlus className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
      <h3 className="text-white mt-2 text-sm font-semibold truncate">
        {song.name}
      </h3>
      <p className="text-gray-400 text-xs truncate">{artistName}</p>
    </div>
  );
}

export default SongCard;
