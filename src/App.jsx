import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AudioPlayer from "./pages/AudioPlayer";
import { MusicProvider } from "./context/MusicProvider";
import MiniPlayer from "./components/player/MiniPlayer";
import "./index.css";
import { Toaster } from "react-hot-toast";
import SearchPage from "./pages/SearchPage";
import AlbumPage from "./pages/AlbumPage";
import { ReactLenis } from "lenis/react";

// Component to conditionally render MiniPlayer based on route
function ConditionalMiniPlayer() {
  const location = useLocation();

  // Routes where MiniPlayer should NOT be shown
  const excludedRoutes = ["/", "/player"];

  // Check if current route should exclude MiniPlayer
  const shouldHideMiniPlayer = excludedRoutes.some((route) => {
    if (route === "/") {
      return location.pathname === "/";
    }
    if (route === "/player") {
      return location.pathname.startsWith("/player/");
    }
    return false;
  });

  // Don't render MiniPlayer on excluded routes
  if (shouldHideMiniPlayer) {
    return null;
  }

  return <MiniPlayer />;
}

function App() {
  const lenisOptions = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 2,
  };

  return (
    <>
      <Toaster />
      <MusicProvider>
        <ReactLenis root options={lenisOptions}>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/player/:id" element={<AudioPlayer />} />
              <Route path="/search/:id" element={<SearchPage />} />
              <Route path="/album/:id" element={<AlbumPage />} />
            </Routes>
            <ConditionalMiniPlayer />
          </Router>
        </ReactLenis>
      </MusicProvider>
    </>
  );
}

export default App;
