import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components";
import { useSearchResults } from "../hooks/useSearchResults";
import { ResultsSection } from "../components/index";


export default function SearchPage() {
  const { id: query } = useParams();
  const { songs, albums, artists, loading, error } = useSearchResults(query);
  const [activeSong, setActiveSong] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div
              className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-700 border-t-amber-500"
              role="status"
              aria-label="Loading"
            />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <ResultsSection
            title="Search Results"
            subtitle={`Results for "${query}"`}
            songs={songs}
            albums={albums}
            artists={artists}
            setActiveSong={setActiveSong}
          />
        )}
      </div>
    </div>
  );
}